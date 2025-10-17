import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Download,
  Users,
  BookOpen,
  Award,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import scheduleData from "@/data/schedule.json";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Find the event from schedule data
  const event = scheduleData
    .flatMap((day) =>
      day.sessions.map((session) => ({
        ...session,
        date: day.date,
        day: day.day,
      }))
    )
    .find((session) => session.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Button onClick={() => navigate("/schedule")}>
            Back to Schedule
          </Button>
        </div>
      </div>
    );
  }

  const generateICS = () => {
    const formatDate = (dateStr, timeStr) => {
      const [startTime] = timeStr.split(" - ");
      const [time, period] = startTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;

      const sessionDate = new Date(
        `${dateStr}T${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:00`
      );
      return sessionDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const startDate = formatDate(event.date, event.time);
    const endDate =
      new Date(new Date(startDate.replace("Z", "")).getTime() + 60 * 60 * 1000)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0] + "Z";

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Qiskit Fall Fest//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${event.id}@qiskit-fall-fest-iiits.com
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}${
      event.speaker ? "\\nSpeaker: " + event.speaker : ""
    }
LOCATION:${event.location || "IIIT Srikakulam"}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSessionTypeColor = (type) => {
    const colors = {
      keynote: "destructive",
      workshop: "default",
      tutorial: "secondary",
      hackathon: "outline",
      ceremony: "secondary",
      break: "outline",
      presentation: "default",
    };
    return colors[type] || "default";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <section className="hero-gradient py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/schedule")}
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schedule
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant={getSessionTypeColor(event.type)}
                    className="text-sm"
                  >
                    {event.type}
                  </Badge>
                  <span className="text-muted-foreground">
                    {event.day} •{" "}
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold font-poppins mb-4">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {event.time}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      {event.location}
                    </div>
                  )}
                  {event.speaker && (
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {event.speaker}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="btn-quantum">Register Now</Button>
                <Button variant="outline" onClick={generateICS}>
                  <Download className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <Card className="glass-card border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Event Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {event.description}
                    </p>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <h4 className="font-semibold">What You'll Learn:</h4>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>
                          Fundamentals of quantum computing and Qiskit framework
                        </li>
                        <li>
                          Hands-on experience with quantum circuits and
                          algorithms
                        </li>
                        <li>
                          Practical applications in quantum machine learning
                        </li>
                        <li>
                          Industry best practices and optimization techniques
                        </li>
                      </ul>
                    </div>

                    {event.type === "workshop" && (
                      <>
                        <Separator className="my-6" />
                        <div className="space-y-4">
                          <h4 className="font-semibold">Prerequisites:</h4>
                          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Basic Python programming knowledge</li>
                            <li>Linear algebra fundamentals</li>
                            <li>Jupyter notebook familiarity</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {event.speaker && (
                  <Card className="glass-card border border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Speaker Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {event.speaker}
                          </h4>
                          <p className="text-muted-foreground">
                            Quantum Computing Expert
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Experienced researcher and practitioner in quantum
                        computing with expertise in Qiskit and quantum
                        algorithms.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="glass-card border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Event Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-1">Date & Time</h5>
                      <p className="text-muted-foreground text-sm">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {event.time}
                      </p>
                    </div>

                    {event.location && (
                      <div>
                        <h5 className="font-medium mb-1">Location</h5>
                        <p className="text-muted-foreground text-sm">
                          {event.location}
                        </p>
                      </div>
                    )}

                    <div>
                      <h5 className="font-medium mb-1">Event Type</h5>
                      <Badge
                        variant={getSessionTypeColor(event.type)}
                        className="capitalize"
                      >
                        {event.type}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-center">
                        <Users className="w-4 h-4 mr-2 text-primary" />
                        Networking opportunities
                      </li>
                      <li className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-primary" />
                        Learning materials
                      </li>
                      <li className="flex items-center">
                        <Award className="w-4 h-4 mr-2 text-primary" />
                        Certificate of participation
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button className="btn-quantum w-full">
                    Register for Event
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={generateICS}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button variant="ghost" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share Event
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default EventDetail;
