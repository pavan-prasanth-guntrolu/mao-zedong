import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AuthComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [mode, setMode] = useState("signin"); // signin or signup
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // This listener will trigger on SIGNED_IN, SIGNED_OUT, PASSWORD_RECOVERY, etc.
      if (event === "SIGNED_IN" && session) {
        try {
          // Check if user already has a registration
          const { data: registration } = await supabase
            .from("registrations")
            .select("id")
            .eq("user_id", session.user.id)
            .maybeSingle();

          if (registration) {
            // User already registered, redirect to home
            navigate("/");
            toast({
              title: "Welcome back!",
              description: "You have already completed your registration.",
            });
          } else {
            // New user, redirect to registration
            navigate("/register");
            toast({
              title: "Registration Required",
              description: "Please complete your registration to continue.",
            });
          }
        } catch (error) {
          console.error("Error checking registration status:", error);
          // If there's an error, still redirect to register page
          navigate("/register");
        }
      }
    }); // Clean up the listener on component unmount

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]); // Re-run effect if navigate function changes

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      let result;
      if (mode === "signin") {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) throw result.error;

      if (mode === "signup") {
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            process.env.NODE_ENV === "development"
              ? "http://localhost:8080/"
              : "https://quantum.rgukt.in/",
        },
      });

      if (error) throw error;
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setAuthError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {" "}
      <Card className="w-full max-w-md mx-auto glass-card border border-white/10 shadow-xl">
        {" "}
        <CardHeader>
          {" "}
          <CardTitle className="text-center text-2xl font-bold">
            {mode === "signin" ? "Sign In" : "Create Account"}{" "}
          </CardTitle>{" "}
        </CardHeader>{" "}
        <CardContent>
          {" "}
          {authError && (
            <motion.div
              className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {authError}{" "}
            </motion.div>
          )}{" "}
          <form onSubmit={handleAuth} className="space-y-6">
            {" "}
            <div className="space-y-4">
              {" "}
              <div className="space-y-2">
                {" "}
                <Label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center"
                >
                  {" "}
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  Email Address{" "}
                </Label>{" "}
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="bg-background/50 border-white/20 focus:border-primary"
                />{" "}
              </div>{" "}
              <div className="space-y-2">
                {" "}
                <Label
                  htmlFor="password"
                  className="text-sm font-medium flex items-center"
                >
                  {" "}
                  <Lock className="h-4 w-4 mr-2 text-primary" />
                  Password{" "}
                </Label>{" "}
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === "signin"
                      ? "Enter your password"
                      : "Create a password (min. 6 characters)"
                  }
                  required
                  minLength={6}
                  className="bg-background/50 border-white/20 focus:border-primary"
                />{" "}
              </div>{" "}
            </div>{" "}
            <Button
              type="submit"
              className="w-full btn-quantum text-primary-foreground py-3 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow"
              disabled={loading}
            >
              {" "}
              <span className="relative z-10 flex items-center justify-center">
                {" "}
                {loading ? (
                  <span className="flex items-center justify-center">
                    {" "}
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      {" "}
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>{" "}
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>{" "}
                    </svg>{" "}
                    {mode === "signin"
                      ? "Signing In..."
                      : "Creating Account..."}{" "}
                  </span>
                ) : (
                  <>
                    {" "}
                    {mode === "signin" ? "Sign In" : "Create Account"}{" "}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />{" "}
                  </>
                )}{" "}
              </span>{" "}
              <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>{" "}
            </Button>{" "}
          </form>{" "}
          <div className="mt-6 flex items-center justify-center gap-3">
            <Separator className="flex-grow" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-grow" />
          </div>{" "}
          <Button
            type="button"
            className="w-full btn-quantum text-primary-foreground py-3 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow mt-4"
            onClick={handleGoogleLogin}
          >
            {" "}
            <span className="relative z-10 flex items-center justify-center">
              Sign In with Google{" "}
            </span>{" "}
            <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>{" "}
          </Button>{" "}
          <Button
            type="button"
            className="w-full btn-quantum text-primary-foreground py-3 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow mt-3"
            onClick={toggleMode}
          >
            {" "}
            <span className="relative z-10 flex items-center justify-center">
              {" "}
              {mode === "signin"
                ? "Create a New Account"
                : "Sign In with Existing Account"}{" "}
            </span>{" "}
            <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>{" "}
          </Button>{" "}
        </CardContent>{" "}
        <CardFooter className="text-center text-sm text-muted-foreground">
          {" "}
          <p className="w-full">
            By continuing, you agree to our{" "}
            <a href="/code-of-conduct" className="text-primary hover:underline">
              Code of Conduct{" "}
            </a>{" "}
          </p>{" "}
        </CardFooter>{" "}
      </Card>{" "}
    </motion.div>
  );
};

export default AuthComponent;
