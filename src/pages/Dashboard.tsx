import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import TimeTrackingChart from '@/components/dashboard/TimeTrackingChart';
import LanguageDistribution from '@/components/dashboard/LanguageDistribution';
import ProjectsTracking from '@/components/dashboard/ProjectsTracking';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import { currentUser, formatTime } from '@/lib/mockData';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your coding activity and productivity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="k-card shadow-md">
            <div className="k-card-header p-4 border-b bg-blue-50">
              <h5 className="k-card-title text-sm font-semibold text-gray-500">Today</h5>
            </div>
            <div className="k-card-body p-4">
              <div className="text-3xl font-bold text-blue-600">
                {formatTime(currentUser.dailyHours[0].hours * 3600)}
              </div>
            </div>
          </div>
          <div className="k-card shadow-md">
            <div className="k-card-header p-4 border-b bg-blue-50">
              <h5 className="k-card-title text-sm font-semibold text-gray-500">This Week</h5>
            </div>
            <div className="k-card-body p-4">
              <div className="text-3xl font-bold text-blue-600">
                {formatTime(
                  currentUser.dailyHours
                    .slice(0, 7)
                    .reduce((acc, day) => acc + day.hours * 3600, 0)
                )}
              </div>
            </div>
          </div>
          <div className="k-card shadow-md">
            <div className="k-card-header p-4 border-b bg-blue-50">
              <h5 className="k-card-title text-sm font-semibold text-gray-500">Daily Average</h5>
            </div>
            <div className="k-card-body p-4">
              <div className="text-3xl font-bold text-blue-600">
                {formatTime(currentUser.dailyAverage)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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