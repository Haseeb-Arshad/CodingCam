
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProjectStat, formatTime } from "@/lib/mockData";

interface ProjectsTrackingProps {
  projects: ProjectStat[];
}

const ProjectsTracking = ({ projects }: ProjectsTrackingProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px]">
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Last active: {new Date(project.lastActive).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatTime(project.time)}</p>
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
