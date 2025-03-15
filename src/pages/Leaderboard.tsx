
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { leaderboard } from "@/lib/mockData";

const Leaderboard = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top developers ranked by coding time in the last 7 days
          </p>
        </div>
        <LeaderboardTable users={leaderboard} />
      </main>
    </>
  );
};

export default Leaderboard;
