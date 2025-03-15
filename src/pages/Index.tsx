
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="container flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-wakatime-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span className="ml-2 text-xl font-bold text-gradient">CodeCortex</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="container max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Track Your Coding Time and
              <br />
              <span className="text-gradient">Boost Productivity</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              CodeCortex automatically tracks your programming activity, 
              generates insightful reports, and helps you improve your coding efficiency.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button size="lg" asChild className="text-lg">
                <Link to="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <Link to="/dashboard">Try Demo</Link>
              </Button>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-2xl border">
              <img 
                src="https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?q=80&w=1200&auto=format&fit=crop" 
                alt="Dashboard Preview" 
                className="w-full"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-wakatime-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-wakatime-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Automatic Time Tracking</h3>
                <p className="text-muted-foreground">
                  Seamlessly tracks your coding time across all your IDEs and projects without manual input.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-wakatime-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-wakatime-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Get comprehensive insights into your coding habits, languages, and projects.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-wakatime-accent/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-wakatime-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Developer Leaderboards</h3>
                <p className="text-muted-foreground">
                  Compare your stats with other developers and see how you rank globally.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 px-6">
        <div className="container text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-wakatime-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span className="ml-1 text-lg font-bold text-gradient">CodeCortex</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2023 CodeCortex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
