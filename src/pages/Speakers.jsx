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
import speakersData from "@/data/speakers.json";

const Speakers = () => {
  let filteredSpeakers = speakersData;

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
              Expert <span className="text-gradient">Speakers</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Learn from leading quantum computing researchers and industry
              professionals
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:gap-8 justify-center grid-cols-[repeat(auto-fit,300px)]">
            {filteredSpeakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="glass-card border border-white/10 h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                      <div className="relative h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        {speaker.image ? (
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-48 h-48 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">
                              {speaker.name && speaker.name.trim().length > 0
                                ? speaker.name.trim().charAt(0).toUpperCase()
                                : "?"}
                            </span>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6 flex flex-col flex-1">
                        <h3 className="text-xl font-semibold mb-1">
                          {speaker.name}
                        </h3>
                        <p className="text-primary font-medium mb-1">
                          {speaker.title}
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">
                          {speaker.company}
                        </p>
                        <p className="text-muted-foreground  font-bold leading-relaxed line-clamp-3 flex-1">
                          {speaker.bio}
                        </p>

                        <div className="mt-4 flex gap-3">
                          <a
                            href={
                              speaker.twitter
                                ? `https://twitter.com/${speaker.twitter.replace(
                                    "@",
                                    ""
                                  )}`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition ${
                              !speaker.twitter
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                          <a
                            href={
                              speaker.linkedin
                                ? `https://linkedin.com/in/${speaker.linkedin}`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition ${
                              !speaker.linkedin
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                          <a
                            href={
                              speaker.instagram
                                ? `https://instagram.com/${speaker.instagram}`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition ${
                              !speaker.instagram
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

                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        {speaker.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {speaker.name && speaker.name.trim().length > 0
                              ? speaker.name.trim().charAt(0).toUpperCase()
                              : "?"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">
                            {speaker.title}
                          </h3>
                          <p className="text-primary font-medium">
                            {speaker.company}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <a
                              href={
                                speaker.twitter
                                  ? `https://twitter.com/${speaker.twitter.replace(
                                      "@",
                                      ""
                                    )}`
                                  : "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition ${
                                !speaker.twitter
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <Twitter className="w-4 h-4" />
                            </a>
                            <a
                              href={
                                speaker.linkedin
                                  ? `https://linkedin.com/in/${speaker.linkedin}`
                                  : "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition ${
                                !speaker.linkedin
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                              href={
                                speaker.instagram
                                  ? `https://instagram.com/${speaker.instagram}`
                                  : "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition ${
                                !speaker.instagram
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">About</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {speaker.bio}
                        </p>
                      </div>

                      {speaker.talk && (
                        <div className="border-t border-border pt-6">
                          <h4 className="font-semibold mb-2">
                            Talk: {speaker.talk.title}
                          </h4>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {speaker.talk.abstract}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {speaker.talk.date} at {speaker.talk.time}
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
      </section>
    </motion.div>
  );
};

export default Speakers;
