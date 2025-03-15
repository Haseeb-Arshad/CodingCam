
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityItem, formatTime } from "@/lib/mockData";

interface ActivityTimelineProps {
  activity: ActivityItem[];
}

const ActivityTimeline = ({ activity }: ActivityTimelineProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          <div className="space-y-4">
            {activity.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <div
                  className="mt-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.language === "TypeScript" ? "#007ACC" : item.language === "JavaScript" ? "#F7DF1E" : "#E34F26" }}
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.project}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.language} • {formatTime(item.duration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
