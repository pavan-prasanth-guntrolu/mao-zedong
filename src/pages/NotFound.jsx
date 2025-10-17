import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const quickLinks = [
    { name: "Home", href: "/", description: "Return to the main page" },
    { name: "About", href: "/about", description: "Learn about Qiskit Fall Fest" },
    { name: "Schedule", href: "/schedule", description: "View the event schedule" },
    { name: "Register", href: "/register", description: "Register for the event" },
    { name: "Workshops", href: "/workshops", description: "Explore quantum notebooks" },
    { name: "Hackathon", href: "/hackathon", description: "Join the quantum hackathon" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background flex items-center justify-center px-4"
    >
      <div className="max-w-2xl w-full text-center pt-28 md:pt-32">
        {/* 404 Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <motion.h1
              className="text-8xl lg:text-9xl font-bold text-primary/20 font-poppins"
              animate={{ 
                textShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(124, 58, 237, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              404
            </motion.h1>
            
            {/* Quantum particles around 404 */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            The quantum page you're looking for seems to have collapsed into a superposition state.
          </p>
          <p className="text-muted-foreground">
            Don't worry, let's get you back to the right timeline!
          </p>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/">
            <Button className="btn-quantum text-primary-foreground px-6 py-3">
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-xl font-semibold mb-6">
            Or explore these popular sections:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link to={link.href}>
                  <Card className="glass-card border border-white/10 h-full hover:border-primary/30 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {link.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <Search className="w-4 h-4 mr-2" />
            <span>Still lost? </span>
            <Link
              to="/contact"
              className="ml-1 text-primary hover:text-primary-hover transition-colors underline"
            >
              Contact our organizers
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;