import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import teamData from "@/data/team.json";

const Organizers = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-background">
      <section className="hero-gradient py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="max-w-4xl mx-auto text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              Meet the <span className="text-gradient">Organizers</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Passionate students bringing quantum computing to IIIT Srikakulam
            </p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teamData.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card border border-white/10 h-full">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <div className="text-sm text-muted-foreground mb-3">
                      <p>{member.year} • {member.branch}</p>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
                    <div className="flex space-x-3">
                      <a href={`https://linkedin.com/in/${member.linkedin}`} className="text-muted-foreground hover:text-primary">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href={`https://github.com/${member.github}`} className="text-muted-foreground hover:text-primary">
                        <Github className="w-4 h-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Organizers;