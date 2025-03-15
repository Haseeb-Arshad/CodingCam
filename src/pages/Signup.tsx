
import AuthForm from "@/components/auth/AuthForm";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/30">
      <div className="mb-8 text-center">
        <Link to="/" className="flex items-center justify-center mb-4">
          <svg className="h-10 w-10 text-wakatime-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          <span className="ml-2 text-2xl font-bold text-gradient">CodeCortex</span>
        </Link>
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-muted-foreground mt-2">
          Start tracking your coding productivity today
        </p>
      </div>
      <AuthForm type="signup" />
    </div>
  );
};

export default Signup;
