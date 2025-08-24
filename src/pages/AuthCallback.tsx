import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle OAuth callback by getting session from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          navigate("/login");
          return;
        }

        // Wait a moment for session to be established
        if (data.session) {
          console.log("Session found, redirecting to home");
          navigate("/", { replace: true });
        } else {
          // Try to refresh session and wait for auth state change
          const { data: { session } } = await supabase.auth.refreshSession();
          if (session) {
            navigate("/", { replace: true });
          } else {
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;