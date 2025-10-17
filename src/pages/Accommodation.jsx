import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const Accommodation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    days: "",
    utr: "", // New field for UTR
  });

  const [totalCost, setTotalCost] = useState(0); // State to store total cost
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Calculate total cost when "days" is updated
    if (field === "days") {
      const days = parseInt(value) || 0;
      setTotalCost(days * 100); // Each day costs ₹100
    }
  };

  const validateForm = () => {
    const requiredFields = ["fullName", "email", "phone", "days", "utr"];
    const missingFields = requiredFields.filter((f) => !formData[f]);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
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
      const { error } = await supabase.from("accommodation").insert([
        {
          user_id: user.id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          days: formData.days,
          total_cost: totalCost,
          utr: formData.utr,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Accommodation Booked!",
        description: `Your accommodation for ${formData.days} days has been booked. Total cost: ₹${totalCost}.`,
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
              Book your stay for the event. Each day costs ₹100.
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
                  <Label htmlFor="days">Number of Days *</Label>
                  <Select
                    value={formData.days}
                    onValueChange={(value) => handleInputChange("days", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of days" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(7).keys()].map((day) => (
                        <SelectItem
                          key={day + 1}
                          value={(day + 1).toString()}
                          className="px-4 py-2 text-sm hover:bg-primary/10 rounded-md"
                        >
                          {day + 1} {day + 1 === 1 ? "Day" : "Days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.days && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Total Cost: ₹{totalCost}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="utr">UTR (Transaction Reference) *</Label>
                  <Input
                    id="utr"
                    value={formData.utr}
                    onChange={(e) => handleInputChange("utr", e.target.value)}
                    placeholder="Enter UTR number"
                    required
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <h3 className="text-lg font-semibold mb-2">Bank Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Please deposit the total amount to the following bank
                    account:
                  </p>
                  <ul className="text-sm mt-2">
                    <li>Bank Name: Quantum Bank</li>
                    <li>Account Number: 1234567890</li>
                    <li>IFSC Code: QBANK0001234</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    After depositing, enter the UTR number and click "Continue"
                    to complete your booking.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full btn-quantum py-3 text-lg font-semibold rounded-lg shadow-lg"
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
