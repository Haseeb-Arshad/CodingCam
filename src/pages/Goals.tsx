import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ComingSoon from '@/components/ComingSoon';
import { Target } from 'lucide-react';

const Goals = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        <ComingSoon 
          title="Goal Tracking"
          description="Set coding goals, track your progress, and achieve your development milestones. Get personalized recommendations based on your coding patterns and stay motivated with achievement badges."
          icon={<Target size={48} />}
          bgColor="bg-emerald-600"
          accentColor="text-emerald-300"
        />
      </main>
    </>
  );
};

export default Goals; 