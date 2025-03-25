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
  const [name, setName] = useState(""); // For signup only
  const [username, setUsername] = useState(""); // For signup only
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = type === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        type === "login"
          ? { email, password }
          : { email, password, username, fullName: name };

      const response = await fetch(`http://localhost:3001${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Store the JWT token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Optional: store user info

      // Show success toast
      toast({
        title: type === "login" ? "Successfully logged in" : "Account created",
        description:
          type === "login" ? "Welcome back!" : "Your account has been created successfully.",
      });

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process your request",
      });
    } finally {
      setLoading(false);
    }
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
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  required
                />
              </div>
            </>
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : type === "login" ? "Log in" : "Sign up"}
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