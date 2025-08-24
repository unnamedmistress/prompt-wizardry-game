import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback triggered, current URL:", window.location.href);
        
        // Handle the OAuth callback by processing the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          navigate("/login");
          return;
        }

        if (data.session) {
          console.log("Session found in callback, redirecting to home");
          navigate("/", { replace: true });
        } else {
          console.log("No session found, waiting for auth state change...");
          // Set up a one-time listener for auth state change
          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth state change in callback:", event, session ? "session exists" : "no session");
            if (session) {
              console.log("Session established, redirecting to home");
              navigate("/", { replace: true });
            } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
              console.log("Auth failed, redirecting to login");
              navigate("/login");
            }
            // Clean up the listener after first event
            authListener.subscription.unsubscribe();
          });
          
          // Fallback timeout in case auth state doesn't change
          setTimeout(() => {
            console.log("Timeout waiting for auth state change, redirecting to login");
            authListener.subscription.unsubscribe();
            navigate("/login");
          }, 10000); // 10 second timeout
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