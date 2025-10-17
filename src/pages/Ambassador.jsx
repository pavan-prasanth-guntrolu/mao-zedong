import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  ExternalLink,
  Lock,
  Users,
  Star,
  Share2,
  Loader2,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

// Institute options
const instituteOptions = [
  "RGUKT Srikakulam",
  "RGUKT Nuzvid",
  "RGUKT R.K. Valley",
  "RGUKT Ongole",
  "Others",
];

const Ambassador = () => {
  // Form state matching database schema exactly
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    customInstitution: "",
    year: "",
    branch: "",
    social_media: "",
    previous_experience: "",
    quantum_knowledge: "",
    why_join: "",
    ideas_for_promotion: "",
    agreeTerms: false,
  });

  // Component state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(true);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is registered for the event
  const checkEventRegistration = async (userId) => {
    try {
      const { data: registration, error } = await supabase
        .from("registrations")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking registration:", error);
        return false;
      }

      return !!registration;
    } catch (error) {
      console.error("Error checking registration:", error);
      return false;
    }
  };

  // Check if user has already submitted an application
  const checkExistingApplication = async (userId) => {
    try {
      const { data: application, error } = await supabase
        .from("ambassador_applications")
        .select("id, status")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking existing application:", error);
        return false;
      }

      return !!application;
    } catch (error) {
      console.error("Error checking existing application:", error);
      return false;
    }
  };

  // Authentication and registration check effect
  useEffect(() => {
    const checkUserStatus = async () => {
      // Add a delay to ensure auth context is properly loaded
      const timer = setTimeout(async () => {
        setAuthLoading(false);
        
        if (user) {
          setRegistrationLoading(true);
          
          // Check both registration and existing application
          const [registered, hasApplication] = await Promise.all([
            checkEventRegistration(user.id),
            checkExistingApplication(user.id)
          ]);
          
          setIsRegistered(registered);
          setHasExistingApplication(hasApplication);
          setRegistrationLoading(false);
        }
      }, 1000);

      return () => clearTimeout(timer);
    };

    checkUserStatus();
  }, [user]);

  // Pre-fill email when user is available
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    const requiredFields = [
      "fullName",
      "email", 
      "phone",
      "institution",
      "year",
      "branch",
      "why_join",
      "ideas_for_promotion",
    ];

    if (formData.institution === "Others") requiredFields.push("customInstitution");

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions to continue.",
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

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double-check authentication
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your application.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check for existing application one more time
      const { data: existing } = await supabase
        .from("ambassador_applications")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        toast({
          title: "Already Applied",
          description: "You have already submitted an application for the Campus Ambassador program.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Insert new application - matching schema exactly
      const { error: applicationError } = await supabase
        .from("ambassador_applications")
        .insert([
          {
            user_id: user.id,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            institution: formData.institution === "Others" ? formData.customInstitution : formData.institution,
            year: formData.year,
            branch: formData.branch,
            social_media: formData.social_media,
            previous_experience: formData.previous_experience,
            quantum_knowledge: formData.quantum_knowledge,
            why_join: formData.why_join,
            ideas_for_promotion: formData.ideas_for_promotion,
            status: "pending",
            ambassador_applications: null, // This field exists in schema but seems unused
          },
        ]);

      if (applicationError) {
        throw applicationError;
      }

      setIsSubmitted(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "Your Campus Ambassador application has been received. We'll review it and get back to you soon.",
      });

    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Unauthenticated user view
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
            Please sign in or create an account to apply for the Campus Ambassador program.
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

  // Loading registration status
  if (registrationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking registration status...</p>
        </motion.div>
      </div>
    );
  }

  // User not registered for event
  if (user && !isRegistered) {
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
            className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Users className="h-10 w-10 text-orange-600 dark:text-orange-400" />
          </motion.div>
          <h1 className="text-2xl font-bold font-poppins mb-4">
            Event Registration Required
          </h1>
          <p className="text-muted-foreground mb-6">
            You must be registered for Qiskit Fall Fest 2025 before applying to become a Campus Ambassador. Please register for the event first.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/register")}
              className="btn-quantum text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg shadow-lg relative group animate-pulse-glow w-full"
            >
              <span className="relative z-10">Register for Event</span>
              <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/ambassadors")}
              className="w-full"
            >
              View Ambassadors
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // User already has an application
  if (hasExistingApplication) {
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
            className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CheckCircle className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
          </motion.div>
          <h1 className="text-2xl font-bold font-poppins mb-4">
            Application Already Submitted
          </h1>
          <p className="text-muted-foreground mb-6">
            You have already submitted an application for the Campus Ambassador program. We'll review it and get back to you soon.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="btn-quantum text-primary-foreground px-8 py-3 text-lg font-semibold rounded-lg shadow-lg relative group w-full"
            >
              <span className="relative z-10">Return to Home</span>
              <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/ambassadors")}
              className="w-full"
            >
              View Ambassadors
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Success page after submission
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
            Application Submitted Successfully!
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to be a Campus Ambassador. We'll review your application and get back to you soon.
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

  // Main application form
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
              Apply to be a{" "}
              <span className="text-gradient">Campus Ambassador</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Represent Qiskit Fall Fest at your institution and earn exciting rewards
            </p>
          </div>

          <Card className="glass-card border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Ambassador Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
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
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
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
                        onChange={() => {}} // Disable manual changes
                        readOnly
                        className="bg-muted cursor-not-allowed"
                        placeholder="Email from your account"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                    Academic Information
                  </h3>
                  <div>
                    <Label htmlFor="institution">Institution/University *</Label>
                    <Select
                      value={formData.institution}
                      onValueChange={(value) => {
                        handleInputChange("institution", value);
                        if (value !== "Others") {
                          handleInputChange("customInstitution", "");
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {instituteOptions.map((institute) => (
                          <SelectItem key={institute} value={institute}>
                            {institute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formData.institution === "Others" && (
                      <div className="mt-2">
                        <Input
                          id="customInstitution"
                          value={formData.customInstitution}
                          onChange={(e) => handleInputChange("customInstitution", e.target.value)}
                          placeholder="Enter your institution name"
                          required
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Year of Study *</Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) => handleInputChange("year", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                          <SelectItem value="5">5th Year</SelectItem>
                          <SelectItem value="pg">Postgraduate</SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="branch">Branch/Department *</Label>
                      <Input
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => handleInputChange("branch", e.target.value)}
                        placeholder="e.g., Computer Science"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Ambassador Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    Ambassador Information
                  </h3>
                  <div>
                    <Label htmlFor="social_media">Social Media Handles</Label>
                    <Input
                      id="social_media"
                      value={formData.social_media}
                      onChange={(e) => handleInputChange("social_media", e.target.value)}
                      placeholder="LinkedIn, Twitter, Instagram, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="previous_experience">Previous Experience</Label>
                    <Textarea
                      id="previous_experience"
                      value={formData.previous_experience}
                      onChange={(e) => handleInputChange("previous_experience", e.target.value)}
                      placeholder="Any previous experience as a campus ambassador or in event promotion"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantum_knowledge">Knowledge in Quantum Computing</Label>
                    <Select
                      value={formData.quantum_knowledge}
                      onValueChange={(value) => handleInputChange("quantum_knowledge", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your knowledge level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No prior knowledge</SelectItem>
                        <SelectItem value="basic">Basic understanding (familiar with concepts)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (completed courses/tutorials)</SelectItem>
                        <SelectItem value="advanced">Advanced (worked on quantum projects)</SelectItem>
                        <SelectItem value="expert">Expert (research experience)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="why_join">Why do you want to be a Campus Ambassador? *</Label>
                    <Textarea
                      id="why_join"
                      value={formData.why_join}
                      onChange={(e) => handleInputChange("why_join", e.target.value)}
                      placeholder="Tell us why you're interested in this role"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ideas_for_promotion">Ideas for Promoting the Event *</Label>
                    <Textarea
                      id="ideas_for_promotion"
                      value={formData.ideas_for_promotion}
                      onChange={(e) => handleInputChange("ideas_for_promotion", e.target.value)}
                      placeholder="Share your ideas for promoting Qiskit Fall Fest at your institution"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="agreeTerms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <a
                          href="/code-of-conduct"
                          className="text-primary underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Code of Conduct
                        </a>{" "}
                        and commit to promoting the event responsibly *
                      </label>
                    </div>
                  </div>
                </div>

                {/* Information Button */}
                <div className="text-center">
                  <Button
                    type="button"
                    onClick={() =>
                      window.open(
                        "https://docs.google.com/document/d/1kpouP4HGlx3O1mStsjYd1PmI-D9nJmtnU-B1T1ZKIjk/edit?usp=sharing",
                        "_blank"
                      )
                    }
                    variant="outline"
                    className="mb-4"
                  >
                    Learn About Roles & Responsibilities
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full btn-quantum text-primary-foreground py-6 text-lg font-semibold rounded-lg shadow-lg relative group"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting Application...
                      </>
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

export default Ambassador;