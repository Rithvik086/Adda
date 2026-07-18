import { TopNav } from "../components/layout/TopNav";
import { JoinSessionCard } from "../components/session/JoinSessionCard";
import { SessionFooter } from "../components/session/SessionFooter";
import { BottomNav } from "../components/layout/BottomNav";
import { Background } from "../components/ui/Background";
import { SocketClient } from "../components/socket/SocketClient";

export default function Home() {
  return (
    <div>
      <TopNav />
      <main className="grow flex flex-col items-center justify-center px-6 pb-20 gap-4">
        <JoinSessionCard />
        <SocketClient />
      </main>
      <SessionFooter />
      <BottomNav />
      <Background />
    </div>
  );
}
