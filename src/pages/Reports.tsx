
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TimeTrackingChart from "@/components/dashboard/TimeTrackingChart";
import LanguageDistribution from "@/components/dashboard/LanguageDistribution";
import { currentUser } from "@/lib/mockData";

const Reports = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Detailed reports of your coding activity
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeTrackingChart dailyHours={currentUser.dailyHours} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Language Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <LanguageDistribution languages={currentUser.languages} />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Reports;
