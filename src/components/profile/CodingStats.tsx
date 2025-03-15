
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, formatTime } from "@/lib/mockData";

interface CodingStatsProps {
  user: User;
}

const CodingStats = ({ user }: CodingStatsProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Languages</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {user.languages.map((language) => (
              <div key={language.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: language.color }}
                    />
                    <span className="font-medium">{language.name}</span>
                  </div>
                  <span className="text-sm">{formatTime(language.time)}</span>
                </div>
                <Progress value={language.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CodingStats;
