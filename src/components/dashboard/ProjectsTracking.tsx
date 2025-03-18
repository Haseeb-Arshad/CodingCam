import React from 'react';
import { formatTime } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Project {
  name: string;
  lastActive: string;
  time: number;
}

interface ProjectsTrackingProps {
  projects: Project[];
}

const ProjectsTracking = ({ projects }: ProjectsTrackingProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="flex items-center justify-between rounded-lg border p-3 bg-card hover:bg-muted transition-all duration-200"
              >
                <div className="space-y-1">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Last active: {new Date(project.lastActive).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">{formatTime(project.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProjectsTracking;