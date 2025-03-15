
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ProfileOverview from "@/components/profile/ProfileOverview";
import CodingStats from "@/components/profile/CodingStats";
import TimeTrackingChart from "@/components/dashboard/TimeTrackingChart";
import ProjectsTracking from "@/components/dashboard/ProjectsTracking";
import { currentUser } from "@/lib/mockData";

const Profile = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">View and manage your profile</p>
        </div>

        <div className="space-y-6">
          <ProfileOverview user={currentUser} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodingStats user={currentUser} />
            <TimeTrackingChart dailyHours={currentUser.dailyHours} />
          </div>

          <ProjectsTracking projects={currentUser.projects} />
        </div>
      </main>
    </>
  );
};

export default Profile;
