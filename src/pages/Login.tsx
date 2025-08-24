import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Already logged in, redirecting to home");
        navigate("/", { replace: true });
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session ? "session exists" : "no session");
      if (session && event === 'SIGNED_IN') {
        navigate("/", { replace: true });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignIn = async (provider: "google" | "azure") => {
    try {
      console.log("Starting OAuth sign in with provider:", provider);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        console.error("OAuth sign in error:", error);
      } else {
        console.log("OAuth sign in initiated successfully:", data);
      }
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <span className="font-bold text-sm sm:text-lg">AI Literacy</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-sm font-medium text-primary">🔐 Sign In</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-16 sm:pt-20 flex flex-col items-center justify-center p-4 text-center gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Prompt Wizardry</h1>
          <p className="max-w-md text-muted-foreground">
            Practice crafting effective AI prompts through quick, fun mini games.
            Click below to begin your journey.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button onClick={() => handleSignIn("google")}>Play with Google</Button>
          <Button onClick={() => handleSignIn("azure")}>Play with Azure</Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
