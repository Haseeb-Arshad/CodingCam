import React from 'react';
import { Link } from 'react-router-dom';
import { formatTime } from '@/lib/mockData';

const LeaderboardTable = ({ users }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h5 className="text-xl font-bold">Leaderboard</h5>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Rank</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">User</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Time (Last 7 days)</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Daily Average</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Top Language</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="border-b hover:bg-gray-50 transition-colors duration-200">
                <td className="py-4 px-4">
                  {user.rank === 1 ? (
                    <span className="text-yellow-500 font-bold">🏆 {user.rank}</span>
                  ) : user.rank === 2 ? (
                    <span className="text-gray-400 font-bold">🥈 {user.rank}</span>
                  ) : user.rank === 3 ? (
                    <span className="text-amber-600 font-bold">🥉 {user.rank}</span>
                  ) : (
                    <span className="font-bold">{user.rank}</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <Link
                    to={`/profile/${user.userId}`}
                    className="flex items-center gap-3 hover:text-blue-600 transition-colors duration-200"
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-200">
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </Link>
                </td>
                <td className="py-4 px-4 font-medium text-blue-600">
                  {formatTime(user.totalTimeThisWeek)}
                </td>
                <td className="py-4 px-4 text-gray-700">
                  {formatTime(user.dailyAverage)}
                </td>
                <td className="py-4 px-4 text-gray-700">
                  {user.topLanguage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;