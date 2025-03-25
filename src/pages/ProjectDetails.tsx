import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Clock, Code, Monitor, Wrench } from 'lucide-react';

interface ProjectActivity {
  date: string;
  totalSeconds: number;
  languages: Array<{ name: string; seconds: number }>;
  editor: string;
  platform: string;
}

const ProjectDetails = () => {
  const { projectName } = useParams<{ projectName: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<ProjectActivity[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/frontend/analytics/project/${encodeURIComponent(projectName)}?startDate=${dateRange.startDate.toISOString()}&endDate=${dateRange.endDate.toISOString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch project data');
        }

        const data = await response.json();
        setProjectData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [token, projectName, dateRange, navigate]);

  const stats = useMemo(() => {
    if (!projectData.length) return null;

    const totalHours = projectData.reduce((acc, day) => acc + day.totalSeconds / 3600, 0);
    const languageMap = new Map<string, number>();
    const editorMap = new Map<string, number>();
    const platformMap = new Map<string, number>();

    projectData.forEach(day => {
      // Aggregate language data
      day.languages.forEach(lang => {
        const current = languageMap.get(lang.name) || 0;
        languageMap.set(lang.name, current + lang.seconds);
      });

      // Track editor usage
      const currentEditor = editorMap.get(day.editor) || 0;
      editorMap.set(day.editor, currentEditor + day.totalSeconds);

      // Track platform usage
      const currentPlatform = platformMap.get(day.platform) || 0;
      platformMap.set(day.platform, currentPlatform + day.totalSeconds);
    });

    return {
      totalHours,
      averageHours: totalHours / projectData.length,
      languages: Array.from(languageMap.entries())
        .map(([name, seconds]) => ({
          name,
          hours: seconds / 3600,
          percentage: (seconds / (totalHours * 3600)) * 100
        }))
        .sort((a, b) => b.hours - a.hours),
      editors: Array.from(editorMap.entries())
        .map(([name, seconds]) => ({
          name,
          hours: seconds / 3600,
          percentage: (seconds / (totalHours * 3600)) * 100
        }))
        .sort((a, b) => b.hours - a.hours),
      platforms: Array.from(platformMap.entries())
        .map(([name, seconds]) => ({
          name,
          hours: seconds / 3600,
          percentage: (seconds / (totalHours * 3600)) * 100
        }))
        .sort((a, b) => b.hours - a.hours)
    };
  }, [projectData]);

  const timelineData = useMemo(() => {
    return projectData.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      hours: day.totalSeconds / 3600
    }));
  }, [projectData]);

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
            <div className="text-red-600">Error: {error}</div>
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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{decodeURIComponent(projectName)}</h1>
            <p className="text-gray-500 mt-1">Project Overview</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col">
              <label htmlFor="projectStartDate" className="text-sm text-gray-500 mb-1">Start Date</label>
              <input
                id="projectStartDate"
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
              <label htmlFor="projectEndDate" className="text-sm text-gray-500 mb-1">End Date</label>
              <input
                id="projectEndDate"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.totalHours.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats?.averageHours.toFixed(1)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Languages Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats?.languages.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Chart */}
        <Card className="mb-8 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timelineData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
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
                        const value = payload[0].value as number;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium text-gray-900">{label}</p>
                            <p className="text-gray-600 mt-1">
                              {value.toFixed(1)} hours
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                    data={stats?.languages.slice(0, 8)}
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
                      {stats?.languages.slice(0, 8).map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={`hsl(${index * 30}, 70%, 60%)`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Development Environment */}
          <Card className="hover:shadow-lg transition-shadow bg-[#1e1e1e] text-white">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-200">
                <Wrench className="w-5 h-5 mr-2 text-gray-400" />
                Development Environment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {/* Editors */}
                <div>
                  <h3 className="text-gray-400 mb-2 text-sm">Editors</h3>
                  <div className="space-y-2">
                    {stats?.editors.map(editor => (
                      <div key={editor.name} className="flex items-center">
                        <div className="flex-1">
                          <div className="text-gray-200">{editor.name}</div>
                          <div className="text-gray-400 text-sm">{editor.hours.toFixed(1)} hrs</div>
                        </div>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${editor.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <h3 className="text-gray-400 mb-2 text-sm">Platforms</h3>
                  <div className="space-y-2">
                    {stats?.platforms.map(platform => (
                      <div key={platform.name} className="flex items-center">
                        <div className="flex-1">
                          <div className="text-gray-200">{platform.name}</div>
                          <div className="text-gray-400 text-sm">{platform.hours.toFixed(1)} hrs</div>
                        </div>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${platform.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default ProjectDetails; 