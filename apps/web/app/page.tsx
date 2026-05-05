import { TopNav } from "../components/layout/TopNav";
import { JoinSessionCard } from "../components/session/JoinSessionCard";
import { SessionFooter } from "../components/session/SessionFooter";
import { BottomNav } from "../components/layout/BottomNav";
import { Background } from "../components/ui/Background";

export default function Home() {
  return (
    <>
      <TopNav />
      <main className="grow flex items-center justify-center px-6 pb-20">
        <JoinSessionCard />
      </main>
      <SessionFooter />
      <BottomNav />
      <Background />
    </>
  );
}
