import { Server, Socket } from "socket.io";
import {
  consume,
  getTransport,
  getConsumableProducers,
} from "../../rtc/sfu/index.js";
import { getPeerBySocket } from "../../services/redis.js";

export const handleConsume = (io: Server, socket: Socket) => {
  socket.on("consume", async ({ roomId, rtpCapabilities, producerId }) => {
    try {
      const userId = await getPeerBySocket(socket.id);
      if (!userId) {
        socket.emit("error", {
          message: "No userId associated with socket id",
        });
        return;
      }
      const transport = getTransport(userId, roomId);
      const producers = getConsumableProducers(roomId, userId);
      const targetProducer = producers.find(
        (p) => p && p.producer.id === producerId,
      );
      if (!targetProducer) {
        socket.emit("error", { message: "Producer not found or not allowed" });
        return;
      }
      const { consumerId } = await consume(
        userId,
        roomId,
        transport,
        producerId,
        rtpCapabilities,
      );
      socket.emit("consumed", { consumerId });
    } catch (err) {
      socket.emit("error", {
        message: "error consuming",
      });
    }
  });
};

// TODO: Need to create a handleConsumeDisconnect
