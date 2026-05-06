import { Server, Socket } from "socket.io";
import { consume, getTransport, getRoomProducers } from '../../rtc/sfu/index.js'
import { getPeerBySocket } from "../../services/redis.js";

export const Consume = (io: Server, socket: Socket) => {

    socket.on("consume", async ({ roomId, rtpCapabilities, producerId }) => {
        try {
            const peerId = await getPeerBySocket(socket.id);
            if (!peerId) {
                socket.emit("error", { message: "No peerId associated with socket id" });
                return;
            }
            const transport = getTransport(peerId, roomId);
            const producers = getRoomProducers(roomId);
            const targetProducer = producers.find(p => p && p.producer.id === producerId && p.userId !== peerId);
            if (!targetProducer) {
                socket.emit("error", { message: "Producer not found or not allowed" });
                return;
            }
            const { consumerId } = await consume(
                peerId,
                roomId,
                transport,
                producerId,
                rtpCapabilities
            );
            socket.emit("consumed", { consumerId });

            socket.emit("consumed")

        } catch (err) {
            socket.emit("error", {
                message: "error consuming"
            })
        }


    })

}
