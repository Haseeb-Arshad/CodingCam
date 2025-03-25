import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Download,
  Mail,
  MapPin,
  Share2,
  Clock,
  Code2,
  Laptop2,
  ArrowUp,
  Calendar as CalendarIcon
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { currentUser, formatTime } from "@/lib/mockData";
import 'hammerjs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// Custom contribution heatmap component
const ContributionHeatmap = ({ data }: { data: { date: string; totalSeconds: number }[] }) => {
  // Get last 365 days from today
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 364);
  
  // Generate array of all dates in range
  const dateRange = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= today) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Create a map of date strings to data values
  const dateValueMap = new Map();
  data.forEach(item => {
    const dateStr = new Date(item.date).toISOString().split('T')[0];
    dateValueMap.set(dateStr, item.totalSeconds);
  });
  
  // Generate weeks for the grid
  const weeks = [];
  let currentWeek = [];
  
  dateRange.forEach(date => {
    const dayOfWeek = date.getDay();
    
    // Start a new week on Sunday
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const value = dateValueMap.get(dateStr) || 0;
    currentWeek.push({ date, value });
  });
  
  // Add the last week if it's not empty
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  
  // Calculate color based on value
  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    if (value < 3600) return 'bg-green-200';
    if (value < 7200) return 'bg-green-300';
    if (value < 14400) return 'bg-green-400';
    return 'bg-green-500';
  };
  
  // Format time for tooltip
  const formatTime = (seconds: number) => {
    if (seconds === 0) return 'No activity';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex space-x-1">
            {week.map((day, dayIndex) => (
              <TooltipProvider key={dayIndex}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-colors ${getColor(day.value)}`}
                      title={`${day.date.toLocaleDateString()}: ${formatTime(day.value)}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{day.date.toLocaleDateString()}</p>
                    <p>{formatTime(day.value)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2 text-sm text-gray-500">
        <span className="mr-2">Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100" />
          <div className="w-3 h-3 rounded-sm bg-green-200" />
          <div className="w-3 h-3 rounded-sm bg-green-300" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
        </div>
        <span className="ml-2">More</span>
      </div>
    </div>
  );
};

const Profile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/frontend/analytics/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
        // Use mock data as fallback
        setProfile({
          user: {
            id: '1',
            username: currentUser.name || 'user',
            fullName: currentUser.name || 'User Name',
            email: currentUser.email || 'user@example.com',
            profilePicture: currentUser.avatar || '',
            country: 'United States',
            timezone: 'UTC',
            joinDate: currentUser.joinDate
          },
          activity: {
            totalCodingTime: currentUser.totalCodingTime,
            dailyAverage: currentUser.dailyAverage,
            keystrokeCount: 1000000,
            sessionCount: 50,
            currentStreak: 7,
            dailyStats: currentUser.dailyHours.map(day => ({
              date: day.date,
              totalSeconds: day.hours * 3600,
              keystrokeCount: Math.floor(Math.random() * 10000),
              projectsCount: currentUser.projects.length,
              languagesCount: currentUser.languages.length
            }))
          },
          languages: currentUser.languages.map(lang => ({
            name: lang.name,
            seconds: lang.time,
            percentage: lang.percentage
          })),
          tools: [
            {
              name: 'VS Code',
              platform: 'Windows',
              totalSeconds: currentUser.totalCodingTime * 0.8,
              percentage: 80
            },
            {
              name: 'IntelliJ IDEA',
              platform: 'Windows',
              totalSeconds: currentUser.totalCodingTime * 0.2,
              percentage: 20
            }
          ],
          lastActive: new Date().toISOString()
        });
        setError('Using mock data due to API error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <main className="ml-64 mt-16 p-6 bg-background">
          <div className="flex items-center justify-center h-[calc(100vh-150px)]">
            <div className="animate-pulse">Loading profile data...</div>
          </div>
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <main className="ml-64 mt-16 p-6 bg-background">
          <div className="flex items-center justify-center h-[calc(100vh-150px)]">
            <div>No profile data available</div>
          </div>
        </main>
      </>
    );
  }

  // Prepare data for the weekly trend chart
  const weeklyData = {
    labels: profile.activity.dailyStats.map(day => 
      new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Coding Hours',
        data: profile.activity.dailyStats.map(day => 
          Math.round(day.totalSeconds / 3600 * 10) / 10
        ),
        borderColor: '#4338ca',
        backgroundColor: 'rgba(67, 56, 202, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 px-8 py-6 bg-slate-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
        <div className="space-y-8">
          {/* Header with profile info */}
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={profile.user.profilePicture} alt={profile.user.fullName} />
                <AvatarFallback className="text-2xl">
                  {profile.user.fullName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{profile.user.fullName}</h1>
                  <Badge variant="outline" className="text-sm font-normal px-2 py-0 h-6">
                    @{profile.user.username}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Mail size={14} />
                    <span>{profile.user.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{profile.user.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    <span>Member since {new Date(profile.user.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 size={16} />
                Share Profile
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download size={16} />
                Export Data
              </Button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col">
              <span className="text-sm text-muted-foreground">Total Coding Time</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">{formatTime(profile.activity.totalCodingTime)}</span>
                <Clock className="text-blue-500" size={20} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col">
              <span className="text-sm text-muted-foreground">Daily Average</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">{formatTime(profile.activity.dailyAverage)}</span>
                <div className="flex items-center text-emerald-500">
                  <ArrowUp size={16} />
                  <span className="text-xs font-medium">{profile.activity.currentStreak} days</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col">
              <span className="text-sm text-muted-foreground">Top Language</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">{profile.languages[0].name}</span>
                <Code2 className="text-purple-500" size={20} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col">
              <span className="text-sm text-muted-foreground">Main Editor</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">{profile.tools[0].name}</span>
                <Laptop2 className="text-gray-500" size={20} />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="tools">Tools & Environment</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Weekly trend */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Weekly Trend</CardTitle>
                </CardHeader>
                <CardContent className="overflow-hidden">
                  <div className="h-64">
                    <Line data={weeklyData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
              
              {/* Language and tools summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Top Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.languages.map(lang => (
                        <div key={lang.name} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{lang.name}</span>
                            <span className="text-sm text-muted-foreground">{formatTime(lang.seconds)}</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${lang.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Tools Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.tools.map(tool => (
                        <div key={tool.name} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{tool.name}</span>
                            <span className="text-sm text-muted-foreground">{formatTime(tool.totalSeconds)}</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${tool.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="languages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Language Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.languages.map(lang => (
                      <div key={lang.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{lang.name}</span>
                          <span className="text-sm text-muted-foreground">{formatTime(lang.seconds)}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${lang.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profile.tools.map(tool => (
                  <Card key={tool.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {tool.name}
                        <span className="text-sm text-muted-foreground">
                          {tool.percentage}% usage
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-4 flex justify-center">
                        <div className="relative h-32 w-32">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold">{tool.percentage}%</span>
                          </div>
                          <svg className="h-full w-full" viewBox="0 0 100 100">
                            <circle
                              className="text-slate-200 dark:text-slate-700"
                              strokeWidth="10"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                            <circle
                              className="text-blue-500"
                              strokeWidth="10"
                              strokeDasharray={`${tool.percentage * 2.51} 251`}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="contributions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Coding Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContributionHeatmap data={profile.activity.dailyStats} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default Profile;
