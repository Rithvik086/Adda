import { Server, Socket } from "socket.io";

import { getRouter, getTransport, produce } from "../../rtc/sfu/index.js";
import { getPeerBySocket } from "../../services/redis.js";

export const handleProduce = (io: Server, socket: Socket) => {
  socket.on("produce", async ({ roomId, kind, rtpParameters }) => {
    try {
      const userId = await getPeerBySocket(socket.id);
      if (!userId) {
        throw new Error("No peerId associated with socket id");
      }
      const transport = getTransport(userId, roomId);
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

      socket.emit("produced", { producerId });
    } catch (err) {
      socket.emit("error", {
        message: "Failed to make a producer",
      });
    }
  });
};

// TODO: Need to create a handleProduceDisconnect
