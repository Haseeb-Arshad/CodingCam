
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { currentUser, formatTime } from "@/lib/mockData";

const Insights = () => {
  // Calculate mock insights
  const weeklyAverage = currentUser.dailyHours
    .slice(0, 7)
    .reduce((acc, day) => acc + day.hours, 0) / 7;
  
  const previousWeeklyAverage = currentUser.dailyHours
    .slice(7, 14)
    .reduce((acc, day) => acc + day.hours, 0) / 7;
  
  const percentageChange = ((weeklyAverage - previousWeeklyAverage) / previousWeeklyAverage) * 100;

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Insights</h1>
          <p className="text-muted-foreground">
            Discover patterns and trends in your coding habits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-wakatime-primary/10 to-wakatime-tertiary/10 border-wakatime-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="h-5 w-5 text-wakatime-primary" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Your daily average this week is{" "}
                  <span className="font-bold">{weeklyAverage.toFixed(1)} hours</span>, which is{" "}
                  {percentageChange >= 0 ? (
                    <span className="text-green-500 flex items-center gap-1 inline-flex">
                      <ArrowUpRight className="h-4 w-4" />
                      {Math.abs(percentageChange).toFixed(1)}% higher
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1 inline-flex">
                      <ArrowDownRight className="h-4 w-4" />
                      {Math.abs(percentageChange).toFixed(1)}% lower
                    </span>
                  )}{" "}
                  than last week.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-wakatime-secondary/10 to-wakatime-accent/10 border-wakatime-secondary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-wakatime-secondary" />
                Productivity Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  Your most productive hours are in the{" "}
                  <span className="font-bold">morning (10am - 12pm)</span>. You've spent{" "}
                  <span className="font-bold">{formatTime(currentUser.totalCodingTime * 0.35)}</span> coding during these hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Language Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Your primary language is{" "}
                <span className="font-bold">{currentUser.languages[0].name}</span> with{" "}
                <span className="font-bold">{formatTime(currentUser.languages[0].time)}</span> of coding time.
              </p>
              <p>
                Compared to other developers, you spend{" "}
                <span className="font-bold text-green-500">20% more time</span> on{" "}
                <span className="font-bold">{currentUser.languages[0].name}</span> and{" "}
                <span className="font-bold text-red-500">15% less time</span> on{" "}
                <span className="font-bold">CSS</span>.
              </p>
              <p>
                Your most active project is{" "}
                <span className="font-bold">{currentUser.projects[0].name}</span> with{" "}
                <span className="font-bold">{formatTime(currentUser.projects[0].time)}</span> of development time.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Insights;
