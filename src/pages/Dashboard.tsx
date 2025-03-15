
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import TimeTrackingChart from "@/components/dashboard/TimeTrackingChart";
import LanguageDistribution from "@/components/dashboard/LanguageDistribution";
import ProjectsTracking from "@/components/dashboard/ProjectsTracking";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import { currentUser, formatTime } from "@/lib/mockData";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your coding activity and productivity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(currentUser.dailyHours[0].hours * 3600)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatTime(
                  currentUser.dailyHours
                    .slice(0, 7)
                    .reduce((acc, day) => acc + day.hours * 3600, 0)
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Daily Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(currentUser.dailyAverage)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <TimeTrackingChart dailyHours={currentUser.dailyHours} />
          <LanguageDistribution languages={currentUser.languages} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectsTracking projects={currentUser.projects} />
          <ActivityTimeline activity={currentUser.activity} />
        </div>
      </main>
    </>
  );
};

export default Dashboard;
