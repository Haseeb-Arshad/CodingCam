
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardUser, formatTime } from "@/lib/mockData";
import { Link } from "react-router-dom";

interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

const LeaderboardTable = ({ users }: LeaderboardTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left">
              <tr className="border-b">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">User</th>
                <th className="pb-3">Time (Last 7 days)</th>
                <th className="pb-3">Daily Average</th>
                <th className="pb-3">Top Language</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 pl-2 font-medium">
                    {user.rank === 1 ? (
                      <span className="text-yellow-500">🏆 {user.rank}</span>
                    ) : user.rank === 2 ? (
                      <span className="text-gray-400">🥈 {user.rank}</span>
                    ) : user.rank === 3 ? (
                      <span className="text-amber-600">🥉 {user.rank}</span>
                    ) : (
                      user.rank
                    )}
                  </td>
                  <td className="py-3">
                    <Link
                      to={`/profile/${user.userId}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </Link>
                  </td>
                  <td className="py-3 font-medium">{formatTime(user.totalTimeThisWeek)}</td>
                  <td className="py-3">{formatTime(user.dailyAverage)}</td>
                  <td className="py-3">{user.topLanguage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
