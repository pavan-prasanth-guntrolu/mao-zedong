import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    selectedDays: [],
  });

  const [totalCost, setTotalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Event days (21–27 Oct 2025)
  const eventDays = [
    { id: 1, date: "2025-10-21", label: "Day 1 – Oct 21 (Tue)" },
    { id: 2, date: "2025-10-22", label: "Day 2 – Oct 22 (Wed)" },
    { id: 3, date: "2025-10-23", label: "Day 3 – Oct 23 (Thu)" },
    { id: 4, date: "2025-10-24", label: "Day 4 – Oct 24 (Fri)" },
    { id: 5, date: "2025-10-25", label: "Day 5 – Oct 25 (Sat)" },
    { id: 6, date: "2025-10-26", label: "Day 6 – Oct 26 (Sun)" },
    { id: 7, date: "2025-10-27", label: "Day 7 – Oct 27 (Mon)" },
  ];

  // Autofill email
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
    const required = ["fullName", "email", "phone"];
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
          selected_days: formData.selectedDays,
          total_cost: totalCost,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Accommodation Booked!",
        description: `You’ve booked accommodation for ${daysCount} ${
          daysCount === 1 ? "day" : "days"
        }. Total cost: ₹${totalCost}.`,
      });

      navigate("/");
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

  return (
    <motion.div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Accommodation Booking</h1>
            <p className="text-lg text-muted-foreground">
              Select the days you’d like accommodation for. Each day costs ₹100.
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
