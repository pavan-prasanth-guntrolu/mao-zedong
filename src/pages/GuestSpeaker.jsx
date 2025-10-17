import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  Building,
  ExternalLink,
  Star,
  Share2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const GuestSpeaker = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    shortBio: "",
    profileLink: "",
    pastExperience: "",
    talkTitle: "",
    talkAbstract: "",
    audienceLevel: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user not signed in
  if (!user) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-background px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Lock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <h1 className="text-2xl font-bold font-poppins mb-4">
            Sign In Required
          </h1>
          <p className="text-muted-foreground mb-6">
            Please sign in or create an account to apply as a Guest Speaker.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="btn-quantum text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow"
          >
            <span className="relative z-10">Go to Login</span>
            <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Auto-fill email
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "organization",
      "position",
      "shortBio",
      "talkTitle",
      "talkAbstract",
      "audienceLevel",
    ];

    const missing = requiredFields.filter((f) => !formData[f]);
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      // Prevent duplicate submissions
      const { data: existing } = await supabase
        .from("guest_speaker_applications")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        toast({
          title: "Already Applied",
          description:
            "You have already submitted your Guest Speaker proposal.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert application
      const { error } = await supabase
        .from("guest_speaker_applications")
        .insert([
          {
            user_id: user.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            organization: formData.organization,
            position: formData.position,
            short_bio: formData.shortBio,
            profile_link: formData.profileLink,
            past_experience: formData.pastExperience,
            talk_title: formData.talkTitle,
            talk_abstract: formData.talkAbstract,
            audience_level: formData.audienceLevel,
            status: "pending",
          },
        ]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description:
          "Your Guest Speaker proposal has been received. We'll review it soon 🎤",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-background px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold font-poppins mb-4">
            Application Submitted!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to be a Guest Speaker. We'll review your
            proposal and get back to you soon.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="btn-quantum text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg shadow-lg relative group"
          >
            <span className="relative z-10">Return to Home</span>
            <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Form UI
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-4">
              Apply to be a <span className="text-gradient">Guest Speaker</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your expertise at Qiskit Fall Fest and inspire the community
            </p>
          </div>

          <Card className="glass-card border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Guest Speaker Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={() => {}}
                        readOnly
                        className="bg-muted cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Affiliation Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Affiliation / Role
                  </h3>
                  <div>
                    <Label htmlFor="organization">Organization *</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) =>
                        handleInputChange("organization", e.target.value)
                      }
                      placeholder="Enter your organization"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      placeholder="Enter your position"
                      required
                    />
                  </div>
                </div>

                {/* Speaker Profile */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    Speaker Profile
                  </h3>
                  <div>
                    <Label htmlFor="shortBio">Short Bio *</Label>
                    <Textarea
                      id="shortBio"
                      value={formData.shortBio}
                      onChange={(e) =>
                        handleInputChange("shortBio", e.target.value)
                      }
                      placeholder="Write a short bio (150–200 words)"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="profileLink">Profile Link</Label>
                    <Input
                      id="profileLink"
                      value={formData.profileLink}
                      onChange={(e) =>
                        handleInputChange("profileLink", e.target.value)
                      }
                      placeholder="LinkedIn, Website, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="pastExperience">Past Experience</Label>
                    <Textarea
                      id="pastExperience"
                      value={formData.pastExperience}
                      onChange={(e) =>
                        handleInputChange("pastExperience", e.target.value)
                      }
                      placeholder="Describe your past speaking experience"
                    />
                  </div>
                </div>

                {/* Talk Proposal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-primary" />
                    Talk Proposal
                  </h3>
                  <div>
                    <Label htmlFor="talkTitle">Talk Title *</Label>
                    <Input
                      id="talkTitle"
                      value={formData.talkTitle}
                      onChange={(e) =>
                        handleInputChange("talkTitle", e.target.value)
                      }
                      placeholder="Enter the title of your talk"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="talkAbstract">Abstract *</Label>
                    <Textarea
                      id="talkAbstract"
                      value={formData.talkAbstract}
                      onChange={(e) =>
                        handleInputChange("talkAbstract", e.target.value)
                      }
                      placeholder="Write an abstract (150–300 words)"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="audienceLevel">Audience Level *</Label>
                    <Select
                      value={formData.audienceLevel}
                      onValueChange={(value) =>
                        handleInputChange("audienceLevel", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full btn-quantum text-primary-foreground py-6 text-lg font-semibold rounded-lg shadow-lg relative group"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Application
                        <Share2 className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GuestSpeaker;
