import { Server, Socket } from "socket.io";
import { randomUUID } from "crypto";
import {
  createPeer,
  addPeerToRoom,
  getPeersInRoom,
  getPeer,
} from "../../services/redis.js";
import { logger } from "../../utils/logger.js";

export const handleRoomEvents = (io: Server, socket: Socket) => {
  // Event 2.1: Client sends { roomId, name }
  socket.on(
    "joinRoom",
    async ({ roomId, name }: { roomId: string; name: string }) => {
      try {
        // 1. Generate peerId
        const peerId = randomUUID();

        // 2. Store in Redis
        await createPeer(peerId, { socketId: socket.id, roomId, name });
        await addPeerToRoom(roomId, peerId);

        // 3. Join the actual Socket.IO room for broadcasting
        socket.join(roomId);

        // 4. Fetch existing peers in the room
        const peerIds = await getPeersInRoom(roomId);

        //TODO : Add Redis-lua script to avoid race condition for leave and join
        // Faster way:
        const peerPromises = peerIds
          .filter((id) => id !== peerId)
          .map((id) => getPeer(id).then((data) => ({ peerId: id, ...data })));

        const results = await Promise.all(peerPromises);
        const existingPeers = results.filter((p) => Object.keys(p).length > 1); // >1 because it has peerId

        // 5. Send existing users to the joining client
        socket.emit("existing-users", existingPeers);

        // 6. Notify all OTHER clients in the room
        const newPeerData = { peerId, socketId: socket.id, roomId, name };
        socket.to(roomId).emit("user-joined", newPeerData);

        logger.info(
          `👤 User [${name}] joined room [${roomId}] with peerId: ${peerId}`,
        );
      } catch (error) {
        logger.error("🔴 Error in joinRoom flow: %s", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    },
  );
};
