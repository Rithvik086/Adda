import { Server, Socket } from "socket.io";
import {
  createWebRtcTransport,
  connectTransport,
} from "../../rtc/sfu/index.js";
import { getPeerBySocket } from "../../services/redis.js";
import { logger } from "../../utils/logger.js";
// let dltsParams;

export const handleTransportevents = (io: Server, socket: Socket) => {
  socket.on(
    "create-transport",
    async ({ roomId, direction }: { roomId: string; direction: string }) => {
      try {
        const userId = await getPeerBySocket(socket.id);
        if (!userId) {
          throw new Error("No peerId associated with socket id");
        }

        const transportInfo = await createWebRtcTransport(userId, roomId);
        // return ice candidated and other info
        // dltsParams = transportInfo.dtlsParameters
        socket.emit("transport-created", {
          ...transportInfo,
          direction,
        });
      } catch (err) {
        logger.error(err);
        socket.emit("error", {
          message: "Failed to create transport event",
        });
      }
    },
  );

  socket.on("connect-transport", async ({ roomId, dltsParametrs }) => {
    try {
      const userId = await getPeerBySocket(socket.id);
      if (!userId) {
        throw new Error("No peerId associated with socket id");
      }
      await connectTransport(userId, roomId, dltsParametrs);
      socket.emit("treansport-connected");
    } catch (err) {
      socket.emit("error", {
        message: "Failed ot connect to transport",
      });
    }
  });
};

// TODO: Need to create a handleTransportDisconnect
