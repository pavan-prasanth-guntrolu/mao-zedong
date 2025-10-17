import { motion } from "framer-motion";
import { ExternalLink, Download, Github, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Materials = () => {
  const resources = [
    {
      title: "Event Repository",
      description: "Complete codebase and materials",
      icon: Github,
      link: "#",
    },
    {
      title: "Presentation Slides",
      description: "Speaker slides and workshop materials",
      icon: Download,
      link: "#",
    },
    {
      title: "Session Recordings",
      description: "Video recordings of talks and workshops",
      icon: Play,
      link: "#",
    },
    {
      title: "Qiskit Textbook",
      description: "Official Qiskit learning resource",
      icon: ExternalLink,
      link: "https://qiskit.org/textbook/",
    },
  ];

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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              Learning <span className="text-gradient">Materials</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Access slides, recordings, and additional quantum computing
              resources
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card border border-white/10 h-full">
                    <CardContent className="p-6">
                      <Icon className="h-8 w-8 text-primary mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {resource.description}
                      </p>
                      <Button className="" asChild>
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Access Resource
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Materials;
