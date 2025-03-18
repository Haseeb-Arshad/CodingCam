import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, formatTime } from "@/lib/mockData";
import { motion } from "framer-motion";

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
            {user.languages.map((language, index) => (
              <motion.div 
                key={language.name} 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: language.color }}
                    />
                    <span className="font-medium">{language.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatTime(language.time)}</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Progress value={language.percentage} className="h-2" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CodingStats;
