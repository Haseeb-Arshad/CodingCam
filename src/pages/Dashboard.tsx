import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  Rectangle
} from 'recharts';
import { formatTime, currentUser } from '@/lib/mockData';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Clock, Code, FolderOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [dailyStats, setDailyStats] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [projectStats, setProjectStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
  }, [token, navigate]);

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      if (!token) throw new Error('No token found');

      const startDate = dateRange.startDate.toISOString();
      const endDate = dateRange.endDate.toISOString();

      // Fetch daily stats
      const dailyResponse = await fetch(
        `http://localhost:3001/frontend/analytics/daily?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!dailyResponse.ok) {
        if (dailyResponse.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch daily stats');
      }
      const dailyData = await dailyResponse.json();
      setDailyStats(dailyData.dailyStats || []);

      // Fetch language stats
      const languageResponse = await fetch(
        `http://localhost:3001/frontend/analytics/languages?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!languageResponse.ok) {
        if (languageResponse.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch language stats');
      }
      const languageData = await languageResponse.json();
      setLanguageStats(languageData.languages || []);

      // Fetch project stats
      const projectResponse = await fetch(
        `http://localhost:3001/frontend/analytics/projects?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!projectResponse.ok) {
        if (projectResponse.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch project stats');
      }
      const projectData = await projectResponse.json();
      setProjectStats(projectData.projects || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Use mock data as fallback
      setDailyStats(currentUser.dailyHours.map(day => ({
        date: day.date,
        totalSeconds: day.hours * 3600,
        languages: currentUser.languages.map(lang => ({ name: lang.name, seconds: lang.time })),
        projects: currentUser.projects.map(proj => ({ name: proj.name, seconds: proj.time }))
      })));
      
      setLanguageStats(currentUser.languages.map(lang => ({
        name: lang.name,
        seconds: lang.time,
        percentage: lang.percentage
      })));
      
      setProjectStats(currentUser.projects.map(proj => ({
        name: proj.name,
        seconds: proj.time,
        lastActive: proj.lastActive
      })));
      
      setError('Using mock data due to API error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, dateRange]);

  // Process data for the new graph
  const processedData = useMemo(() => {
    if (!dailyStats.length) return [];

    return dailyStats.map(stat => ({
      date: new Date(stat.date).toLocaleDateString(),
      totalHours: stat.totalSeconds / 3600,
      productivity: (stat.totalSeconds / (24 * 3600)) * 100, // Productivity as percentage of day
      languages: stat.languages?.length || 0,
      projects: stat.projects?.length || 0
    }));
  }, [dailyStats]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!dailyStats.length) return null;

    const totalHours = dailyStats.reduce((acc, stat) => acc + (stat.totalSeconds / 3600), 0);
    const averageHours = totalHours / dailyStats.length;
    const maxHours = Math.max(...dailyStats.map(stat => stat.totalSeconds / 3600));
    const minHours = Math.min(...dailyStats.map(stat => stat.totalSeconds / 3600));

    return {
      totalHours,
      averageHours,
      maxHours,
      minHours
    };
  }, [dailyStats]);

  // Process language data for better visualization
  const processedLanguageData = useMemo(() => {
    if (!languageStats.length) return [];

    // Create a map to store total seconds for each language
    const languageTotals = new Map();
    
    // Aggregate seconds for each language across all days
    languageStats.forEach(lang => {
      languageTotals.set(lang.name, lang.seconds);
    });

    // Convert to array and sort by total time
    const sortedLanguages = Array.from(languageTotals.entries())
      .map(([name, seconds]) => ({
        name,
        hours: seconds / 3600,
        percentage: (seconds / (languageStats.reduce((acc, lang) => acc + lang.seconds, 0))) * 100
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 6); // Show top 6 languages

    return sortedLanguages;
  }, [languageStats]);

  // Process daily language data for the line chart with improved aggregation
  const dailyLanguageData = useMemo(() => {
    if (!dailyStats.length) return [];

    // Get top languages from all days
    const languageTotals = new Map();
    dailyStats.forEach(day => {
      if (day.languages) {
        day.languages.forEach(lang => {
          const current = languageTotals.get(lang.name) || 0;
          languageTotals.set(lang.name, current + lang.seconds);
        });
      }
    });

    const topLanguages = Array.from(languageTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name]) => name);

    // Create daily data points
    return dailyStats.map(day => {
      const result = {
        date: new Date(day.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      };

      // Initialize all top languages with 0
      topLanguages.forEach(lang => {
        result[lang] = 0;
      });

      // Fill in actual values
      if (day.languages) {
        day.languages.forEach(lang => {
          if (topLanguages.includes(lang.name)) {
            result[lang.name] = lang.seconds / 3600; // Convert to hours
          }
        });
      }

      return result;
    });
  }, [dailyStats]);

  // Process project data for the last 24 hours
  const recentProjects = useMemo(() => {
    if (!projectStats.length) return [];

    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return projectStats
      .filter(proj => new Date(proj.lastActive) >= last24Hours)
      .map(proj => ({
        name: proj.name,
        hours: proj.seconds / 3600,
        lastActive: new Date(proj.lastActive)
      }))
      .sort((a, b) => b.hours - a.hours);
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

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6 bg-gray-50 min-h-screen">
        {/* Date Range Selection */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Coding Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.username || 'User'}</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <label htmlFor="startDate" className="text-sm text-gray-500 mb-1">Start Date</label>
              <input
                id="startDate"
                type="date"
                value={dateRange.startDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  startDate: new Date(e.target.value)
                }))}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="endDate" className="text-sm text-gray-500 mb-1">End Date</label>
              <input
                id="endDate"
                type="date"
                value={dateRange.endDate.toISOString().split('T')[0]}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  endDate: new Date(e.target.value)
                }))}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{summaryStats?.totalHours.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Daily</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{summaryStats?.averageHours.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{summaryStats?.maxHours.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Min Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{summaryStats?.minHours.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* New Productivity Graph */}
        <Card className="mb-8 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
              Weekly Productivity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
                  <YAxis
                    yAxisId="left"
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' }, fontSize: 12 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'Productivity %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' }, fontSize: 12 }}
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value as number;
                        return (
                          <div className="bg-white p-2 border rounded shadow">
                            <p>{payload[0].payload.date}</p>
                            <p>Hours: {value.toFixed(1)}</p>
                            <p>Productivity: {(payload[1].value as number).toFixed(1)}%</p>
                            <p>Languages: {payload[0].payload.languages}</p>
                            <p>Projects: {payload[0].payload.projects}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalHours"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorHours)"
                    name="Hours"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="productivity"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorProductivity)"
                    name="Productivity"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Language and Project Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Language Distribution */}
          <Card className="hover:shadow-lg transition-shadow bg-[#1e1e1e] text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                <Code className="w-5 h-5 mr-2 text-gray-400" />
                Language Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={processedLanguageData}
                    layout="vertical"
                    margin={{ top: 0, right: 60, left: 40, bottom: 0 }}
                    barSize={20}
                  >
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                      tickFormatter={(value) => `${value.toFixed(1)}h`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#252525] p-3 border border-gray-700 rounded-lg shadow-lg">
                              <p className="font-medium text-gray-200">{data.name}</p>
                              <p className="text-gray-400 mt-1">
                                {data.hours.toFixed(1)} hrs ({data.percentage.toFixed(1)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="hours"
                      radius={[0, 4, 4, 0]}
                    >
                      {processedLanguageData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={`hsl(${index * 60}, 70%, 60%)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Language Trends */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
                Language Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={dailyLanguageData}
                    margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      tickMargin={10}
                    />
                    <YAxis
                      label={{ 
                        value: 'Hours', 
                        angle: -90, 
                        position: 'insideLeft', 
                        style: { textAnchor: 'middle' }, 
                        fontSize: 12 
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-medium text-gray-900 mb-2">{label}</p>
                              {payload.map((entry) => {
                                const value = entry.value as number;
                                return (
                                  <p 
                                    key={entry.name} 
                                    className="text-gray-600"
                                    style={{ color: entry.color }}
                                  >
                                    {entry.name}: {value.toFixed(1)} hours
                                  </p>
                                );
                              })}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    {processedLanguageData.map((lang, index) => (
                      <Line
                        key={lang.name}
                        type="monotone"
                        dataKey={lang.name}
                        name={lang.name}
                        stroke={`hsl(${index * 60}, 70%, 60%)`}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Distribution */}
        <Card className="hover:shadow-lg transition-shadow bg-[#1e1e1e] text-white mt-6">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-200">
              <FolderOpen className="w-5 h-5 mr-2 text-gray-400" />
              Project Distribution (Last 24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={recentProjects}
                  layout="vertical"
                  margin={{ top: 0, right: 60, left: 40, bottom: 0 }}
                  barSize={20}
                >
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                    tickFormatter={(value) => `${value.toFixed(1)}h`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#252525] p-3 border border-gray-700 rounded-lg shadow-lg">
                            <p className="font-medium text-gray-200">{data.name}</p>
                            <p className="text-gray-400 mt-1">
                              {data.hours.toFixed(1)} hrs
                            </p>
                            <p className="text-gray-400 mt-1">
                              Last active: {data.lastActive.toLocaleTimeString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="hours"
                    radius={[0, 4, 4, 0]}
                  >
                    {recentProjects.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={`hsl(${index * 40}, 70%, 60%)`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recentProjects.map(project => (
            <Card
              key={project.name}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/projects/${encodeURIComponent(project.name)}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-medium truncate">{project.name}</span>
                  <FolderOpen className="w-5 h-5 text-gray-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-600">
                    {project.hours.toFixed(1)}h
                  </p>
                  <p className="text-sm text-gray-500">
                    Last active: {project.lastActive.toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
};

export default Dashboard;