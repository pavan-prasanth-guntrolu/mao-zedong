import { motion } from "framer-motion";
import { Shield, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CodeOfConduct = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <section className="hero-gradient py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              Code of <span className="text-gradient">Conduct</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Creating a safe, inclusive, and respectful environment for all
              participants
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="glass-card border border-white/10 mb-8">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold">Zero Tolerance Policy</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We follow a zero-tolerance Code of Conduct. Respect everyone —
                harassment is not tolerated. Report incidents to
                qiskit.fallfest@rguktsklm.ac.in.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="glass-card border border-white/10">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-3">
                  Expected Behavior
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Be respectful and inclusive in all interactions</li>
                  <li>• Use welcoming and appropriate language</li>
                  <li>• Be collaborative and supportive</li>
                  <li>• Respect different viewpoints and experiences</li>
                  <li>• Focus on what is best for the community</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default CodeOfConduct;
