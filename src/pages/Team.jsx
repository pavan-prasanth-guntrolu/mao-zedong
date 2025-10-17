import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Linkedin, Instagram } from "lucide-react";
import teamMembers from "@/data/latest-team.json";

const Team = () => {
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
              Our <span className="text-gradient">Team</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated organizers, designers, developers, and mentors who make
              Qiskit Fall Fest 2025 at RGUKT Srikakulam an unforgettable experience.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {teamMembers.map((member, index) => {
              const initials = member.name
                .split(" ")
                .filter(Boolean)
                .map((part) => part[0])
                .join("")
                .toUpperCase();

              return (
                <motion.div
                  key={member.id || `${member.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="glass-card border border-white/10 h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                        <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-32 h-32 rounded-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-3xl font-bold text-primary">
                                {initials || "T"}
                              </span>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-semibold mb-1">
                            {member.name}
                          </h3>
                          {member.role && (
                            <p className="text-primary font-medium mb-1">
                              {member.role}
                            </p>
                          )}
                          {member.study && (
                            <p className="text-muted-foreground text-sm mb-4">
                              {member.study}
                            </p>
                          )}

                          <div className="mt-auto flex gap-3">
                            <a
                              href={
                                member.linkedin
                                  ? `https://www.linkedin.com/in/${member.linkedin}`
                                  : undefined
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition ${
                                member.linkedin ? "" : "opacity-50 cursor-not-allowed"
                              }`}
                              aria-disabled={!member.linkedin}
                              onClick={(event) => {
                                if (!member.linkedin) event.preventDefault();
                              }}
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                              href={
                                member.instagram
                                  ? `https://www.instagram.com/${member.instagram}`
                                  : undefined
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition ${
                                member.instagram ? "" : "opacity-50 cursor-not-allowed"
                              }`}
                              aria-disabled={!member.instagram}
                              onClick={(event) => {
                                if (!member.instagram) event.preventDefault();
                              }}
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>

                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">
                          {member.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {member.role && member.study && (
                          <div className="flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Role:</span> {member.role}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Department:</span> {member.study}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          {member.linkedin && (
                            <a
                              href={`https://www.linkedin.com/in/${member.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                            >
                              <Linkedin className="w-5 h-5" />
                              <span className="sr-only">LinkedIn</span>
                            </a>
                          )}
                          {member.instagram && (
                            <a
                              href={`https://www.instagram.com/${member.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition"
                            >
                              <Instagram className="w-5 h-5" />
                              <span className="sr-only">Instagram</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Team;
