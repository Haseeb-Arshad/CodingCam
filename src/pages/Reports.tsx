import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Line,
  Bar,
  Doughnut
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import {
  Download,
  Calendar,
  Clock,
  Code2,
  FileText,
  BarChart as BarChartIcon,
  Printer,
  Info,
  RefreshCw
} from "lucide-react";
import { saveAs } from 'file-saver';
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { currentUser, formatTime } from "@/lib/mockData";
import 'hammerjs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Helper function to export CSV
const exportToCsv = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  try {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add headers
    const headers = Object.keys(data[0]);
    csvContent += headers.join(",") + "\n";
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        if (header === 'date') {
          return new Date(value).toLocaleDateString();
        }
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      });
      csvContent += row.join(",") + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
  }
};

// Custom contribution heatmap component
const ContributionHeatmap = ({ data }: { data: any[] }) => {
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
  
  if (data && Array.isArray(data)) {
    data.forEach(item => {
      if (item && item.date) {
        const dateStr = new Date(item.date).toISOString().split('T')[0];
        dateValueMap.set(dateStr, item.totalSeconds);
      }
    });
  }
  
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
    currentWeek.push({
      date,
      value
    });
  });
  
  // Add the last week if not empty
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: null, value: null });
    }
    weeks.push(currentWeek);
  }
  
  return (
    <div className="mx-auto my-4">
      <div className="flex items-center mb-1 text-xs text-gray-500">
        <div className="flex-1"></div>
        <div className="mr-1">Less</div>
        <div className="flex items-center gap-1">
          {['bg-gray-100', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500'].map((color, i) => (
            <div key={i} className={`h-3 w-3 ${color} rounded-sm`}></div>
          ))}
        </div>
        <div className="ml-1">More</div>
      </div>
      
      <div className="flex text-xs text-gray-500 mb-1">
        <div className="w-8"></div>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
          <div key={i} className="w-5 text-center">{day[0]}</div>
        ))}
      </div>
      
      <div className="flex">
        <div className="flex flex-col justify-between py-1 mr-2 text-xs text-gray-500">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
            <div key={i} style={{ height: `${weeks.length / 12}px` }} className={i % 2 === 0 ? 'invisible' : ''}>
              {month}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((day, dayIndex) => {
                let bgColorClass = 'bg-gray-100';
                
                if (day.date !== null) {
                  const intensity = Math.min(Math.floor(day.value / 3600), 5);
                  if (intensity > 0) {
                    const intensityClasses = [
                      'bg-blue-100',
                      'bg-blue-200',
                      'bg-blue-300',
                      'bg-blue-400',
                      'bg-blue-500'
                    ];
                    bgColorClass = intensityClasses[intensity - 1];
                  }
                  
                  return (
                    <TooltipProvider key={dayIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`h-5 w-5 rounded-sm ${bgColorClass} hover:ring-1 hover:ring-blue-500`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {day.date?.toLocaleDateString()}: {formatTime(day.value)}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                } else {
                  return <div key={dayIndex} className="h-5 w-5"></div>;
                }
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  console.log("Rendering Reports component");
  const { token } = useAuth();
  console.log("Auth token:", token ? "Present (authenticated)" : "Missing (not authenticated)");
  
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Reports useEffect running with date range:", startDate, endDate);
    
    const generateMockData = () => {
      try {
        console.log("Generating mock data...");
        // Generate mock data for the selected date range
        const days = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Ensure valid date range
        if (start > end) {
          throw new Error("Start date cannot be after end date");
        }
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          days.push({
            date: d.toISOString(),
            totalSeconds: Math.floor(Math.random() * 72000) + 3600,
            keystrokeCount: Math.floor(Math.random() * 10000),
            projects: ['Project A', 'Project B', 'Project C'],
            languages: ['JavaScript', 'Python', 'TypeScript']
          });
        }

        const totalCodingTime = days.reduce((sum, day) => sum + day.totalSeconds, 0);
        const averageSecondsPerDay = days.length > 0 ? totalCodingTime / days.length : 0;
        
        console.log(`Generated data for ${days.length} days`);

        return {
          timeframe: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          },
          overview: {
            totalCodingTime,
            dailyAverage: averageSecondsPerDay,
            keystrokeCount: Math.floor(Math.random() * 1000000),
            sessionCount: Math.floor(Math.random() * 50),
            projectsCount: 3,
            languagesCount: 3
          },
          dailyActivity: days,
          languages: [
            { name: 'JavaScript', seconds: 72000, percentage: 40, color: '#3b82f6' },
            { name: 'Python', seconds: 54000, percentage: 30, color: '#10b981' },
            { name: 'TypeScript', seconds: 36000, percentage: 20, color: '#8b5cf6' },
            { name: 'Java', seconds: 18000, percentage: 10, color: '#ef4444' }
          ],
          projects: [
            { 
              name: 'Project A', 
              totalTime: 72000,
              lastActive: new Date().toISOString(),
              percentChange: 15
            },
            { 
              name: 'Project B', 
              totalTime: 54000,
              lastActive: new Date(Date.now() - 3600000).toISOString(),
              percentChange: -5
            },
            { 
              name: 'Project C', 
              totalTime: 36000,
              lastActive: new Date(Date.now() - 7200000).toISOString(),
              percentChange: 25
            }
          ],
          generatedAt: new Date()
        };
      } catch (error) {
        console.error("Error generating mock data:", error);
        throw error;
      }
    };

    // Simulate loading state
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const mockData = generateMockData();
        setAnalyticsData(mockData);
        setError(null);
        console.log("Analytics data set successfully");
      } catch (error) {
        console.error("Failed to generate mock data:", error);
        setError(error instanceof Error ? error.message : 'Failed to generate analytics data');
        setAnalyticsData(null);
      } finally {
        setLoading(false);
      }
    }, 1000); // Simulate 1 second loading time
  }, [startDate, endDate]);

  // Handle PDF export by using browser print functionality
  const handleExportPDF = () => {
    window.print();
  };
  
  // Handle CSV export
  const handleExportCSV = () => {
    if (analyticsData && analyticsData.dailyActivity) {
      exportToCsv(
        analyticsData.dailyActivity, 
        `Coding_Report_${startDate.toLocaleDateString()}_to_${endDate.toLocaleDateString()}`
      );
    } else {
      setError("No data available to export");
    }
  };

  // For debugging - reload the component/data
  const handleRetry = () => {
    console.log("Retrying data load...");
    window.location.reload();
  };

  console.log("Render state:", { loading, error, hasData: !!analyticsData });

  if (loading) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <main className="ml-64 mt-16 p-6">
          <div className="flex items-center justify-center h-[calc(100vh-150px)]">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-[#014D71] border-t-transparent rounded-full animate-spin"></div>
              <div className="text-[#014D71]">Loading analytics data...</div>
            </div>
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
        <main className="ml-64 mt-16 p-6">
          <div className="flex items-center justify-center h-[calc(100vh-150px)]">
            <div className="text-red-500 text-center">
              <div className="text-xl font-semibold mb-2">Error Loading Reports</div>
              <div className="text-sm">{error}</div>
              <Button 
                onClick={handleRetry} 
                className="mt-4 bg-[#014D71] hover:bg-[#014D71]/90 text-white flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Retry
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!analyticsData) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <main className="ml-64 mt-16 p-6">
          <div className="flex items-center justify-center h-[calc(100vh-150px)] flex-col">
            <div className="text-center mb-4">
              <div className="text-xl font-semibold mb-2">No Data Available</div>
              <div className="text-sm text-gray-500">Please try adjusting your date range</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">From:</span>
                <DatePicker 
                  value={startDate}
                  onChange={(e: any) => setStartDate(e.value)}
                  format="MMM d, yyyy"
                  className="w-40"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">To:</span>
                <DatePicker 
                  value={endDate}
                  onChange={(e: any) => setEndDate(e.value)}
                  format="MMM d, yyyy"
                  className="w-40"
                />
              </div>
              
              <Button 
                onClick={handleRetry} 
                className="bg-[#014D71] hover:bg-[#014D71]/90 text-white flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Retry
              </Button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Prepare data for charts
  const dailyData = {
    labels: analyticsData.dailyActivity.map((day: any) => 
      new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Coding Hours',
        data: analyticsData.dailyActivity.map((day: any) => 
          Math.round(day.totalSeconds / 3600 * 10) / 10
        ),
        borderColor: '#014D71',
        backgroundColor: 'rgba(1, 77, 113, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const languageData = {
    labels: analyticsData.languages.map((lang: any) => lang.name),
    datasets: [
      {
        data: analyticsData.languages.map((lang: any) => lang.percentage),
        backgroundColor: analyticsData.languages.map((lang: any) => lang.color),
        borderWidth: 0
      }
    ]
  };

  const projectData = {
    labels: analyticsData.projects.map((project: any) => project.name),
    datasets: [
      {
        data: analyticsData.projects.map((project: any) => 
          Math.round(project.totalTime / 3600 * 10) / 10
        ),
        backgroundColor: [
          '#014D71', '#3b82f6', '#06b6d4', 
          '#10b981', '#84cc16', '#eab308'
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      },
      tooltip: {
        boxPadding: 5,
        padding: 10
      }
    }
  };
  
  // Specific options for Line chart with simpler configuration
  const lineChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    }
  };

  // Specific options for doughnut charts - no scales needed
  const doughnutChartOptions = {
    ...chartOptions
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 px-8 py-6 bg-slate-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
        <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#014D71] dark:text-blue-300">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Detailed insights into your coding activity
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">From:</span>
              <DatePicker 
                value={startDate}
                onChange={(e: any) => setStartDate(e.value)}
                format="MMM d, yyyy"
                className="w-40"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">To:</span>
              <DatePicker 
                value={endDate}
                onChange={(e: any) => setEndDate(e.value)}
                format="MMM d, yyyy"
                className="w-40"
              />
            </div>
            
            <Button 
              variant="outline" 
              className="gap-1"
              onClick={handleExportPDF}
            >
              <FileText size={16} />
              Export PDF
            </Button>
          </div>
        </div>
        
        <div id="report-content" className="print:p-5 animate-fadeIn">
          {/* Overview Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col hover:shadow-md transition-all">
              <span className="text-sm text-muted-foreground">Total Coding Time</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">
                  {formatTime(analyticsData.overview.totalCodingTime)}
                </span>
                <Clock className="text-[#014D71]" size={20} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col hover:shadow-md transition-all">
              <span className="text-sm text-muted-foreground">Daily Average</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">
                  {formatTime(analyticsData.overview.dailyAverage)}
                </span>
                <Calendar className="text-green-500" size={20} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col hover:shadow-md transition-all">
              <span className="text-sm text-muted-foreground">Top Language</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">
                  {analyticsData.languages[0].name}
                </span>
                <Code2 className="text-purple-500" size={20} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col hover:shadow-md transition-all">
              <span className="text-sm text-muted-foreground">Keystrokes</span>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-2xl font-bold">
                  {analyticsData.overview.keystrokeCount.toLocaleString()}
                </span>
                <BarChartIcon className="text-amber-500" size={20} />
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="activity" className="data-[state=active]:bg-[#014D71] data-[state=active]:text-white">Activity</TabsTrigger>
              <TabsTrigger value="languages" className="data-[state=active]:bg-[#014D71] data-[state=active]:text-white">Languages</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-[#014D71] data-[state=active]:text-white">Projects</TabsTrigger>
              <TabsTrigger value="data" className="data-[state=active]:bg-[#014D71] data-[state=active]:text-white">Raw Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-6 animate-fadeIn">
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Daily Coding Hours</CardTitle>
                  <CardDescription>Hours spent coding each day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Line data={dailyData} options={lineChartOptions} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Contribution Graph</CardTitle>
                  <CardDescription>Your coding activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContributionHeatmap data={analyticsData.dailyActivity} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="languages" className="space-y-6 animate-fadeIn">
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                  <CardDescription>Time spent in each language</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Doughnut data={languageData} options={doughnutChartOptions} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Top Languages</CardTitle>
                  <CardDescription>Your most used languages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.languages.map((lang: any) => (
                      <div key={lang.name} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: lang.color }}
                            />
                            <span className="font-medium">{lang.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatTime(lang.seconds)}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${lang.percentage}%`,
                              backgroundColor: lang.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-6 animate-fadeIn">
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Project Activity</CardTitle>
                  <CardDescription>Time spent on each project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.projects.map((project: any) => (
                      <div 
                        key={project.name}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border rounded-lg hover:shadow-sm transition-all"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Last active: {new Date(project.lastActive).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="font-medium">{formatTime(project.totalTime)}</div>
                          <Badge 
                            className={
                              project.percentChange >= 0 
                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                            variant="outline"
                          >
                            {project.percentChange >= 0 ? "+" : ""}
                            {project.percentChange}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Project Distribution</CardTitle>
                  <CardDescription>Time allocation across projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Doughnut data={projectData} options={doughnutChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="space-y-6 animate-fadeIn">
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Raw Activity Data</CardTitle>
                    <CardDescription>Detailed view of your coding activity</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" onClick={handleExportCSV}>
                    <Download size={16} />
                    Export CSV
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Date</th>
                          <th className="text-left py-2">Hours</th>
                          <th className="text-left py-2">Projects</th>
                          <th className="text-left py-2">Languages</th>
                          <th className="text-left py-2">Keystrokes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.dailyActivity.map((day: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{new Date(day.date).toLocaleDateString()}</td>
                            <td className="py-2">{Math.round(day.totalSeconds / 3600 * 10) / 10}</td>
                            <td className="py-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="truncate max-w-[150px]">
                                      {day.projects.join(', ')}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{day.projects.join(', ')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="py-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="truncate max-w-[150px]">
                                      {day.languages.join(', ')}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{day.languages.join(', ')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </td>
                            <td className="py-2">{day.keystrokeCount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default Reports;
