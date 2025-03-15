export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalCodingTime: number; // in seconds
  dailyAverage: number; // in seconds
  languages: LanguageStat[];
  projects: ProjectStat[];
  activity: ActivityItem[];
  dailyHours: DailyHours[];
}

export interface LanguageStat {
  name: string;
  percentage: number;
  time: number; // in seconds
  color: string;
}

export interface ProjectStat {
  name: string;
  time: number; // in seconds
  lastActive: string;
}

export interface ActivityItem {
  date: string;
  project: string;
  language: string;
  duration: number; // in seconds
}

export interface DailyHours {
  date: string;
  hours: number;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  totalTimeThisWeek: number; // in seconds
  dailyAverage: number; // in seconds
  topLanguage: string;
}

export const currentUser: User = {
  id: "user1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/150?img=1",
  joinDate: "2023-01-15",
  totalCodingTime: 1235600, // about 343 hours
  dailyAverage: 14400, // 4 hours
  languages: [
    { name: "TypeScript", percentage: 45, time: 556020, color: "#007ACC" },
    { name: "JavaScript", percentage: 25, time: 308900, color: "#F7DF1E" },
    { name: "HTML", percentage: 15, time: 185340, color: "#E34F26" },
    { name: "CSS", percentage: 10, time: 123560, color: "#1572B6" },
    { name: "Python", percentage: 5, time: 61780, color: "#3776AB" }
  ],
  projects: [
    { name: "WakaTime Clone", time: 432000, lastActive: "2023-06-15" },
    { name: "E-commerce Site", time: 345600, lastActive: "2023-06-10" },
    { name: "Personal Website", time: 172800, lastActive: "2023-06-05" },
    { name: "Mobile App", time: 86400, lastActive: "2023-06-01" },
  ],
  activity: [
    { date: "2023-06-15", project: "WakaTime Clone", language: "TypeScript", duration: 14400 },
    { date: "2023-06-14", project: "WakaTime Clone", language: "TypeScript", duration: 18000 },
    { date: "2023-06-13", project: "E-commerce Site", language: "JavaScript", duration: 10800 },
    { date: "2023-06-12", project: "WakaTime Clone", language: "CSS", duration: 7200 },
    { date: "2023-06-11", project: "Personal Website", language: "HTML", duration: 3600 },
    { date: "2023-06-10", project: "E-commerce Site", language: "JavaScript", duration: 9000 },
    { date: "2023-06-09", project: "Mobile App", language: "TypeScript", duration: 5400 },
  ],
  dailyHours: [
    { date: "2023-06-15", hours: 4 },
    { date: "2023-06-14", hours: 5 },
    { date: "2023-06-13", hours: 3 },
    { date: "2023-06-12", hours: 2 },
    { date: "2023-06-11", hours: 1 },
    { date: "2023-06-10", hours: 2.5 },
    { date: "2023-06-09", hours: 1.5 },
    { date: "2023-06-08", hours: 3.5 },
    { date: "2023-06-07", hours: 4 },
    { date: "2023-06-06", hours: 3 },
    { date: "2023-06-05", hours: 2 },
    { date: "2023-06-04", hours: 4.5 },
    { date: "2023-06-03", hours: 3 },
    { date: "2023-06-02", hours: 2.5 },
  ]
};

export const leaderboard: LeaderboardUser[] = [
  { rank: 1, userId: "user2", name: "Emma Wilson", avatar: "https://i.pravatar.cc/150?img=5", totalTimeThisWeek: 180000, dailyAverage: 25714, topLanguage: "Java" },
  { rank: 2, userId: "user3", name: "Michael Chen", avatar: "https://i.pravatar.cc/150?img=3", totalTimeThisWeek: 165600, dailyAverage: 23657, topLanguage: "Python" },
  { rank: 3, userId: "user1", name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=1", totalTimeThisWeek: 140400, dailyAverage: 20057, topLanguage: "TypeScript" },
  { rank: 4, userId: "user4", name: "Sophia Kim", avatar: "https://i.pravatar.cc/150?img=10", totalTimeThisWeek: 122400, dailyAverage: 17486, topLanguage: "C++" },
  { rank: 5, userId: "user5", name: "Daniel Martinez", avatar: "https://i.pravatar.cc/150?img=7", totalTimeThisWeek: 115200, dailyAverage: 16457, topLanguage: "JavaScript" },
  { rank: 6, userId: "user6", name: "Olivia Brown", avatar: "https://i.pravatar.cc/150?img=9", totalTimeThisWeek: 100800, dailyAverage: 14400, topLanguage: "Ruby" },
  { rank: 7, userId: "user7", name: "Noah Taylor", avatar: "https://i.pravatar.cc/150?img=12", totalTimeThisWeek: 93600, dailyAverage: 13371, topLanguage: "PHP" },
  { rank: 8, userId: "user8", name: "Ava Garcia", avatar: "https://i.pravatar.cc/150?img=15", totalTimeThisWeek: 86400, dailyAverage: 12343, topLanguage: "Swift" },
  { rank: 9, userId: "user9", name: "Liam Rodriguez", avatar: "https://i.pravatar.cc/150?img=20", totalTimeThisWeek: 79200, dailyAverage: 11314, topLanguage: "Kotlin" },
  { rank: 10, userId: "user10", name: "Mia Lee", avatar: "https://i.pravatar.cc/150?img=25", totalTimeThisWeek: 72000, dailyAverage: 10286, topLanguage: "Go" },
];

export const users: User[] = [
  currentUser,
  // other users would be defined here
];

// Utility functions
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} hr${hours === 1 ? '' : 's'} ${minutes} min${minutes === 1 ? '' : 's'}`;
  }
  
  return `${minutes} min${minutes === 1 ? '' : 's'}`;
};

export const getUserById = (userId: string): User | undefined => {
  return users.find(user => user.id === userId) || undefined;
};

export const getRandomUser = (): User => {
  return users[0]; // Just return current user for now
};
