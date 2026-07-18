import { Device } from "mediasoup-client";
import {
  AppData,
  DtlsParameters,
  IceCandidate,
  IceParameters,
  RtpCapabilities,
  Transport,
} from "mediasoup-client/types";

let device: Device;
export const initDevice = async () => {
  try {
    if (device) return device;

    device = await Device.factory();

    console.log("device handler :", device.handlerName);
    return device;
  } catch (error: any) {
    if (error.name === "UnsupportedError") {
      console.warn("browser not supported");
    }
    return null;
  }
};

export const getDevice = async (): Promise<Device> => {
  if (!device) {
    await initDevice();
  }
  return device;
};

export const loadRtpCapabilities = async (
  routerRtpCapabilities: RtpCapabilities,
) => {
  try {
    const device = await getDevice();

    console.log("Loading Router RTP Capabilities:", routerRtpCapabilities);

    await device.load({ routerRtpCapabilities });
    console.log("Device successfully loaded capabilities!");
  } catch (error: any) {
    if (error.name === "InvalidStateError") {
      console.warn("device is already loaded");
    } else {
      console.warn("loadRtp failed with: ", error);
    }
  }
};

export const initSendTransport = async (
  device: Device,
  transportInfo: {
    id: string;
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    dtlsParameters: DtlsParameters;
  },
): Promise<Transport<AppData> | undefined> => {
  try {
    const sendTransport = device.createSendTransport({
      ...transportInfo,
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    return sendTransport;
  } catch (error: any) {
    if (error.name === "InvalidStateError") {
      console.warn("device is not loaded");
    } else {
      console.warn("loadRtp failed with: ", error);
    }
  }
};

export const initRecvTransport = async (
  device: Device,
  transportInfo: {
    id: string;
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    dtlsParameters: DtlsParameters;
  },
) => {
  try {
    const recvTransport = device.createRecvTransport({
      ...transportInfo,
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    return recvTransport;
  } catch (error: any) {
    if (error.name === "InvalidStateError") {
      console.warn("device is not loaded");
    } else {
      console.warn("loadRtp failed with: ", error);
    }
  }
};

export const produceAudio = async (sendTransport: Transport<AppData>) => {
  try {
    const stream = navigator.mediaDevices.getUserMedia({ audio: true });
    const audioTrack = (await stream).getAudioTracks()[0];

    if (!audioTrack) {
      throw new Error("No microphone audio track available.");
    }

    // Double check capabilities state immediately before production
    const currentDevice = await getDevice();
    console.log(
      "Can client device produce audio right now?",
      currentDevice.canProduce("audio"),
    );

    const producer = await sendTransport.produce({ track: audioTrack });
    return producer;
  } catch (error) {
    console.error("produce audio failed with error: ", error);
    return;
  }
};
