import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import ComingSoon from '@/components/ComingSoon';
import { Users } from 'lucide-react';

const Teams = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 min-h-[calc(100vh-4rem)]">
        <ComingSoon 
          title="Team Collaboration"
          description="Collaborate with your development team, track collective progress, and distribute tasks effectively. Compare stats, schedule coding sessions, and improve your team's overall productivity."
          icon={<Users size={48} />}
          bgColor="bg-violet-600"
          accentColor="text-violet-300"
        />
      </main>
    </>
  );
};

export default Teams; 