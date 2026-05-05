import { Transport, Producer, RtpParameters } from "@repo/types";

type ProducerEntry = {
  producer: Producer;
  userId: string;
  roomId: string;
  kind: "audio" | "video";
  routerId: string;
};

const producers = new Map<string, ProducerEntry>();
// producerId -> ProducerEntry

const roomProducers = new Map<string, Set<string>>();
// roomId -> Set<producerId>

const userProducers = new Map<string, Set<string>>();
// userId -> Set<producerId>

export const produce = async (
  userId: string,
  roomId: string,
  transport: Transport,
  kind: "audio" | "video",
  rtpParameters: RtpParameters,
  routerId: string,
) => {
  const producer: Producer = await transport.produce({
    kind,
    rtpParameters,
  });

  addProducer({
    producer,
    userId,
    roomId,
    kind,
    routerId,
  });

  return {
    producerId: producer.id,
  };
};

export const addProducer = ({
  producer,
  userId,
  roomId,
  kind,
  routerId,
}: ProducerEntry) => {
  const producerId = producer.id;

  // Global map
  producers.set(producerId, {
    producer,
    userId,
    roomId,
    kind,
    routerId,
  });

  // room index
  if (!roomProducers.has(roomId)) {
    roomProducers.set(roomId, new Set());
  }
  roomProducers.get(roomId)!.add(producerId);

  // user index
  if (!userProducers.has(userId)) {
    userProducers.set(roomId, new Set());
  }
  userProducers.get(userId)!.add(producerId);

  // cleanup hook
  producer.on("@close", () => removeProducer(producerId));
};

export const removeProducer = (producerId: string) => {
  const entry = producers.get(producerId);
  if (!entry) return;

  const { roomId, userId } = entry;

  producers.delete(producerId);

  roomProducers.get(roomId)!.delete(producerId);
  if (roomProducers.get(roomId)?.size === 0) {
    roomProducers.delete(roomId);
  }

  userProducers.get(userId)!.delete(producerId);
  if (userProducers.get(userId)?.size === 0) {
    userProducers.delete(userId);
  }
};

export const getProducerById = (producerId: string) => {
  return producers.get(producerId);
};

export const getRoomProducers = (roomId: string) => {
  const ids = roomProducers.get(roomId);
  if (!ids) return [];
  return Array.from(ids).map((id) => producers.get(id));
};

export const getUserProducers = (userId: string) => {
  const ids = userProducers.get(userId);
  if (!ids) return [];
  return Array.from(ids).map((id) => producers.get(id));
};

export const getConsumableProducers = (roomId: string, userId: string) => {
  return getRoomProducers(roomId).filter((entry) => {
    entry && entry.userId !== userId;
  });
};
