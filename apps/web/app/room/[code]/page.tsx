import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRoomByCode } from "../../../lib/room-data";
import { ActiveRoomView } from "./ActiveRoomView";
import { Background } from "../../../components/ui/Background";
import { RoomTopNav } from "../../../components/room/RoomTopNav";

interface RoomPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({
  params,
}: RoomPageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Adda | Room ${code.toUpperCase()}`,
    description: "Active voice chat room in Adda",
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { code } = await params;
  const room = await fetchRoomByCode(code);

  if (!room) {
    notFound();
  }

  return (
    <>
      <RoomTopNav sessionCode={room.sessionCode} />
      <ActiveRoomView room={room} />
      <Background />
    </>
  );
}
