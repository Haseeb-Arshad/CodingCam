
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Just for demo, we're simulating a successful login/signup
    if (type === "login") {
      toast({
        title: "Successfully logged in",
        description: "Welcome back!",
      });
    } else {
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    }
    
    navigate("/dashboard");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{type === "login" ? "Log in" : "Sign up"}</CardTitle>
        <CardDescription>
          {type === "login" 
            ? "Enter your email below to log in to your account." 
            : "Enter your information below to create your account."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe" 
                required 
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@example.com" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            {type === "login" ? "Log in" : "Sign up"}
          </Button>
          {type === "login" ? (
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <a href="/signup" className="text-wakatime-primary hover:underline">
                Sign up
              </a>
            </p>
          ) : (
            <p className="text-sm text-center">
              Already have an account?{" "}
              <a href="/login" className="text-wakatime-primary hover:underline">
                Log in
              </a>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
