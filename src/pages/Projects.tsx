
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { currentUser, formatTime } from "@/lib/mockData";

const Projects = () => {
  return (
    <>
      <Navbar />
      <Sidebar />
      <main className="ml-64 mt-16 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Track and manage your projects
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentUser.projects.map((project) => (
            <Card key={project.name}>
              <CardHeader className="pb-2">
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Last active: {new Date(project.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center gap-4">
                    <div className="text-sm font-medium">
                      Total time: {formatTime(project.time)}
                    </div>
                    <Button variant="secondary" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
};

export default Projects;
