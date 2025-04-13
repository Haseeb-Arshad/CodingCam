import React, { useState, useEffect, useMemo } from 'react';
import { 
  Chart, 
  ChartSeries, 
  ChartSeriesItem, 
  ChartCategoryAxis, 
  ChartCategoryAxisItem, 
  ChartLegend, 
  ChartTooltip 
} from '@progress/kendo-react-charts';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardActions,
  CardSubtitle
} from '@progress/kendo-react-layout';
import { Splitter, SplitterPane } from '@progress/kendo-react-layout';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { formatTime, currentUser } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import LanguageDistribution from '@/components/dashboard/LanguageDistribution';
import TimeTrackingChart from '@/components/dashboard/TimeTrackingChart';
import ProjectsTracking from '@/components/dashboard/ProjectsTracking';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import 'hammerjs';

const Dashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [dailyStats, setDailyStats] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [projectStats, setProjectStats] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabSelected, setTabSelected] = useState(0);
  
  // Initialize top languages
  const [topLanguages, setTopLanguages] = useState([
    { name: 'JavaScript', percentage: 35, color: '#F7DF1E' },
    { name: 'TypeScript', percentage: 25, color: '#007ACC' },
    { name: 'Python', percentage: 18, color: '#3776AB' },
    { name: 'HTML', percentage: 12, color: '#E34F26' },
    { name: 'CSS', percentage: 10, color: '#1572B6' }
  ]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Fetch data or use mock data
    fetchData();
  }, [token, navigate]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setTimeout(() => {
        setDailyStats(currentUser.dailyHours);
        setLanguageStats(currentUser.languages);
        setProjectStats(currentUser.projects);
        setActivityData(currentUser.activity);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };
  
  // Process project data for the last 24 hours
  const recentProjects = useMemo(() => {
    if (!projectStats.length) return [];

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return projectStats
      .filter(proj => new Date(proj.lastActive) >= last24Hours)
      .sort((a, b) => b.time - a.time);
  }, [projectStats]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <main className="ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <main className="ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
          <div className="flex items-center justify-center h-full">
            <div className="text-yellow-600">{error}</div>
          </div>
        </main>
      </>
    );
  }

  const handleTabSelect = (e) => {
    setTabSelected(e.selected);
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="k-card shadow-md">
            <CardHeader className="k-card-header bg-blue-50">
              <CardTitle className="k-card-title text-lg font-semibold text-gray-800">Coding Time Today</CardTitle>
            </CardHeader>
            <CardBody className="k-card-body p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatTime(dailyStats[dailyStats.length - 1]?.hours * 3600 || 0)}
              </div>
              <div className="text-sm text-gray-600">
                {dailyStats.length > 1 ? 
                  `${Math.round((dailyStats[dailyStats.length - 1]?.hours / dailyStats[dailyStats.length - 2]?.hours - 1) * 100)}% vs yesterday` 
                  : 'No previous data available'}
              </div>
            </CardBody>
          </Card>
          
          <Card className="k-card shadow-md">
            <CardHeader className="k-card-header bg-blue-50">
              <CardTitle className="k-card-title text-lg font-semibold text-gray-800">Active Projects</CardTitle>
            </CardHeader>
            <CardBody className="k-card-body p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {recentProjects.length}
              </div>
              <div className="text-sm text-gray-600">
                In the last 24 hours
              </div>
            </CardBody>
          </Card>
          
          <Card className="k-card shadow-md">
            <CardHeader className="k-card-header bg-blue-50">
              <CardTitle className="k-card-title text-lg font-semibold text-gray-800">Top Language</CardTitle>
            </CardHeader>
            <CardBody className="k-card-body p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {languageStats[0]?.name || 'None'}
              </div>
              <div className="text-sm text-gray-600">
                {languageStats[0] ? `${languageStats[0].percentage}% of your coding time` : 'No data available'}
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <TimeTrackingChart dailyHours={dailyStats} />
          </div>
          <div>
            <LanguageDistribution languages={topLanguages} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityTimeline activity={activityData} />
          </div>
          <div>
            <ProjectsTracking projects={projectStats} />
          </div>
        </div>

        {/* Global Stats tab content */}
        <div className="mt-6">
          <TabStrip selected={tabSelected} onSelect={handleTabSelect} className="bg-white rounded-lg shadow-md">
            <TabStripTab title="Activity">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Your Activity</h2>
                <p>Detailed activity logs will be displayed here.</p>
              </div>
            </TabStripTab>
            <TabStripTab title="Global Stats">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Global Statistics</h2>
                <p>Global coding statistics will be displayed here.</p>
              </div>
            </TabStripTab>
          </TabStrip>
        </div>
      </main>
    </>
  );
};

export default Dashboard;