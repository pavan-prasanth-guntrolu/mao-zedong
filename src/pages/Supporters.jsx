import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Twitter, Linkedin, Instagram, Calendar } from "lucide-react";
import SupportorsData from "@/data/supporters.json";

// Explicit role mapping (singular & plural covered)
const roleMap = {
  "Chief Patron": ["chief patron", "chief patrons"],
  Patron: ["patron", "patrons"],
  Convenor: ["convenor", "convenors"],
  "Co-Convenor": ["co-convenor", "co-convenors"],
};

const Supportors = () => {
  // Group supporters into sections
  const groupedSupportors = Object.entries(roleMap).map(
    ([section, keywords]) => ({
      section,
      members: SupportorsData.filter((s) =>
        keywords.some((kw) =>
          (s.role || "").split(";")[0].toLowerCase().trim().startsWith(kw)
        )
      ),
    })
  );

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
              Our <span className="text-gradient">Supporters</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {groupedSupportors.map(
            (group) =>
              group.members.length > 0 && (
                <div key={group.section} className="mb-16">
                  {/* Section Heading */}
                  <h2 className="text-3xl font-bold text-center mb-10 text-gradient">
                    {group.section}
                  </h2>

                  {/* Grid for members */}
                  <div
                    className="grid gap-6 lg:gap-8 justify-items-center 
                grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
                  >
                    {group.members.map((supportor, index) => (
                      <motion.div
                        key={supportor.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                        className="w-full max-w-sm"
                      >
                        <Dialog>
                          <DialogTrigger asChild>
                            <Card className="glass-card border border-white/10 h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                              <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                {supportor.image ? (
                                  <img
                                    src={supportor.image}
                                    alt={supportor.name}
                                    className="w-52 h-52 rounded-full object-cover border-4 border-white/20 shadow-md"
                                  />
                                ) : (
                                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-3xl font-bold text-primary">
                                      {supportor.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <CardContent className="p-6 flex flex-col flex-1 text-center">
                                <h3 className="text-xl font-semibold mb-1">
                                  {supportor.name}
                                </h3>

                                {supportor.role.split(";").map((line, i) => (
                                  <p
                                    key={i}
                                    className={`${
                                      i === 0
                                        ? "text-primary font-medium mb-1"
                                        : "text-muted-foreground text-sm mb-1"
                                    }`}
                                  >
                                    {line.trim()}
                                  </p>
                                ))}

                                <p className="text-muted-foreground text-sm mb-4">
                                  {supportor.company}
                                </p>
                                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                                  {supportor.bio}
                                </p>

                                <div className="mt-4 flex gap-3 justify-center">
                                  {/* Social links */}
                                  <a
                                    href={
                                      supportor.twitter
                                        ? `https://twitter.com/${supportor.twitter.replace(
                                            "@",
                                            ""
                                          )}`
                                        : "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition ${
                                      !supportor.twitter
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                  >
                                    <Twitter className="w-4 h-4" />
                                  </a>
                                  <a
                                    href={
                                      supportor.linkedin
                                        ? `https://linkedin.com/in/${supportor.linkedin}`
                                        : "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition ${
                                      !supportor.linkedin
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                  >
                                    <Linkedin className="w-4 h-4" />
                                  </a>
                                  <a
                                    href={
                                      supportor.instagram
                                        ? `https://instagram.com/${supportor.instagram}`
                                        : "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition ${
                                      !supportor.instagram
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                  >
                                    <Instagram className="w-4 h-4" />
                                  </a>
                                </div>
                              </CardContent>
                            </Card>
                          </DialogTrigger>

                          {/* Dialog Content */}
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl">
                                {supportor.name}
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-2xl font-bold text-primary">
                                    {supportor.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold">
                                    {supportor.title}
                                  </h3>
                                  <p className="text-primary font-medium">
                                    {supportor.company}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">About</h4>
                                <p className="text-muted-foreground leading-relaxed">
                                  {supportor.bio}
                                </p>
                              </div>

                              {supportor.talk && (
                                <div className="border-t border-border pt-6">
                                  <h4 className="font-semibold mb-2">
                                    Talk: {supportor.talk.title}
                                  </h4>
                                  <p className="text-muted-foreground mb-4 leading-relaxed">
                                    {supportor.talk.abstract}
                                  </p>
                                  <div className="flex items-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>
                                      {supportor.talk.date} at{" "}
                                      {supportor.talk.time}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Supportors;
