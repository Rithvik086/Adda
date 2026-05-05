import { Server } from "socket.io";
import { handleRoomEvents } from "./handlers/room.js";
import { 
    getPeerBySocket, 
    getPeer, 
    removePeerFromRoom, 
    removePeer 
} from "../services/redis.js";

export const initializeSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log(`⚡ New socket connection: ${socket.id}`);

        // Attach the room handlers (joinRoom)
        handleRoomEvents(io, socket);

        //  3: Disconnect Cleanup
        socket.on("disconnect", async () => {
            console.log(`🔌 Socket disconnected: ${socket.id}`);
            
            try {
                // 1. Get peerId using the socket lookup key
                const peerId = await getPeerBySocket(socket.id);
                
                if (peerId) {
                    // 2. Get the peer's data so we know which room to notify
                    const peerData = await getPeer(peerId);
                    
                    if (peerData && peerData.roomId) {
                        const { roomId } = peerData;

                        // 3. Remove them from the room's Set in Redis
                        await removePeerFromRoom(roomId, peerId);
                        
                        // 4. Delete their Hash and Socket mapping in Redis
                        await removePeer(peerId);

                        // 5. Notify everyone else in the room
                        io.to(roomId).emit("user-left", { peerId });
                        
                        console.log(`🧹 Cleaned up peer [${peerId}] from room [${roomId}]`);
                    }
                }
            } catch (error) {
                console.error("🔴 Error during disconnect cleanup:", error);
            }
        });
    });
};