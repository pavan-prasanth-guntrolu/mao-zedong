import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

const Accommodation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    city: "",
    collegeName: "",
    healthIssues: "",
    selectedDays: [],
  });

  const [totalCost, setTotalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const eventDays = [
    { id: 1, date: "2025-10-21", label: "Day 1 – Oct 21 (Tue)" },
    { id: 2, date: "2025-10-22", label: "Day 2 – Oct 22 (Wed)" },
    { id: 3, date: "2025-10-23", label: "Day 3 – Oct 23 (Thu)" },
    { id: 4, date: "2025-10-24", label: "Day 4 – Oct 24 (Fri)" },
    { id: 5, date: "2025-10-25", label: "Day 5 – Oct 25 (Sat)" },
    { id: 6, date: "2025-10-26", label: "Day 6 – Oct 26 (Sun)" },
    { id: 7, date: "2025-10-27", label: "Day 7 – Oct 27 (Mon)" },
  ];

  // ✅ If user already booked, show success
  useEffect(() => {
    const checkExistingBooking = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("accommodation")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setIsSuccess(true);
        }
      } catch (err) {
        console.error("Error checking accommodation:", err);
      } finally {
        setIsChecking(false);
      }
    };

    checkExistingBooking();
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDayCheckboxChange = (dayId) => {
    setFormData((prev) => {
      const selected = new Set(prev.selectedDays);
      if (selected.has(dayId)) selected.delete(dayId);
      else selected.add(dayId);
      const updated = Array.from(selected);
      setTotalCost(updated.length * 100);
      return { ...prev, selectedDays: updated };
    });
  };

  const validateForm = () => {
    const required = [
      "fullName",
      "email",
      "phone",
      "gender",
      "city",
      "collegeName",
    ];
    const missing = required.filter((f) => !formData[f]);
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    if (formData.selectedDays.length === 0) {
      toast({
        title: "Select Days",
        description: "Please choose at least one day to book.",
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
      const daysCount = formData.selectedDays.length;
      const { error } = await supabase.from("accommodation").insert([
        {
          user_id: user.id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          city: formData.city,
          college_name: formData.collegeName,
          health_issues: formData.healthIssues,
          selected_days: formData.selectedDays,
          total_cost: totalCost,
        },
      ]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "Accommodation Booked!",
        description: `You’ve booked accommodation for ${daysCount} ${
          daysCount === 1 ? "day" : "days"
        }. Our team will contact you soon.`,
      });

      setTimeout(() => navigate("/"), 4000);
    } catch (err) {
      console.error(err);
      toast({
        title: "Booking Failed",
        description: err.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚫 Show sign-in prompt if user not signed in
  if (!user) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-background px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Card className="max-w-md text-center p-6 glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold mb-2">
              Sign In Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              You need to sign in to book your accommodation.
            </p>
            <Button
              onClick={() => {
                localStorage.setItem("redirectAfterLogin", location.pathname);
                navigate("/login");
              }}
              className="w-full py-3 text-lg font-semibold rounded-lg bg-primary text-white hover:scale-[1.02] transition-all duration-200"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ⏳ While checking previous booking
  if (isChecking) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-background text-lg text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Checking your booking status...
      </motion.div>
    );
  }

  // ✅ Show success animation if already booked or just booked
  if (isSuccess) {
    return (
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center text-center bg-background px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="mb-6"
        >
          <CheckCircle2 className="text-green-500 w-24 h-24" />
        </motion.div>
        <h2 className="text-3xl font-semibold mb-2">Booking Successful!</h2>
        <p className="text-muted-foreground text-lg mb-6">
          Our team will contact you soon regarding your accommodation.
        </p>
        <Button onClick={() => navigate("/")} className="px-6 py-3 text-lg">
          Go to Home
        </Button>
      </motion.div>
    );
  }

  // ✅ Main form view
  return (
    <motion.div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Accommodation Booking</h1>
            <p className="text-lg text-muted-foreground mb-3">
              Select the days you’d like accommodation for. Each day costs ₹100.
            </p>
            <p className="text-sm text-yellow-400 font-medium">
              ⚠️ Limited slots available — bookings are on a first-come,
              first-served basis.
            </p>
          </div>

          <Card className="glass-card border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Accommodation Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter your city"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="collegeName">College Name *</Label>
                  <Input
                    id="collegeName"
                    value={formData.collegeName}
                    onChange={(e) =>
                      handleInputChange("collegeName", e.target.value)
                    }
                    placeholder="Enter your college name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="healthIssues">
                    Do you have any health issues? (Optional)
                  </Label>
                  <Input
                    id="healthIssues"
                    value={formData.healthIssues}
                    onChange={(e) =>
                      handleInputChange("healthIssues", e.target.value)
                    }
                    placeholder="Describe briefly if any"
                  />
                </div>

                <div>
                  <Label>Select Days *</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {eventDays.map((day) => (
                      <label
                        key={day.id}
                        className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-2 cursor-pointer hover:bg-primary/10"
                      >
                        <input
                          type="checkbox"
                          className="accent-primary"
                          checked={formData.selectedDays.includes(day.id)}
                          onChange={() => handleDayCheckboxChange(day.id)}
                        />
                        <span>{day.label}</span>
                      </label>
                    ))}
                  </div>

                  {formData.selectedDays.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Total Cost: ₹{totalCost}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-3 text-lg font-semibold rounded-lg shadow-lg bg-primary text-white hover:scale-[1.02] hover:shadow-[0_0_12px_rgba(59,130,246,0.5)] transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Booking..." : "Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Accommodation;
