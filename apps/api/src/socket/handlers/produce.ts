import { Server, Socket } from "socket.io";

import { getRouter, getTransport, produce } from "../../rtc/sfu/index.js";
import { getPeerBySocket } from "../../services/redis.js";

export const handleProduce = (io: Server, socket: Socket) => {
  socket.on("produce", async ({ roomId, kind, rtpParameters }, cb) => {
    try {
      const userId = await getPeerBySocket(socket.id);
      if (!userId) {
        throw new Error("No peerId associated with socket id");
      }
      const transport = getTransport(userId, roomId, "c2s");
      const router = getRouter(roomId);
      // TODO: check if a user himself exist in the room

      const { producerId } = await produce(
        userId,
        roomId,
        transport,
        kind,
        rtpParameters,
        router.id,
      );

      // Notify other clients in the room about the new producer
      socket.to(roomId).emit("newProducer", {
        producerId,
        producerUserId: userId,
        kind,
      });

      cb({ id: producerId });
    } catch (err) {
      cb({ error: err instanceof Error ? err.message : "Failed to make a producer" });
    }
  });
};

// TODO: Need to create a handleProduceDisconnect
