import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Helmet } from "react-helmet-async";
import {
  Calendar,
  Users,
  BookOpen,
  Trophy,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import CountdownTimer from "@/components/CountdownTimer";
import Cat_01 from "../../Graphics/Emojis/Cat_01.png";
import centuryImg from "../../Graphics/Emojis/Text_Theme_01.png";

// Lazy load the 3D component for better performance
const Hero3D = lazy(() => import("@/components/Hero3D"));

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: "Quantum Computing Workshops",
      description:
        "Learn Qiskit through interactive quantum computing workshops led by experts in India.",
      link: "/workshops",
    },
    {
      icon: Users,
      title: "Quantum Technology Speakers",
      description:
        "Hear from leading researchers and practitioners in quantum science and AI.",
      link: "/speakers",
    },
    {
      icon: Trophy,
      title: "Quantum Hackathon",
      description:
        "Build quantum applications and compete for prizes in quantum innovation.",
      link: "/hackathon",
    },
    {
      icon: Calendar,
      title: "Quantum Learning Schedule",
      description:
        "Follow a curated schedule for quantum computing tutorials and research.",
      link: "/schedule",
    },
  ];

  const stats = [
    { label: "Days of Learning", value: "7" },
    { label: "Expert Speakers", value: "10+" },
    { label: "Hands-on Workshops", value: "10+" },
    { label: "Quantum Notebooks", value: "15" },
  ];

  return (
    <>
      <Helmet>
        <title>
          Qiskit Fall Fest 2025 — Quantum Computing Event at IIIT Srikakulam
        </title>
        <meta
          name="description"
          content="Join Qiskit Fall Fest 2025 at IIIT Srikakulam for hands-on quantum computing workshops, hackathon, and expert speakers. Learn quantum technology, Qiskit, and quantum research in India."
        />
        <meta
          name="keywords"
          content="Qiskit Fall Fest 2025, quantum computing, quantum technology, quantum research India, quantum AI, quantum cryptography, quantum innovation, IIIT Srikakulam, hackathon, workshops, quantum computing tutorials, quantum science, quantum physics, quantum computing for beginners"
        />
        <link rel="canonical" href="https://quantum.rgukt.in/" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-0"
      >
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
          {/* 3D Background */}
          <div className="absolute inset-0 z-0">
            <Suspense fallback={<LoadingSpinner />}>
              <Hero3D />
            </Suspense>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Event Badge */}
                {/* <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-white/20 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-sm font-medium text-primary">
                  Global Quantum Computing Event Series
                </span>
              </motion.div> */}

                <img
                  src={centuryImg}
                  className="h-9 text-center ml-auto mr-auto"
                />
                <br />
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
                  <span className="block text-foreground">
                    <span className="text-custom">Qiskit</span> Fall Fest 2025
                  </span>
                  <span className="block text-gradient mt-2">
                    RGUKT Srikakulam, India
                  </span>
                </h1>
                <h1 className="text-1xl sm:text-2xl lg:text-3xl font-bold font-poppins mb-4">
                  <span className="block text-foreground">
                    21<sup>st</sup> - 27<sup>th</sup> October 2025
                  </span>
                </h1>

                {/* Countdown Timer */}
                <div className="mb-8">
                  <motion.h2
                    className="text-lg text-muted-foreground mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="inline-block bg-gradient-to-r from-primary/30 to-secondary/30 text-primary px-4 py-1.5 rounded-full font-semibold shadow-sm">
                      Event Starts In
                    </span>
                  </motion.h2>
                  <CountdownTimer targetDate="2025-10-21T00:00:00" />
                </div>

                {/* Tagline */}
                <p className="text-xl sm:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  {/* Celebrating 100Year's of Quantum Technology. */}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  {
                    <Link to="/register">
                      <Button
                        size="lg"
                        className="btn-quantum text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow"
                      >
                        <span className="relative z-10">Register Now</span>
                        <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
                      </Button>
                    </Link>
                  }
                  <Link to="/schedule">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg font-semibold rounded-lg glass-card border border-white/20 hover:border-primary/50 shadow-lg relative group"
                    >
                      <span className="relative z-10 bg-gradient-to-r from-quantum-blue to-quantum-purple bg-clip-text text-transparent">
                        View Schedule
                      </span>
                      <span className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity"></span>
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center glass-card p-4 rounded-xl border "
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* About Section */}
        <section className="py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-6">
                <img
                  src={Cat_01}
                  alt="Qiskit Logo"
                  className="inline-block h-8 w-auto ml-2"
                  width={60}
                  height={60}
                />{" "}
                About Qiskit Fall Fest{" "}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Qiskit Fall Fest is a global student-run series of quantum
                computing events supported by IBM Quantum. RGUKT Srikakulam's
                edition brings hands-on workshops, guided Jupyter notebooks, and
                a campus hackathon to help students build practical Qiskit
                skills.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Link to={feature.link}>
                      <Card className="glass-card border border-white/10 hover:border-primary/30 transition-all duration-300 h-full group cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <motion.div
                            className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
                            whileHover={{ scale: 1.1 }}
                          >
                            <Icon className="h-6 w-6 text-primary" />
                          </motion.div>
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-8">
                Ready to Dive into Quantum Computing?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Join us for an immersive experience in quantum computing. From
                beginners to advanced practitioners, there's something for
                everyone.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {!user && (
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="btn-quantum text-primary-foreground px-8 py-4 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow"
                    >
                      <span className="relative z-10">Secure Your Spot</span>
                      <ArrowRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
                    </Button>
                  </Link>
                )}
                <a
                  href="https://qiskit.org/textbook/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold hover:bg-[#1e1e1e] hover:text-primary transition-colors glass-card border rounded-lg"
                  >
                    Explore Qiskit Textbook
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Visit Us Section */}
        <section className="py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-5xl mx-auto glass-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-primary/10 via-background to-background">
                  <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">
                    Visit Us
                  </p>
                  <h2 className="text-3xl lg:text-4xl font-bold font-poppins text-foreground mb-4">
                    Experience Qiskit Fall Fest on Campus
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Join us at the RGUKT Srikakulam campus for an unforgettable
                    week of quantum computing workshops, talks, and hands-on
                    learning.
                  </p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        Location
                      </span>
                      RGUKT IIIT Srikakulam, Etcherla, Andhra Pradesh 532402,
                      India.
                    </p>
                    <p className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        Need Directions?
                      </span>
                      Tap the map to open Google Maps and plan your visit.
                    </p>
                  </div>
                  <div className="mt-8">
                    <Link
                      to="https://www.google.com/maps/dir//7RPG%2BXM5+IIIT+Srikakulam,+Shermuhammadpuram,+Andhra+Pradesh+532402/@18.2915979,83.8161318,13520m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3a3c13005daa117b:0xd2114a91cfba13c8!2m2!1d83.8267367!2d18.2873968?entry=ttu&g_ep=EgoyMDI1MTAwOC4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="lg"
                        className="
      relative overflow-hidden 
      px-6 py-3 text-base font-semibold
      bg-gradient-to-r from-[#4F46E5] to-[#9333EA]
      text-white
      rounded-lg
      transition-all duration-300
      hover:from-[#9333EA] hover:to-[#4F46E5]
      hover:shadow-[0_0_20px_rgba(147,51,234,0.5)]
    "
                      >
                        <span className="relative z-10 flex items-center">
                          Get Directions
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="relative h-[320px] lg:h-full">
                  <iframe
                    title="RGUKT Srikakulam Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1392.4391814017545!2d83.82543251279886!3d18.288390024055417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3c13503f331c41%3A0xb4212620d053a81f!2sRGUKT%20IIIT%20SKLM!5e0!3m2!1sen!2sin!4v1758213264317!5m2!1sen!2sin"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default Home;
