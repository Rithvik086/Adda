import { Redis } from "ioredis";
import { env } from "../utils/config.js";
import { logger } from "../utils/logger.js";

const REDIS_URL = env.REDIS_URL || "redis://localhost:6379";

if (!REDIS_URL) {
  logger.warn(
    "⚠️ UPSTASH_REDIS_URL is not defined in .env! Falling back to localhost:6379",
  );
}

const redis = new Redis(REDIS_URL, {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    logger.warn(
      `Redis connection lost. Attempting to reconnect in ${delay}ms...`,
    );
    return delay;
  },
  //why null : related to mediasoup
  maxRetriesPerRequest: null,
});

const keys = {
  room: (roomId: string) => `room:${roomId}:peers`,
  peer: (peerId: string) => `peer:${peerId}`,
  socket: (socketId: string) => `socket:${socketId}`,
};
//roomId => peer1Id,peer2Id,peer3Id
//peerId => {roomId,socketId,name}
//socketId => {peerId}

export interface PeerData {
  socketId: string;
  roomId: string;
  name: string;
}

const createPeer = async (
  peerId: string,
  { socketId, roomId, name }: PeerData,
) => {
  const multi = redis.multi();

  multi.hset(keys.peer(peerId), { socketId, roomId, name });
  multi.set(keys.socket(socketId), peerId);

  return await multi.exec();
};

const addPeerToRoom = async (roomId: string, peerId: string) => {
  return await redis.sadd(keys.room(roomId), peerId);
};

const getPeersInRoom = async (roomId: string) => {
  return await redis.smembers(keys.room(roomId));
};

const getPeer = async (peerId: string): Promise<PeerData | null> => {
  const data = await redis.hgetall(keys.peer(peerId));
  if (!data || Object.keys(data).length === 0) return null;

  if (
    typeof data.socketId !== "string" ||
    typeof data.roomId !== "string" ||
    typeof data.name !== "string"
  ) {
    return null;
  }

  return {
    socketId: data.socketId,
    roomId: data.roomId,
    name: data.name,
  };
};

const getPeerBySocket = async (socketId: string) => {
  return await redis.get(keys.socket(socketId));
};

const removePeer = async (peerId: string) => {
  const peer = await getPeer(peerId);

  const multi = redis.multi();

  multi.del(keys.peer(peerId));

  if (peer && peer.socketId) {
    multi.del(keys.socket(peer.socketId));
  }

  await multi.exec();
};

const removePeerFromRoom = async (roomId: string, peerId: string) => {
  await redis.srem(keys.room(roomId), peerId);
};

redis.on("connect", () => {
  logger.info(" Connected to Redis successfully!");
});

redis.on("error", (err) => {
  logger.error("Redis connection error: %s", err);
});

const pingReids = async () => {
  return await redis.ping();
};

export {
  redis,
  pingReids,
  createPeer,
  addPeerToRoom,
  getPeersInRoom,
  getPeer,
  getPeerBySocket,
  removePeer,
  removePeerFromRoom,
};
