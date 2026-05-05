import { Consumer, Transport, RtpCapabilities } from "@repo/types";
import { getRouter } from "./routerManager.js";
import { getProducerById } from "./producerManager.js";

type ConsumerEntry = {
  consumer: Consumer;
  userId: string;
  producerId: string;
  roomId: string;
  routerId: string;
};

const consumers = new Map<string, ConsumerEntry>();
// consumerId -> entry

const userConsumers = new Map<string, Set<string>>();
// userId -> [consumerIds]

const producerConsumers = new Map<string, Set<string>>();
// producerId -> [consumerIds]

export const consume = async (
  userId: string,
  roomId: string,
  transport: Transport,
  producerId: string,
  rtpCapabilities: RtpCapabilities,
) => {
  const router = getRouter();
  const producerEntry = getProducerById(producerId);

  if (!producerEntry) {
    throw new Error("Procuder not found");
  }

  // Room validation
  if (producerEntry.roomId !== roomId) {
    throw new Error("Cross-room consume not allowed");
  }

  // don't consume your own producer
  if (producerEntry.userId === userId) {
    throw new Error("Cannot consume own producer");
  }

  // Capability check
  if (!router.canConsume({ producerId, rtpCapabilities })) {
    throw new Error("Cannot consumer (codec mismatch)");
  }

  const consumer: Consumer = await transport.consume({
    producerId,
    rtpCapabilities,
    paused: true, //always start paused
  });

  addConsumer({
    consumer,
    userId,
    producerId,
    roomId,
    routerId: router.id,
  });

  return {
    consumerId: consumer.id,
  };
};

export const addConsumer = ({
  consumer,
  userId,
  producerId,
  roomId,
  routerId,
}: ConsumerEntry) => {
  const consumerId = consumer.id;
  //
  // Global map
  consumers.set(consumerId, {
    consumer,
    userId,
    producerId,
    roomId,
    routerId,
  });

  if (!userConsumers.has(userId)) {
    userConsumers.set(userId, new Set());
  }
  userConsumers.get(userId)!.add(consumer.id);

  if (!producerConsumers.has(producerId)) {
    producerConsumers.set(producerId, new Set());
  }
  producerConsumers.get(producerId)!.add(consumer.id);

  // Cleanup
  consumer.on("@close", () => {
    removeConsumer(consumer.id);
  });

  return {
    id: consumer.id,
    producerId,
    kind: consumer.kind,
    rtpParameters: consumer.rtpParameters,
  };
};

export const resumeConsumer = async (consumerId: string) => {
  const entry = consumers.get(consumerId);
  if (!entry) return;

  await entry.consumer.resume();
};

export const removeConsumer = (consumerId: string) => {
  const entry = consumers.get(consumerId);
  if (!entry) return;

  consumers.delete(consumerId);

  userConsumers.get(entry.userId)?.delete(consumerId);
  producerConsumers.get(entry.producerId)?.delete(consumerId);
};
