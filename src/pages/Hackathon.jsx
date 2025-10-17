import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Clock,
  Target,
  Award,
  Code,
  Lightbulb,
  Rocket,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Hackathon = () => {
  const [selectedTrack, setSelectedTrack] = useState(null);

  let tracks = [
    {
      id: "algorithms",
      title: "Quantum Algorithms",
      description:
        "Develop novel quantum algorithms or improve existing ones for specific problem domains.",
      icon: Code,
      color: "from-blue-500 to-purple-600",
      examples: [
        "Implement variational quantum algorithms (VQE, QAOA)",
        "Create quantum machine learning models",
        "Design quantum optimization solutions",
        "Build quantum simulation algorithms",
      ],
      difficulty: "Intermediate to Advanced",
      teamSize: "2-4 members",
    },
    {
      id: "applications",
      title: "Quantum Applications",
      description:
        "Create practical applications that demonstrate quantum advantage in real-world scenarios.",
      icon: Lightbulb,
      color: "from-green-500 to-teal-600",
      examples: [
        "Quantum finance applications (portfolio optimization)",
        "Drug discovery and molecular simulation",
        "Supply chain optimization",
        "Quantum cryptography implementations",
      ],
      difficulty: "Beginner to Intermediate",
      teamSize: "3-5 members",
    },
    {
      id: "education",
      title: "Quantum Education",
      description:
        "Build tools, games, or platforms that make quantum computing more accessible to learners.",
      icon: Users,
      color: "from-orange-500 to-red-600",
      examples: [
        "Interactive quantum circuit visualizers",
        "Quantum computing games and simulations",
        "Educational web applications",
        "Virtual quantum lab environments",
      ],
      difficulty: "Beginner to Advanced",
      teamSize: "2-6 members",
    },
    {
      id: "hardware",
      title: "Quantum Hardware",
      description:
        "Focus on quantum hardware control, calibration, or novel quantum computing architectures.",
      icon: Rocket,
      color: "from-purple-500 to-pink-600",
      examples: [
        "Quantum error correction implementations",
        "Pulse-level quantum control",
        "Quantum device characterization tools",
        "Novel quantum computing architectures",
      ],
      difficulty: "Advanced",
      teamSize: "2-4 members",
    },
  ];

  tracks = [];

  let timeline = [
    {
      time: "Day 1 - 10:30 AM",
      title: "Team Formation",
      description:
        "Meet fellow participants and form teams based on interests and skills",
    },
    {
      time: "Day 1 - 12:00 PM",
      title: "Hackathon Kickoff",
      description:
        "Official launch with track explanations and initial brainstorming",
    },
    {
      time: "Day 2 - All Day",
      title: "Development Phase",
      description: "Intensive coding, building, and mentorship sessions",
    },
    {
      time: "Day 3 - 1:00 PM",
      title: "Presentations",
      description:
        "Teams present their projects to judges and attendees (5 min per team)",
    },
    {
      time: "Day 3 - 3:00 PM",
      title: "Judging & Awards",
      description: "Final evaluation and recognition ceremony",
    },
  ];

  timeline = [];

  let prizes = [
    {
      position: "1st Place",
      prize: "₹25,000 + IBM Quantum Merchandise",
      description: "Overall best quantum project across all tracks",
    },
    {
      position: "2nd Place",
      prize: "₹15,000 + Qiskit Swag Kit",
      description: "Runner-up with exceptional innovation",
    },
    {
      position: "3rd Place",
      prize: "₹10,000 + Learning Resources",
      description: "Outstanding technical implementation",
    },
    {
      position: "Best Beginner Team",
      prize: "₹5,000 + Mentorship Program",
      description: "Most promising newcomers to quantum computing",
    },
  ];

  prizes = [];

  const rules = [
    "Teams must consist of 2-6 members from academic institutions",
    "All code must be written during the hackathon period",
    "Projects must use Qiskit as the primary quantum computing framework",
    "Teams must submit code repository, documentation, and presentation",
    "All submissions must be original work created during the event",
    "Use of pre-existing libraries and APIs is allowed and encouraged",
    "Final presentations are limited to 5 minutes + 2 minutes Q&A",
    "Judges' decisions are final and binding",
  ];

  const JudgingRubricModal = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Info className="w-4 h-4 mr-2" />
          View Judging Rubric
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Judging Rubric</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Projects will be evaluated based on the following criteria, each
            worth 25% of the total score:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Originality (25%)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Novelty of the idea, creative approach to problem-solving, and
                  innovation in quantum computing applications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Technical Merit (25%)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Code quality, proper use of Qiskit, implementation complexity,
                  and technical soundness.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Usefulness/Reproducibility (25%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Practical value, clear documentation, ease of reproduction,
                  and potential real-world impact.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Presentation (25%)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clarity of explanation, demo quality, team communication, and
                  ability to convey the project's value.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-white/20 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium">
                48-Hour Quantum Challenge
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              <span className="text-gradient">Hackathon</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8">
              Build the future of quantum computing in an intense, collaborative
              48-hour challenge
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="glass-card p-4 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-primary">-</div>
                <div className="text-sm text-muted-foreground">Duration</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-primary">-</div>
                <div className="text-sm text-muted-foreground">Tracks</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-primary">-</div>
                <div className="text-sm text-muted-foreground">Prize Pool</div>
              </div>
              <div className="glass-card p-4 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-primary">-</div>
                <div className="text-sm text-muted-foreground">Team Size</div>
              </div>
            </div>

            {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button className=" text-primary-foreground px-8 py-3">
                Register Your Team
              </Button>
              <JudgingRubricModal />
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-6">
              Choose Your Track
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four distinct tracks designed to challenge different aspects of
              quantum computing innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {tracks.map((track, index) => {
              const Icon = track.icon;
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="glass-card border border-white/10 h-full overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${track.color}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${track.color} bg-opacity-10`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {track.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {track.teamSize}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {track.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {track.description}
                      </p>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">
                          Example Projects:
                        </h4>
                        <ul className="space-y-1">
                          {track.examples.slice(0, 2).map((example, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start"
                            >
                              <div className="w-1 h-1 rounded-full bg-primary mt-2 mr-2 flex-shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTrack(track)}
                          className="p-0 h-auto font-medium text-primary hover:text-primary-hover"
                        >
                          View all examples →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-4">
                Hackathon Timeline
              </h2>
              <p className="text-lg text-muted-foreground">
                48 hours of intensive development and collaboration
              </p>
            </div>

            <div className="space-y-6">
              {timeline.map((event, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 glass-card p-6 rounded-xl border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge variant="outline" className="w-fit">
                        {event.time}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-6">
              Prizes & Recognition
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compete for exciting prizes and recognition in the quantum
              computing community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {prizes.map((prize, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card border border-white/10 text-center h-full">
                  <CardHeader>
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Award className="w-8 h-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">{prize.position}</CardTitle>
                    <div className="text-2xl font-bold text-primary">
                      {prize.prize}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {prize.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold font-poppins mb-4">
                Rules & Guidelines
              </h2>
              <p className="text-lg text-muted-foreground">
                Please read and follow these guidelines for fair competition
              </p>
            </div>

            <Card className="glass-card border border-white/10">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"></div>

                <div className="text-center mt-8 pt-6 border-t border-border"></div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Track Details Modal */}
      {selectedTrack && (
        <Dialog
          open={!!selectedTrack}
          onOpenChange={() => setSelectedTrack(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <selectedTrack.icon className="w-6 h-6 mr-2 text-primary" />
                {selectedTrack.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {selectedTrack.description}
              </p>

              <div>
                <h4 className="font-semibold mb-2">Example Project Ideas:</h4>
                <ul className="space-y-2">
                  {selectedTrack.examples.map((example, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-start"
                    >
                      <div className="w-1 h-1 rounded-full bg-primary mt-2 mr-2 flex-shrink-0" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <Badge variant="outline">
                  Team Size: {selectedTrack.teamSize}
                </Badge>
                <Badge variant="secondary">
                  Difficulty: {selectedTrack.difficulty}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default Hackathon;
