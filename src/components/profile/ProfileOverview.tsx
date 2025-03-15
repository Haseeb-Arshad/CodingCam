
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, formatTime } from "@/lib/mockData";

interface ProfileOverviewProps {
  user: User;
}

const ProfileOverview = ({ user }: ProfileOverviewProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Member since {new Date(user.joinDate).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="text-sm font-medium text-muted-foreground">Total Coding Time</h3>
            <p className="text-2xl font-bold">{formatTime(user.totalCodingTime)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="text-sm font-medium text-muted-foreground">Daily Average</h3>
            <p className="text-2xl font-bold">{formatTime(user.dailyAverage)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <h3 className="text-sm font-medium text-muted-foreground">Top Language</h3>
            <p className="text-2xl font-bold">{user.languages[0].name}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
