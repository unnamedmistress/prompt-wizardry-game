import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const handleAuthCallback = async () => {
      try {
        console.log("Auth callback triggered, current URL:", window.location.href);
        
        // Check if there's an error in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');
        
        if (error) {
          console.error("OAuth error from URL:", { error, errorDescription });
          alert(`OAuth Error: ${error}\nDescription: ${errorDescription}`);
          navigate("/login");
          return;
        }
        
        // Some providers send tokens in the hash (#). Supabase's detectSessionInUrl handles this
        // but we log it for diagnostics before calling getSession.
        if (window.location.hash) {
          console.log('URL hash present (raw):', window.location.hash);
        }

        // Primary attempt to obtain session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Auth callback error:", sessionError);
          navigate("/login");
          return;
        }

        if (data.session) {
          console.log("Session found in callback, redirecting to home");
          navigate("/", { replace: true });
        } else {
          console.log("No session yet. Attempting forced refresh using any persisted refresh token...");

          // Try to force refresh if a refresh token was stored (edge case if detectSessionInUrl raced)
          try {
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.warn('Refresh attempt failed:', refreshError.message);
            } else if (refreshData.session) {
              console.log('Session obtained after manual refresh, redirecting');
              navigate('/', { replace: true });
              return;
            }
          } catch (e) {
            console.warn('Manual refresh threw:', e);
          }

          console.log("Still no session; subscribing to auth state change...");
          // Set up a one-time listener for auth state change
          const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Auth state change in callback:", event, session ? "session exists" : "no session");
            if (session) {
              console.log("Session established, redirecting to home");
              navigate("/", { replace: true });
            } else if (event === 'SIGNED_IN') {
              console.log('SIGNED_IN event without session object payload (unexpected)');
            } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
              console.log("Auth failed, redirecting to login");
              navigate("/login");
            }
            // Clean up the listener after first event
            authListener.subscription.unsubscribe();
          });
          
          // Fallback timeout in case auth state doesn't change
          setTimeout(async () => {
            console.log("Timeout waiting for auth state change; final getSession check before redirect.");
            const { data: finalData } = await supabase.auth.getSession();
            if (finalData.session) {
              console.log('Late session appeared just before timeout redirect, sending home');
              navigate('/', { replace: true });
            } else {
              authListener.subscription.unsubscribe();
              navigate('/login');
            }
          }, 10000);
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