import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedRegistration, setHasCompletedRegistration] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!user?.id) {
        setHasCompletedRegistration(false);
        return;
      }

      setRegistrationLoading(true);
      try {
        const { data } = await supabase
          .from("registrations")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        setHasCompletedRegistration(Boolean(data));
      } catch (error) {
        console.error("Failed to check registration status", error);
        setHasCompletedRegistration(false);
      } finally {
        setRegistrationLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      setAdminLoading(true);
      try {
        const { data: settings, error } = await supabase
          .from("site_settings")
          .select("admin_emails")
          .maybeSingle();

        if (error) {
          // If table doesn't exist, just use fallback admin check
          if (error.code === 'PGRST116' || error.code === '42P01') {
            const normalizedUserEmail = user?.email?.toLowerCase();
            setIsAdmin(Boolean(normalizedUserEmail === "s220083@rguktsklm.ac.in"));
            return;
          }
          throw error;
        }

        const emailList = settings?.admin_emails || [];
        const normalizedUserEmail = user?.email?.toLowerCase();

        setIsAdmin(Boolean(normalizedUserEmail && (emailList.some((email) => email.toLowerCase() === normalizedUserEmail) || normalizedUserEmail === "s220083@rguktsklm.ac.in")));
      } catch (error) {
        console.warn("Admin status check failed, using fallback", error.message);
        // Fallback to hardcoded admin check
        const normalizedUserEmail = user?.email?.toLowerCase();
        setIsAdmin(Boolean(normalizedUserEmail === "s220083@rguktsklm.ac.in"));
      } finally {
        setAdminLoading(false);
      }
    };

    Promise.all([checkRegistrationStatus(), checkAdminStatus()]);
  }, [user?.email, user?.id]);

  const refreshRegistrationStatus = useCallback(async () => {
    if (!user?.id) {
      setHasCompletedRegistration(false);
      return;
    }

    setRegistrationLoading(true);
    try {
      const { data } = await supabase
        .from("registrations")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      setHasCompletedRegistration(Boolean(data));
    } catch (error) {
      console.error("Failed to refresh registration status", error);
    } finally {
      setRegistrationLoading(false);
    }
  }, [user?.id]);

  const value = useMemo(
    () => ({
      signUp: (data) => supabase.auth.signUp(data),
      signIn: (data) => supabase.auth.signInWithPassword(data),
      signOut: () => supabase.auth.signOut(),
      user,
      loading,
      registrationLoading,
      hasCompletedRegistration,
      refreshRegistrationStatus,
      isAdmin,
      adminLoading,
    }),
    [adminLoading, hasCompletedRegistration, isAdmin, loading, refreshRegistrationStatus, registrationLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
