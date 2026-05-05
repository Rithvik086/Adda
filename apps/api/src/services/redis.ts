import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";


if (!REDIS_URL) {
    console.warn('⚠️ UPSTASH_REDIS_URL is not defined in .env! Falling back to localhost:6379');
}

const redis = new Redis(REDIS_URL, {
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        console.warn(`Redis connection lost. Attempting to reconnect in ${delay}ms...`);
        return delay;
    },
    //why null : related to mediasoup
    maxRetriesPerRequest: null,
});


const keys = {
    room: (roomId: string) => `room:${roomId}:peers`,
    peer: (peerId: string) => `peer:${peerId}`,
    socket: (socketId: string) => `socket:${socketId}`,
}
//roomId => peer1Id,peer2Id,peer3Id
//peerId => {roomId,socketId,name}
//socketId => {peerId}

interface peerType {
    socketId: string,
    roomId: string,
    name: string
}

const createPeer = async (peerId: string, { socketId, roomId, name }: peerType) => {
    const multi = redis.multi();

    multi.hset(keys.peer(peerId), { socketId, roomId, name });
    multi.set(keys.socket(socketId), peerId);

    return await multi.exec();

}

const addPeerToRoom = async (roomId: string, peerId: string) => {
    return await redis.sadd(keys.room(roomId), peerId);
}

const getPeersInRoom = async (roomId: string) => {
    return await redis.smembers(keys.room(roomId));
}

const getPeer = async (peerId: string) => {
    return await redis.hgetall(keys.peer(peerId));
}

const getPeerBySocket = async (socketId: string) => {
    return await redis.get(keys.socket(socketId));
}

const removePeer = async (peerId: string) => {
    const peer = await getPeer(peerId);

    const multi = redis.multi();

    multi.del(keys.peer(peerId));

    if (peer && peer.socketId) {
        multi.del(keys.socket(peer.socketId));
    }

   await multi.exec();

}

const removePeerFromRoom = async (roomId: string, peerId: string) => {
    await redis.srem(keys.room(roomId), peerId);
};





redis.on("connect", () => {
    console.log(" Connected to Redis successfully!");
})

redis.on("error", (err) => {
    console.error("Redis connection error: ", err);
});

const pingReids = async () => {
    return await redis.ping();
}



export {
    redis,
    pingReids,
    createPeer,
    addPeerToRoom,
    getPeersInRoom,
    getPeer,
    getPeerBySocket,
    removePeer,
    removePeerFromRoom
};

