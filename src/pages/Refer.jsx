import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Copy, Share2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const Refer = () => {
  const [referralCode, setReferralCode] = useState("");
  const [referredUsers, setReferredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendReferralCode, setFriendReferralCode] = useState("");
  const [hasRegistration, setHasRegistration] = useState(false);
  const [currentFriendReferralCode, setCurrentFriendReferralCode] =
    useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Authentication guard
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to access the Refer page.
          </p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  const generateUniqueReferralCode = async () => {
    while (true) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const { data, error } = await supabase
        .from("registrations")
        .select("id")
        .eq("referral_code", code)
        .maybeSingle();
      if (error) throw error;
      if (!data) return code;
    }
  };

  useEffect(() => {
    if (user) {
      fetchReferralData();
      fetchLeaderboard();

      // Set up real-time subscription to listen for registration changes
      const registrationsChannel = supabase
        .channel("registrations-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "registrations",
          },
          (payload) => {
            console.log("Registration change detected:", payload);
            // Refresh data when any registration changes occur
            fetchReferralData();
            fetchLeaderboard();
          }
        )
        .subscribe();

      // Set up periodic refresh every 30 seconds as backup
      const intervalId = setInterval(() => {
        fetchReferralData();
        fetchLeaderboard();
      }, 30000); // 30 seconds

      // Cleanup function
      return () => {
        supabase.removeChannel(registrationsChannel);
        clearInterval(intervalId);
      };
    }
  }, [user]);

  const fetchReferralData = async () => {
    try {
      // First, try to fetch the user's registration without the join to avoid complex query issues
      const { data: registration, error: registrationError } = await supabase
        .from("registrations")
        .select("referral_code, id, referred_by, total_referrals")
        .eq("user_id", user.id)
        .maybeSingle();

      if (registrationError) {
        console.error("Registration query error:", registrationError);
        throw registrationError;
      }

      if (registration) {
        setHasRegistration(true);
        setReferralCode(registration.referral_code);
        setTotalReferrals(registration.total_referrals || 0);

        console.log("Registration data:", registration);
        console.log("referred_by:", registration.referred_by);

        // Set the current friend's referral code if it exists
        // Check if user has been referred by someone
        if (registration.referred_by) {
          try {
            // Fetch referrer's code separately to avoid join issues
            console.log(
              "Fetching referrer data for ID:",
              registration.referred_by
            );
            const { data: referrerData, error: referrerError } = await supabase
              .from("registrations")
              .select("referral_code")
              .eq("id", registration.referred_by)
              .maybeSingle();

            if (referrerError) {
              console.error("Referrer query error:", referrerError);
            } else if (referrerData && referrerData.referral_code) {
              console.log(
                "Setting referral code from referrer fetch:",
                referrerData.referral_code
              );
              setCurrentFriendReferralCode(referrerData.referral_code);
              setFriendReferralCode(referrerData.referral_code);
            }
          } catch (referrerFetchError) {
            console.error("Error fetching referrer data:", referrerFetchError);
            // Don't throw here - just log the error and continue
          }
        } else {
          // Clear the states if no referral code is set
          console.log("No referred_by value, clearing referral codes");
          setCurrentFriendReferralCode("");
          setFriendReferralCode("");
        }

        // Fetch users referred by this registration
        try {
          const { data: referrals, error: referralsError } = await supabase
            .from("registrations")
            .select("fullName, email, created_at")
            .eq("referred_by", registration.id);

          if (referralsError) {
            console.error("Referrals query error:", referralsError);
          } else {
            setReferredUsers(referrals || []);
          }
        } catch (referralsError) {
          console.error("Error fetching referrals:", referralsError);
          // Don't throw here - just log the error and continue
          setReferredUsers([]);
        }
      } else {
        console.log("No registration found for user");
        setHasRegistration(false);
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
      toast({
        title: "Error",
        description: `Failed to load referral data: ${
          error.message || "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      // Get top 10 referrers using the total_referrals column for accurate sorting
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from("registrations")
        .select("id, fullName, email, institution, total_referrals")
        .gt("total_referrals", 0)
        .order("total_referrals", { ascending: false })
        .limit(50);

      if (leaderboardError) {
        console.error("Leaderboard query error:", leaderboardError);
        return; // Don't throw, just log and return
      }

      // Transform data to match expected format
      const formattedLeaderboard = (leaderboardData || []).map((user) => ({
        id: user.id,
        fullName: user.fullName || "Unknown",
        email: user.email || "Unknown",
        institution: user.institution || "Unknown",
        count: user.total_referrals || 0,
      }));

      setLeaderboard(formattedLeaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      // Don't show error toast for leaderboard - it's not critical functionality
      setLeaderboard([]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  const shareReferralLink = () => {
    const url = `${window.location.origin}/register?ref=${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: "Join Qiskit Fall Fest 2025",
        text: "Use my referral code to register!",
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Referral link copied to clipboard.",
      });
    }
  };

  const applyReferralCode = async () => {
    // Check if referral code is already locked
    if (currentFriendReferralCode) {
      toast({
        title: "Referral Code Locked",
        description:
          "You have already applied a referral code. It cannot be changed.",
        variant: "destructive",
      });
      return;
    }

    if (!friendReferralCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a referral code.",
        variant: "destructive",
      });
      return;
    }

    // Prevent self-referral
    if (friendReferralCode.trim() === referralCode) {
      toast({
        title: "Invalid Code",
        description: "You cannot use your own referral code.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find referrer
      let referredBy = null;
      const { data: referrer } = await supabase
        .from("registrations")
        .select("id, user_id")
        .eq("referral_code", friendReferralCode.trim())
        .single();

      if (referrer) {
        // Double check it's not self-referral
        if (referrer.user_id === user.id) {
          toast({
            title: "Invalid Code",
            description: "You cannot use your own referral code.",
            variant: "destructive",
          });
          return;
        }
        referredBy = referrer.id;
      } else {
        toast({
          title: "Invalid Code",
          description: "The referral code you entered is invalid.",
          variant: "destructive",
        });
        return;
      }

      if (hasRegistration) {
        // Check if user already has a referral code set
        const { data: currentRegistration } = await supabase
          .from("registrations")
          .select("referred_by")
          .eq("user_id", user.id)
          .single();

        if (currentRegistration && currentRegistration.referred_by) {
          toast({
            title: "Referral Code Locked",
            description:
              "You have already applied a referral code. It cannot be changed.",
            variant: "destructive",
          });
          return;
        }

        // Update existing registration only if no referral code exists
        const { error: updateError } = await supabase
          .from("registrations")
          .update({ referred_by: referredBy })
          .eq("user_id", user.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new registration record
        const userReferralCode = await generateUniqueReferralCode();

        const { error: registrationError } = await supabase
          .from("registrations")
          .insert([
            {
              user_id: user.id,
              fullName: user.user_metadata?.full_name || user.email,
              email: user.email,
              referral_code: userReferralCode,
              referred_by: referredBy,
            },
          ]);

        if (registrationError) {
          throw registrationError;
        }
      }

      toast({
        title: "Referral Applied!",
        description: "Your referral code has been applied successfully.",
      });

      // Refresh data
      fetchReferralData();
      fetchLeaderboard();
    } catch (error) {
      console.error("Error applying referral code:", error);
      toast({
        title: "Error",
        description: "Failed to apply referral code. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasRegistration) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-8">
              Refer & Earn
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Complete your registration first to access the referral program
              and start earning rewards!
            </p>
            <Button
              onClick={() => navigate("/register")}
              className="btn-quantum"
            >
              Register Now
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-4">
              Refer & Earn
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Share your referral code and invite friends to join Qiskit Fall
              Fest 2025
            </p>

            {/* Total Referrals Counter */}
            {hasRegistration && (
              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">
                  You have referred{" "}
                  <span className="text-2xl font-bold text-primary">
                    {totalReferrals}
                  </span>{" "}
                  people
                </span>
              </div>
            )}
          </div>

          {/* Main Referral Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Enter Friend's Referral Code Section */}
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-primary" />
                  Friend's Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="friendReferralCode">
                    Referral Code {currentFriendReferralCode && "🔒"}
                  </Label>
                  <Input
                    id="friendReferralCode"
                    type="text"
                    value={friendReferralCode}
                    onChange={(e) => setFriendReferralCode(e.target.value)}
                    placeholder="Enter your friend's referral code"
                    className={`font-mono ${
                      currentFriendReferralCode
                        ? "bg-muted cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!!currentFriendReferralCode}
                    readOnly={!!currentFriendReferralCode}
                  />
                </div>
                <Button
                  onClick={applyReferralCode}
                  className="w-full"
                  disabled={!!currentFriendReferralCode}
                >
                  {currentFriendReferralCode
                    ? "Referral Code Locked"
                    : "Apply Referral Code"}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {currentFriendReferralCode
                    ? "🔒 You have already been referred by someone and cannot be referred again."
                    : "Enter a referral code from a friend to earn rewards!"}
                </p>
              </CardContent>
            </Card>

            {/* Your Referral Code Section */}
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-primary" />
                  Your Referral Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasRegistration ? (
                  <>
                    <div>
                      <Label>Referral Code</Label>
                      <div className="flex gap-2">
                        <Input
                          value={referralCode}
                          readOnly
                          className="font-mono"
                        />
                        <Button onClick={copyToClipboard} variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={shareReferralLink} className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Referral Link
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      Share this code with friends during registration to earn
                      rewards!
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Register to Generate Your Own Referral Code.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Referred Users Section */}
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    People You've Referred
                  </div>
                  {hasRegistration && totalReferrals > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-primary"
                    >
                      {totalReferrals} Total
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasRegistration ? (
                  referredUsers.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">
                        No referrals yet. Start sharing!
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Share your referral code to see referred users here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      <div className="text-sm text-muted-foreground mb-3">
                        Referred Users:
                      </div>
                      {referredUsers.map((user, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{user.fullName}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Complete registration to start referring others.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Section - Full Width at Bottom */}
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-center">
                  <Trophy className="h-6 w-6 mr-3 text-primary" />
                  Top 10 Referrers Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-muted-foreground text-center">
                    No referrals yet. Be the first!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((referrer, index) => (
                      <div
                        key={referrer.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors border-l-4 border-l-transparent hover:border-l-primary/50"
                      >
                        <div className="flex items-center gap-4">
                          {/* Ranking Icon */}
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                            <span className="text-xl font-bold">
                              {index === 0 ? (
                                <span className="text-yellow-500">🏆</span>
                              ) : index === 1 ? (
                                <span className="text-gray-400">🥈</span>
                              ) : index === 2 ? (
                                <span className="text-amber-600">🥉</span>
                              ) : (
                                <span className="text-primary font-bold">
                                  #{index + 1}
                                </span>
                              )}
                            </span>
                          </div>

                          {/* User Info */}
                          <div>
                            <p className="font-semibold text-lg">
                              {referrer.fullName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {referrer.institution ||
                                "Institution not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Referral Count */}
                        <div className="text-right">
                          <span className="text-2xl font-bold text-primary">
                            {referrer.count}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            referral{referrer.count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Refer;
