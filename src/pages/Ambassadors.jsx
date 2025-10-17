import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Trophy,
  Medal,
  Crown,
  Users,
  Star,
  Share2,
  ArrowRight,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { supabase } from "@/lib/supabase";

import Cat_01 from "../../Graphics/Emojis/Cat_01.png";

const REG_INSTITUTION_COL = "institution"; // <-- change if your registrations table uses a different column name

const Ambassadors = () => {
  const [ambassadors, setAmbassadors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAmbassadorLeaderboard();
  }, []);

  const fetchAmbassadorLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) Get approved ambassadors
      const { data: ambassadorData, error: ambassadorError } = await supabase
        .from("ambassador_applications")
        .select(
          `
          id,
          user_id,
          fullName,
          email,
          institution,
          status,
          created_at
        `
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (ambassadorError) throw ambassadorError;

      if (!ambassadorData || ambassadorData.length === 0) {
        setAmbassadors([]);
        return;
      }

      // 2) Collect unique institutions of approved ambassadors
      const institutions = Array.from(
        new Set(
          ambassadorData
            .map((a) => a.institution)
            .filter((s) => typeof s === "string" && s.trim().length > 0)
        )
      );

      if (institutions.length === 0) {
        // Ambassadors without institution info — nothing to count
        setAmbassadors(
          ambassadorData.map((amb, i) => ({
            ...amb,
            collegeCount: 0,
            rank: i + 1,
          }))
        );
        return;
      }

      // 3) Fetch registrations for these institutions and count client-side
      // (safe and simple; avoids PostgREST group-by quirks)
      const { data: regRows, error: regErr } = await supabase
        .from("registrations")
        .select(`id, ${REG_INSTITUTION_COL}`)
        .in(REG_INSTITUTION_COL, institutions);

      if (regErr) throw regErr;

      const institutionToCount = {};
      regRows?.forEach((r) => {
        const k = r[REG_INSTITUTION_COL] || "";
        if (!k) return;
        institutionToCount[k] = (institutionToCount[k] || 0) + 1;
      });

      // 4) Attach counts to ambassadors
      const withCounts = ambassadorData.map((amb) => ({
        ...amb,
        collegeCount: institutionToCount[amb.institution] || 0,
      }));

      // 5) Sort by collegeCount desc and take top 5
      const topAmbassadors = withCounts
        .sort((a, b) => b.collegeCount - a.collegeCount)
        .slice(0, 1)
        .map((amb, index) => ({ ...amb, rank: index + 1 }));

      setAmbassadors(topAmbassadors);
    } catch (err) {
      console.error("Error fetching ambassador leaderboard:", err);
      setError("Failed to load ambassador leaderboard");
      setAmbassadors([]);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return <Trophy className="h-6 w-6 text-primary" />;
    }
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Campus Ambassadors - Qiskit Fall Fest 2025</title>
        <meta
          name="description"
          content="Meet our top Campus Ambassadors and learn how to join the Qiskit Fall Fest 2025 Ambassador Program. Earn rewards and represent your institution!"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-4">
              <img
                src={Cat_01}
                alt="Qiskit Logo"
                className="inline-block h-10 w-auto mr-3"
              />
              Campus <span className="text-gradient">Ambassadors</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Celebrating our amazing ambassadors who are spreading quantum
              computing knowledge across institutions worldwide!
            </p>
          </motion.div>

          {/* Top 5 Leaderboard */}
          <motion.section
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-4">
                🏆 Top Ambassador Leaderboard
              </h2>
              <p className="text-lg text-muted-foreground">
                Ranked by total registrations from their college
              </p>
            </div>

            {error && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{error}</p>
                <Button
                  onClick={fetchAmbassadorLeaderboard}
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            )}

            {!error && ambassadors.length === 0 && !loading && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  No approved ambassadors yet.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ambassador applications are currently being reviewed.
                </p>
              </div>
            )}

            {!error && ambassadors.length > 0 && (
              <div className="max-w-4xl mx-auto space-y-6">
                {ambassadors.map((ambassador, index) => (
                  <motion.div
                    key={ambassador.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-all duration-300 bg-white dark:bg-gray-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          {/* Left side - Rank, Avatar, and Info */}
                          <div className="flex items-center gap-6">
                            {/* Rank with icon */}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center">
                                {getMedalIcon(ambassador.rank)}
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                  #{ambassador.rank}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Rank
                                </div>
                              </div>
                            </div>

                            {/* Avatar */}
                            <Avatar className="w-16 h-16">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  ambassador.fullName ||
                                    ambassador.institution ||
                                    ""
                                )}`}
                              />
                              <AvatarFallback className="text-lg font-semibold">
                                {getInitials(ambassador.fullName || "CA")}
                              </AvatarFallback>
                            </Avatar>

                            {/* Name and Institution */}
                            <div>
                              <h3 className="text-xl font-semibold mb-1">
                                {ambassador.fullName}
                              </h3>
                              <p className="text-sm text-muted-foreground max-w-xs">
                                {ambassador.institution}
                              </p>
                            </div>
                          </div>

                          {/* Right side - College Registration Count */}
                          <div className="text-center bg-primary/10 rounded-lg p-4 min-w-[120px]">
                            <div className="text-3xl font-bold text-primary mb-1">
                              {ambassador.collegeCount ?? 0}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Registrations
                            </div>
                            <div className="text-[11px] text-muted-foreground/80 mt-1">
                              from this college
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* How to Become Section */}
          <motion.section
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-6">
                    🚀 Become a Campus Ambassador
                  </h2>
                </div>

                <div className="max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Represent</h3>
                      <p className="text-sm text-muted-foreground">
                        Represent your institution and the Qiskit Fall Fest
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Share2 className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Promote</h3>
                      <p className="text-sm text-muted-foreground">
                        Help spread awareness and organize events
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Earn Rewards
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Get perks & swags based on your referrals
                      </p>
                    </div>
                  </div>

                  <div className="text-center bg-primary/5 rounded-lg p-6">
                    <p className="text-lg leading-relaxed mb-6">
                      <strong>
                        Join our Campus Ambassador Program and represent your
                        institution!
                      </strong>
                    </p>
                    <p className="text-muted-foreground mb-6">
                      Help spread awareness, organize events, and earn rewards
                      based on your referrals. Be part of a global community
                      bringing quantum computing education to students
                      worldwide!
                    </p>

                    <div className="space-y-4">
                      <Link to="/ambassador">
                        <Button size="lg" className="px-8 py-3">
                          Register Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>

                      <p className="text-sm text-muted-foreground">
                        Already an ambassador?{" "}
                        <Link
                          to="/refer"
                          className="text-primary hover:underline"
                        >
                          Share your referral link
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {error && (
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-yellow-600 dark:text-yellow-400">
                {error} (Showing demo data)
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Ambassadors;
