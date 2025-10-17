import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Users, Rocket, ArrowRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import sponsorsData from "@/data/sponsors.json";

const Sponsors = () => {
  const tierOrder = { title: 0, platinum: 1, gold: 2, silver: 3, community: 4 };
  const groupedSponsors = sponsorsData.reduce((acc, sponsor) => {
    if (!acc[sponsor.tier]) acc[sponsor.tier] = [];
    acc[sponsor.tier].push(sponsor);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              Our <span className="text-gradient">Sponsors</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Powered by leading organizations in quantum computing and
              technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {Object.entries(groupedSponsors)
            .sort(([a], [b]) => tierOrder[a] - tierOrder[b])
            .map(([tier, sponsors]) => (
              <motion.div
                key={tier}
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-2xl font-bold text-center mb-8 capitalize">
                  {tier} Sponsors
                </h2>
                <div
                  className={`grid gap-6 justify-items-center ${
                    tier === "title"
                      ? "grid-cols-1 max-w-md mx-auto"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
                  }`}
                >
                  {sponsors.map((sponsor, index) => (
                    <motion.div
                      key={sponsor.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="glass-card border border-white/10 h-full hover:border-primary/50 transition-colors">
                          <CardContent className="p-6 text-center">
                            <div className="h-16 flex items-center justify-center mb-4 bg-white rounded-lg">
                              <span className="font-bold text-primary">
                                <img src={sponsor.logo} alt="" />
                              </span>
                            </div>
                            <h3 className="font-semibold mb-2">
                              {sponsor.name}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {sponsor.description}
                            </p>
                          </CardContent>
                        </Card>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

          {/* Become a Sponsor CTA */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Card className="relative overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 via-background/95 to-secondary/10 backdrop-blur">
              <CardContent className="p-10">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.35),_transparent),_radial-gradient(circle_at_bottom,_rgba(192,132,252,0.25),_transparent)]" />
                </div>

                <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] items-center">
                  <motion.div
                    className="space-y-6 text-center lg:text-left"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                      <Sparkles className="h-4 w-4" />
                      Exclusive Partnership Opportunity
                    </div>
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Become a Sponsor
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        Support Qiskit Fall Fest 2025 and align your brand with
                        the brightest minds in the quantum ecosystem. Amplify
                        your impact among 23,000+ students, researchers, and
                        industry leaders.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="p-4 rounded-xl bg-background/80 border border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 text-primary font-semibold">
                          <Users className="h-5 w-5" />
                          Audience Reach
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Engage with a curated community of passionate
                          innovators and technologists.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-background/80 border border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 text-primary font-semibold">
                          <Rocket className="h-5 w-5" />
                          Brand Elevation
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Showcase your commitment to the future of quantum
                          technology and education.
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-background/80 border border-white/10 shadow-sm">
                        <div className="flex items-center gap-3 text-primary font-semibold">
                          <Sparkles className="h-5 w-5" />
                          Custom Experiences
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Tailored sponsorship tiers to maximize your engagement
                          and visibility.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative space-y-4 text-center"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="p-6 rounded-2xl bg-background/80 border border-primary/20 shadow-xl">
                      <p className="text-muted-foreground text-sm mb-4">
                        Download our detailed sponsor brochure to explore
                        benefits, tiers, and customized collaboration options.
                      </p>
                      <div className="grid gap-3">
                        <Button
                          asChild
                          size="lg"
                          className="
    btn-quantum h-14 text-base font-semibold rounded-full
    shadow-lg shadow-primary/30 hover:shadow-primary/50
    transition-all
    relative overflow-hidden
    text-white hover:text-white
  "
                        >
                          <Link
                            to="/sponsorship-form"
                            className="flex items-center justify-center gap-2"
                          >
                            {/* Keep content above any ::before overlays */}
                            <span className="relative z-10 flex items-center gap-2">
                              Apply to Become a Sponsor
                              <ArrowRight className="h-5 w-5" />
                            </span>
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          size="lg"
                          asChild
                          className="h-14 text-base font-semibold rounded-full border-primary/60 text-primary hover:bg-primary/15 hover:text-primary-foreground transition-all"
                        >
                          <a
                            href="https://drive.google.com/file/d/1WhSm2RejgzMJTuQrj0xJSBdGUl17PZxT/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <FileText className="h-5 w-5" />
                            View Sponsor&apos;s Brochure
                          </a>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Sponsors;
