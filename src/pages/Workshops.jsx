import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  BookOpen,
  Clock,
  User,
  Github,
  ExternalLink,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

let workshopsData = [
  {
    id: 1,
    title: "Quantum Computing Basics",
    description:
      "Introduction to quantum computing concepts, qubits, and quantum gates.",
    author: "Dr. Jayadeep",
    duration: "2h",
    difficulty: "Beginner",
    category: "Foundations",
    topics: ["Qubits", "Quantum Gates", "Superposition", "Entanglement"],
    colab: "#",
    github: "#",
  },
  {
    id: 2,
    title: "Quantum Sensing Principles",
    description: "Learn the basics of quantum sensors and their applications.",
    author: "Dr. Ravi",
    duration: "2h",
    difficulty: "Beginner",
    category: "Foundations",
    topics: ["Quantum Sensors", "Measurement", "Applications"],
    colab: "#",
    github: "#",
  },
  {
    id: 3,
    title: "Quantum Cryptography Fundamentals",
    description: "Understand quantum cryptography and secure communication.",
    author: "Dr. Shyam",
    duration: "2h",
    difficulty: "Intermediate",
    category: "Protocols",
    topics: ["QKD", "Quantum Encryption", "Protocols"],
    colab: "#",
    github: "#",
  },
  {
    id: 4,
    title: "Quantum Computing Workshop",
    description: "Hands-on exercises with quantum algorithms and circuits.",
    author: "Dr. Pavan",
    duration: "3h",
    difficulty: "Advanced",
    category: "Algorithms",
    topics: ["Algorithms", "Circuit Design", "Qiskit"],
    colab: "#",
    github: "#",
  },
  {
    id: 5,
    title: "Pre-hackathon Workshops & Mentorship",
    description:
      "Guided mentorship sessions to prepare for the hackathon challenges.",
    author: "Mentors Team",
    duration: "4h",
    difficulty: "All Levels",
    category: "Mentorship",
    topics: ["Problem Solving", "Quantum Projects", "Teamwork"],
    colab: "#",
    github: "#",
  },
];
workshopsData = [];

const getDifficultyColor = (difficulty) => {
  const mapping = {
    Beginner: "secondary",
    Intermediate: "default",
    Advanced: "destructive",
    "All Levels": "default",
  };
  return mapping[difficulty] || "default";
};

const getDifficultyStars = (difficulty) => {
  const stars = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
    "All Levels": 2,
  };
  return stars[difficulty] || 1;
};

const Workshops = () => {
  return (
    <>
      <Helmet>
        <title>Quantum Computing Workshops | Qiskit Fall Fest 2025 at IIIT Srikakulam</title>
        <meta name="description" content="Join quantum computing workshops at Qiskit Fall Fest 2025. Learn Qiskit, quantum technology, and quantum research through interactive sessions in India." />
        <meta name="keywords" content="quantum computing workshops, Qiskit tutorials, quantum technology education, quantum computing for beginners, quantum research India, IIIT Srikakulam workshops" />
        <link rel="canonical" href="https://quantum.rgukt.in/workshops" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background"
      >
      {/* Header */}
      <section className="hero-gradient py-20 lg:py-24 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
            Quantum Computing Workshops & <span className="text-gradient">Notebooks</span>
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed mb-8">
            Hands-on quantum technology education and Qiskit tutorials at IIIT Srikakulam.
            Hands-on learning experiences with guided Jupyter notebooks and interactive workshops.
          </p>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {workshopsData.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="flex flex-col h-full bg-gradient-to-br from-purple-800/20 to-indigo-800/20 border border-white/10 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                  {/* Card Header */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-700/30 to-indigo-600/30 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={getDifficultyColor(workshop.difficulty)}
                        className="font-medium px-3 py-1 text-sm"
                      >
                        {workshop.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 flex">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < getDifficultyStars(workshop.difficulty)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {workshop.title}
                      </h3>
                      <p className="text-xs text-gray-300 mt-1">
                        {workshop.category}
                      </p>
                    </div>
                  </div>

                  {/* Card Content */}
                  <CardContent className="flex flex-col flex-1 p-6">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workshop.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {workshop.author}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                      {workshop.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {workshop.topics.slice(0, 3).map((topic, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          {topic}
                        </Badge>
                      ))}
                      {workshop.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs px-2 py-1">
                          +{workshop.topics.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <a
                        href={workshop.colab}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          className="w-full text-primary-foreground"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in Colab
                        </Button>
                      </a>
                      <a
                        href={workshop.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <h1 className="text-3xl text-center text-bold">coming soon</h1>
      </motion.div>
    </>
  );
};

export default Workshops;
