import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';
import { leaderboard } from '@/lib/mockData';

const Leaderboard = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Leaderboard</h1>
          <p className="text-gray-600 mt-1">
            Top developers ranked by coding time in the last 7 days
          </p>
        </div>
        <LeaderboardTable users={leaderboard} />
      </main>
    </>
  );
};

export default Leaderboard;