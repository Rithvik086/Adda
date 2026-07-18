"use client";

import { useEffect, useState, useRef } from "react";
import type { Participant, Room } from "@repo/types";
import { useSocket } from "../../../lib/socket";
import {
  getDevice,
  initDevice,
  initRecvTransport,
  initSendTransport,
  loadRtpCapabilities,
  produceAudio,
} from "../../../lib/sfu";
import { RoomHeader } from "../../../components/room/RoomHeader";
import { ParticipantList } from "../../../components/room/ParticipantList";
import { RoomControls } from "../../../components/room/RoomControls";
import { RoomTimer } from "../../../components/room/RoomTimer";
import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
  RtpCapabilities,
} from "mediasoup-client/types";

interface ActiveRoomViewProps {
  room: Room;
}

type TransportInfo = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
  direction: string;
};

type PeerPayload = {
  peerId: string;
  socketId: string;
  roomId: string;
  name: string;
};

const avatarPalette = [
  "#6e3bd7",
  "#a70138",
  "#1a7a5c",
  "#5e2c91",
  "#1f5fbf",
  "#b05d00",
  "#2d7d8c",
  "#7a3b1f",
];

const colorFromId = (id: string) => {
  const hash = Array.from(id).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  return avatarPalette[hash % avatarPalette.length] ?? "#6e3bd7";
};

const toParticipant = (
  peer: Pick<PeerPayload, "peerId" | "name">,
): Participant => ({
  id: peer.peerId,
  name: peer.name,
  avatarColor: colorFromId(peer.peerId),
  status: "ONLINE",
});

export const ActiveRoomView = ({ room }: ActiveRoomViewProps) => {
  const { socket } = useSocket();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const consumerTransportRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem("adda.displayName")?.trim();
    setDisplayName(stored && stored.length > 0 ? stored : "Guest");
  }, []);

  useEffect(() => {
    if (!displayName) return;
    if (!socket) return;

    const emitJoin = async (): Promise<void> => {
      const success: boolean = await socket.emitWithAck("joinRoom", payload);
      if (!success) {
        throw new Error("join room failed, server side");
      }
    };

    const getRtpCapabilities = async (
      roomId: string,
    ): Promise<RtpCapabilities> => {
      const rtpData = await socket.emitWithAck("getRouterRtpCapabilities", {
        roomId,
      });
      return rtpData.data;
    };

    const emitCreateTransport = async (
      direction: "c2s" | "s2c",
    ): Promise<TransportInfo> => {
      return await socket.emitWithAck("createTransport", {
        roomId: room.id,
        direction,
      });
    };

    const payload = { roomId: room.id, name: displayName };
    const pendingProducers = new Set<string>();

    const consumeProducer = async (producerId: string) => {
      try {
        const transport = consumerTransportRef.current;
        if (!transport) {
          console.log(
            "Consumer transport not ready yet, queuing producer:",
            producerId,
          );
          pendingProducers.add(producerId);
          return;
        }

        const device = await getDevice();
        const res = await socket.emitWithAck("consume", {
          roomId: room.id,
          rtpCapabilities: device.recvRtpCapabilities,
          producerId,
        });

        if (res.error) {
          console.error("consume socket request failed:", res.error);
          return;
        }

        console.log(
          "Consumer parameters received, consuming track for producer:",
          producerId,
        );

        // Create Consumer
        const consumer = await transport.consume(res.data);
        const audioTrack = consumer.track;

        // Resume consumer on the server now that the client-side consumer is ready
        await socket.emitWithAck("resumeConsumer", { consumerId: res.data.id });

        const remoteAudioElement = document.createElement("audio");
        remoteAudioElement.autoplay = true;
        remoteAudioElement.setAttribute("playsinline", "true");
        remoteAudioElement.srcObject = new MediaStream([audioTrack]);

        document.body.appendChild(remoteAudioElement);

        remoteAudioElement.play().catch((error) => {
          console.log(
            "Autoplay was blocked by the browser. interaction might be required:",
            error,
          );
        });
      } catch (err) {
        console.error("Failed to consume producer:", producerId, err);
      }
    };

    const mainLogic = async () => {
      try {
        await initDevice();

        const device = await getDevice();
        await emitJoin();

        const rtpCapabilities = await getRtpCapabilities(room.id);

        await loadRtpCapabilities(rtpCapabilities);

        // Send transport (producer)
        const sendTransportData = await emitCreateTransport("c2s");
        const producerTransport = await initSendTransport(
          device,
          sendTransportData,
        );
        if (!producerTransport)
          throw new Error("producer transport creation failed");

        producerTransport.on("connectionstatechange", (state) => {
          console.log(`📡 Producer Transport State: ${state}`);
        });

        producerTransport.on("connect", async ({ dtlsParameters }, cb) => {
          const res = await socket.emitWithAck("connectTransport", {
            roomId: room.id,
            direction: "c2s",
            dtlsParameters,
          });
          if (res.error) {
            console.error(
              "connectTransport failed for producer transport:",
              res.error,
            );
            return;
          }
          cb();
        });

        producerTransport.on("produce", async (parameters, cb) => {
          const res = await socket.emitWithAck("produce", {
            ...parameters,
            roomId: room.id,
          });
          if (res.error) {
            console.error("produce failed:", res.error);
            return;
          }
          cb({ id: res.id });
        });

        const producer = await produceAudio(producerTransport);
        if (!producer) throw new Error("producer creation failed");

        // Receive transport (consumer)
        const recvTransportData = await emitCreateTransport("s2c");
        const consumerTransport = await initRecvTransport(
          device,
          recvTransportData,
        );
        if (!consumerTransport)
          throw new Error("consumer transport creation failed");

        consumerTransport.on("connectionstatechange", (state) => {
          console.log(`🎧 Consumer Transport State: ${state}`);
        });

        consumerTransport.on("connect", async ({ dtlsParameters }, cb) => {
          const res = await socket.emitWithAck("connectTransport", {
            roomId: room.id,
            direction: "s2c",
            dtlsParameters,
          });
          if (res.error) {
            console.error(
              "connectTransport failed for consumer transport:",
              res.error,
            );
            return;
          }
          cb();
        });

        consumerTransportRef.current = consumerTransport;

        // Process any pending producers queued before consumer transport was ready
        const producersToProcess = Array.from(pendingProducers);
        pendingProducers.clear();
        for (const pId of producersToProcess) {
          await consumeProducer(pId);
        }
      } catch (err) {
        console.error("failed the main logic with err:", err);
      }
    };

    const handleNewProducer = ({ producerId }: { producerId: string }) => {
      consumeProducer(producerId);
    };

    const handleExistingProducers = (
      producers: Array<{ producerId: string }>,
    ) => {
      producers.forEach((p) => consumeProducer(p.producerId));
    };

    socket.on("newProducer", handleNewProducer);
    socket.on("existingProducers", handleExistingProducers);

    if (socket.connected) {
      mainLogic();
    } else {
      socket.once("connect", emitJoin);
    }

    return () => {
      socket.off("connect", emitJoin);
      socket.off("newProducer", handleNewProducer);
      socket.off("existingProducers", handleExistingProducers);
    };
  }, [displayName, room.id, socket]);

  useEffect(() => {
    if (!displayName) return;
    if (!socket) return;

    const selfId = `self-${socket.id ?? "local"}`;
    const selfParticipant: Participant = {
      id: selfId,
      name: displayName,
      avatarColor: colorFromId(selfId),
      status: "ONLINE",
    };

    setParticipants((prev) => {
      const withoutSelf = prev.filter((p) => p.id !== selfId);
      return [selfParticipant, ...withoutSelf];
    });

    const handleExistingUsers = (peers: PeerPayload[]) => {
      const mapped = peers.map((peer) => toParticipant(peer));
      setParticipants([selfParticipant, ...mapped]);
    };

    const handleUserJoined = (peer: PeerPayload) => {
      setParticipants((prev) => {
        if (prev.some((p) => p.id === peer.peerId)) return prev;
        return [...prev, toParticipant(peer)];
      });
    };

    const handleUserLeft = ({ peerId }: { peerId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.id !== peerId));
    };

    socket.on("existingUsers", handleExistingUsers);
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);

    return () => {
      socket.off("existingUsers", handleExistingUsers);
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
    };
  }, [displayName, socket]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="grow px-6 pt-12 pb-28 max-w-screen-xl mx-auto w-full">
        <RoomHeader
          participantCount={participants.length}
          roomName={room.name}
        />
        <ParticipantList participants={participants} />
        <RoomTimer closesInMinutes={room.closesInMinutes} />
      </main>

      {/* Bottom controls */}
      <RoomControls
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        isVideoOff={isVideoOff}
        onToggleVideo={() => setIsVideoOff((prev) => !prev)}
      />
    </div>
  );
};
