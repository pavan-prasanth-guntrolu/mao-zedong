import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  User,
  Lock,
  AlertCircle,
  Users,
  ArrowRight,
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import {
  getReferralCode,
  clearStoredReferralCode,
} from "@/lib/referralCodeUtils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import groupQR from "/images/group-9.png";
import secondQR from "/images/second-qr.jpg";

// ✅ WhatsApp link
const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/E1E5AckkmSZHmyuMW2MzgO?mode=ems_qr_t";

// ✅ All countries list
const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "South Africa",
  "Singapore",
  "United Arab Emirates",
  "Italy",
  "Mexico",
  "Russia",
  "South Korea",
  "Netherlands",
  "Switzerland",
  "Sweden",
  "New Zealand",
  "Indonesia",
  "Malaysia",
  "Philippines",
  "Thailand",
  "Bangladesh",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
  "Other",
];

// ✅ All Indian states list
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// ✅ Institute options
const instituteOptions = [
  "RGUKT Srikakulam",
  "RGUKT Nuzvid",
  "RGUKT RK Valley",
  "RGUKT Ongole",
  "Others",
];

// ✅ Phone sanitizer
const sanitizePhone = (value) => value.replace(/\D/g, "").slice(0, 10);

// 🔧 helpers
const normalize = (s = "") => s.trim().replace(/\s+/g, " ");

// --- Free-text input with suggestions; type-to-jump only on the FIRST typed character ---
// Dropdown hides automatically when no college matches the typed text.
function ApprovedInstitutionInput({
  value,
  onChange,
  placeholder = "Enter your institution",
  disabled = false,
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState([]); // flat, sorted list
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [focused, setFocused] = useState(false);

  const itemRefs = useRef([]);
  const listRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("ambassador_applications")
          .select("institution, status")
          .eq("status", "approved");
        if (error) throw error;

        const seen = new Map(); // case-insensitive dedupe
        (data || []).forEach((row) => {
          const raw = row?.institution || "";
          const cleaned = normalize(raw);
          const key = cleaned.toLowerCase();
          if (cleaned && !seen.has(key)) seen.set(key, cleaned);
        });

        const list = Array.from(seen.values()).sort((a, b) =>
          a.localeCompare(b)
        );
        if (isMounted) setInstitutions(list);
      } catch (err) {
        console.error("Failed to load institutions:", err);
        toast({
          title: "Couldn’t load institutions",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [toast]);

  // Filter by user text; if empty, show full list
  const filtered = useMemo(() => {
    const q = (value || "").toLowerCase();
    if (!q) return institutions;
    return institutions.filter((n) => n.toLowerCase().includes(q));
  }, [value, institutions]);

  // Open/close based on filtered results and focus state
  useEffect(() => {
    if (!focused) return;
    if (filtered.length === 0) {
      setOpen(false);
      setHighlightedIndex(-1);
    } else {
      setOpen(true);
      if (highlightedIndex < 0 || highlightedIndex >= filtered.length) {
        setHighlightedIndex(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, focused]);

  const scrollToIndex = (i) => {
    const el = itemRefs.current[i];
    if (el?.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        onChange(filtered[highlightedIndex]); // pick highlighted from filtered list
        setOpen(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open && filtered.length > 0) setOpen(true);
      if (filtered.length > 0) {
        const next = Math.min(highlightedIndex + 1, filtered.length - 1);
        setHighlightedIndex(next);
        scrollToIndex(next);
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open && filtered.length > 0) setOpen(true);
      if (filtered.length > 0) {
        const prev = Math.max(highlightedIndex - 1, 0);
        setHighlightedIndex(prev);
        scrollToIndex(prev);
      }
      return;
    }

    // ✅ Type-to-jump only when input was EMPTY before this key (use the full list)
    if (/^[a-z]$/i.test(e.key) && (value ?? "").length === 0) {
      const letter = e.key.toLowerCase();
      const matchIndex = institutions.findIndex(
        (name) => (name[0] || "").toLowerCase() === letter
      );
      if (matchIndex >= 0) {
        // Find corresponding index in filtered view (which equals full list when value is empty)
        setHighlightedIndex(matchIndex);
        scrollToIndex(matchIndex);
        if (focused) setOpen(true);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)} // user text stays visible
            onFocus={() => {
              setFocused(true);
              // open only if there are matches
              setOpen((filtered.length ?? 0) > 0);
              // highlight current exact match if any
              const idx = value
                ? filtered.findIndex(
                    (n) => n.toLowerCase() === value.toLowerCase()
                  )
                : filtered.length
                ? 0
                : -1;
              setHighlightedIndex(idx);
            }}
            onBlur={() => {
              // close after a tiny delay to allow click
              setTimeout(() => {
                setOpen(false);
                setFocused(false);
              }, 120);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={8}
        avoidCollisions={false}
        className="p-0 z-50 w-[--radix-popover-trigger-width] shadow-lg"
        onOpenAutoFocus={(e) => e.preventDefault()} // keep focus on input
      >
        <div ref={listRef}>
          <Command shouldFilter={false}>
            <CommandList className="max-h-64">
              {loading && (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Loading institutions…
                </div>
              )}
              {!loading && filtered.length === 0 && (
                <CommandEmpty /> /* hidden state; popover already closes when filtered is 0 */
              )}
              {!loading &&
                filtered.map((name, i) => (
                  <CommandItem
                    key={name}
                    ref={(el) => (itemRefs.current[i] = el)}
                    value={name}
                    onMouseMove={() => setHighlightedIndex(i)}
                    onSelect={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    className={
                      i === highlightedIndex
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                  >
                    {name}
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  );
}

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    institution: "",
    customInstitution: "",
    year: "",
    branch: "",
    experience: "",
    motivation: "",
    referralCode: "",
    attendanceMode: "",
    agreeTerms: false,
    agreeUpdates: false,
    country: "",
    state: "",
    gender: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [isReferralCodeLocked, setIsReferralCodeLocked] = useState(false);

  // Email verification
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState("");

  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
      setIsEmailVerified(false);
    }
  }, [user]);

  // OTP Timer effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  useEffect(() => {
    if (!isReferralCodeLocked) {
      const referralCode = getReferralCode(searchParams);
      if (referralCode) {
        setFormData((prev) => ({ ...prev, referralCode }));
      }
    }
  }, [searchParams, isReferralCodeLocked]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (user?.id) {
        try {
          const { data: existing, error } = await supabase
            .from("registrations")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

          if (error) throw error;

          if (existing) {
            setAlreadyRegistered(true);
            if (existing.referred_by) {
              setIsReferralCodeLocked(true);
              const { data: referrer, error: refErr } = await supabase
                .from("registrations")
                .select("referral_code")
                .eq("id", existing.referred_by)
                .maybeSingle();

              if (refErr) {
                console.error("Error fetching referrer:", refErr);
              } else if (referrer) {
                setFormData((prev) => ({
                  ...prev,
                  referralCode: referrer.referral_code,
                }));
              }
            }
          }
        } catch (error) {
          console.error("Error checking registration:", error);
        }
      }
    };
    checkRegistration();
  }, [user]);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateForm = () => {
    if (!isEmailVerified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email address before submitting.",
        variant: "destructive",
      });
      return false;
    }

    const required = [
      "fullName",
      "email",
      "phone",
      "institution",
      "year",
      "branch",
      "attendanceMode",
      "country",
      "gender",
    ];
    if (formData.country === "India") required.push("state");
    if (formData.institution === "Others") required.push("customInstitution");

    const missing = required.filter((f) => !formData[f]);
    if (missing.length) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    const phoneDigits = (formData.phone || "").replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description:
          "Please enter a valid 10-digit phone number (digits only).",
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
    return true;
  };

  const generateUniqueReferralCode = async () => {
    while (true) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const { data, error } = await supabase
        .from("registrations")
        .select("id")
        .eq("referral_code", code)
        .maybeSingle();
      if (error) throw error;
      if (!data) return code;
    }
  };

  const generateOtp = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingEmail(true);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      const apiUrl = `https://quantum.rgukt.in/send_mails/vendor/send_mail.php?to_email=${encodeURIComponent(
        formData.email
      )}&name=${encodeURIComponent(
        formData.fullName || "User"
      )}&otp=${otpCode}`;
      await fetch(apiUrl, { method: "GET", mode: "no-cors" });

      sessionStorage.setItem("registration_otp", otpCode);
      sessionStorage.setItem("otp_email", formData.email);
      sessionStorage.setItem("otp_timestamp", Date.now().toString());

      setIsOtpSent(true);
      setOtpTimer(60);
      toast({
        title: "OTP Sent!",
        description: "Please check your email for the verification code.",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error Sending OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleVerifyEmail = async () => {
    setOtpError("");

    if (!otp) {
      setOtpError("Please enter the verification code");
      return;
    }

    const storedOtp = sessionStorage.getItem("registration_otp");
    const storedEmail = sessionStorage.getItem("otp_email");
    const otpTimestamp = parseInt(
      sessionStorage.getItem("otp_timestamp") || "0"
    );

    if (Date.now() - otpTimestamp > 5 * 60 * 1000) {
      setOtpError("OTP expired. Please request a new verification code");
      return;
    }

    if (otp === storedOtp && formData.email === storedEmail) {
      setIsEmailVerified(true);
      setOtpError("");
      toast({
        title: "Email Verified!",
        description: "You can now proceed with registration.",
      });

      sessionStorage.removeItem("registration_otp");
      sessionStorage.removeItem("otp_email");
      sessionStorage.removeItem("otp_timestamp");
    } else {
      setOtpError(
        "Invalid OTP. Please check the verification code and try again"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      if (!user) return;

      const referralCode = await generateUniqueReferralCode();
      let referredBy = null;

      if (formData.referralCode) {
        const { data: referrer, error: refErr } = await supabase
          .from("registrations")
          .select("id")
          .eq("referral_code", formData.referralCode)
          .maybeSingle();

        if (refErr) throw refErr;
        if (referrer) referredBy = referrer.id;
      }

      const phoneDigits = sanitizePhone(formData.phone || "");

      const { error } = await supabase.from("registrations").insert([
        {
          user_id: user.id,
          fullName: formData.fullName,
          email: formData.email,
          phone: phoneDigits,
          gender: formData.gender,
          institution:
            formData.institution === "Others"
              ? formData.customInstitution
              : formData.institution,
          year: formData.year,
          branch: formData.branch,
          experience: formData.experience,
          motivation: formData.motivation,
          referral_code: referralCode,
          referred_by: referredBy,
          attendance_mode: formData.attendanceMode,
          country: formData.country,
          state: formData.state,
        },
      ]);

      if (error) throw error;

      try {
        const confirmApiUrl = `https://quantum.rgukt.in/send_mails/vendor/confirm_mail.php?to_email=${encodeURIComponent(
          formData.email
        )}&name=${encodeURIComponent(formData.fullName)}`;
        await fetch(confirmApiUrl, { method: "GET", mode: "no-cors" });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }

      clearStoredReferralCode();

      setIsSubmitted(true);
      toast({
        title: "Registration Successful!",
        description: "You have registered for Qiskit Fall Fest 🎉",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Registration Failed",
        description: err.message || "Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Sections ---
  if (!user) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-background px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="max-w-md w-full text-center">
          <motion.div
            className="relative inline-flex items-center justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-quantum-blue/20 to-quantum-purple/20 rounded-full blur-xl" />
            <div className="relative w-20 h-20 bg-gradient-to-r from-quantum-blue to-quantum-purple rounded-full flex items-center justify-center">
              <Lock className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-quantum-blue to-quantum-purple bg-clip-text text-transparent">
              Authentication Required
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Please sign in to access the registration form and join the
              quantum revolution.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="btn-quantum px-8 py-3 text-base font-semibold rounded-xl shadow-lg group transition-all duration-300 hover:scale-105"
            >
              <Lock className="h-4 w-4 mr-2" />
              Sign In to Continue
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (alreadyRegistered || isSubmitted) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-background px-4 mt-[90px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="max-w-2xl w-full text-center">
          <motion.div
            className="relative inline-flex items-center justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-quantum-cyan/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-r from-green-500 to-quantum-cyan rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-quantum-cyan bg-clip-text text-transparent">
              Welcome to the Quantum Revolution! 🎉
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your registration is complete! Join our community to stay
              connected with fellow quantum enthusiasts.
            </p>
          </motion.div>

          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              Join Our WhatsApp Communities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-card/50 backdrop-blur-sm border border-white/20 rounded-xl p-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src={groupQR}
                  alt="Main WhatsApp Group QR"
                  className="w-full max-w-48 mx-auto mb-4 border rounded-lg shadow-lg"
                />
                <p className="text-sm font-medium">Main Community</p>
              </motion.div>
              <motion.div
                className="bg-card/50 backdrop-blur-sm border border-white/20 rounded-xl p-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src={secondQR}
                  alt="Secondary WhatsApp Group QR"
                  className="w-full max-w-48 mx-auto mb-4 border rounded-lg shadow-lg"
                />
                <p className="text-sm font-medium">Updates & Announcements</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Button
              onClick={() => window.open(WHATSAPP_GROUP_LINK, "_blank")}
              className="btn-quantum px-8 py-3 text-base font-semibold rounded-xl shadow-lg group transition-all duration-300 hover:scale-105 relative overflow-hidden text-white hover:text-white"
            >
              <span className="relative z-10 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Join WhatsApp Community
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>

            <Button
              onClick={() => navigate("/refer")}
              variant="outline"
              className="px-8 py-3 text-base font-semibold rounded-xl border-2 border-quantum-cyan/30 hover:border-quantum-cyan hover:bg-quantum-cyan/10 transition-all duration-300"
            >
              Refer & Earn Rewards
            </Button>
          </motion.div>

          <motion.div
            className="mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <p>🎯 Next step: Check your email for confirmation details</p>
            <p>📱 Join our community to get real-time updates</p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-background py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="glass-card border border-white/20 shadow-lg relative overflow-hidden">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="fullName"
                          className="text-sm font-medium"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          placeholder="Enter your full name"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address *
                          {isEmailVerified && (
                            <CheckCircle className="h-4 w-4 text-green-500 inline ml-1" />
                          )}
                        </Label>
                        <div className="space-y-3">
                          <Input
                            id="email"
                            value={formData.email}
                            placeholder="Email from your account"
                            disabled
                            className="bg-muted cursor-not-allowed text-muted-foreground"
                            required
                          />

                          {!isEmailVerified && (
                            <div className="space-y-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={generateOtp}
                                disabled={isVerifyingEmail || otpTimer > 0}
                              >
                                {isVerifyingEmail
                                  ? "Sending..."
                                  : otpTimer > 0
                                  ? `Resend in ${otpTimer}s`
                                  : isOtpSent
                                  ? "Resend OTP"
                                  : "Send OTP"}
                              </Button>

                              {isOtpSent && (
                                <div className="space-y-2">
                                  <div className="flex gap-2">
                                    <Input
                                      value={otp}
                                      onChange={(e) => {
                                        setOtp(e.target.value);
                                        if (otpError) setOtpError("");
                                      }}
                                      placeholder="Enter 6-digit OTP"
                                      maxLength={6}
                                      className={`flex-1 ${
                                        otpError
                                          ? "border-red-500 focus:border-red-500"
                                          : ""
                                      }`}
                                    />
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={handleVerifyEmail}
                                      disabled={!otp || otp.length !== 6}
                                    >
                                      Verify
                                    </Button>
                                  </div>
                                  {otpError && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                      <AlertCircle className="h-4 w-4" />
                                      {otpError}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {isEmailVerified && (
                            <p className="text-sm text-green-500 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Email verified
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md-grid-cols-2 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange(
                              "phone",
                              sanitizePhone(e.target.value)
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === " ") e.preventDefault();
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pasted = (
                              e.clipboardData || window.clipboardData
                            ).getData("text");
                            handleInputChange("phone", sanitizePhone(pasted));
                          }}
                          inputMode="numeric"
                          type="tel"
                          pattern="\d{10}"
                          maxLength={10}
                          autoComplete="tel"
                          placeholder="10-digit number"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">
                          Gender *
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="country"
                          className="text-sm font-medium"
                        >
                          Country *
                        </Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => {
                            handleInputChange("country", value);
                            if (value !== "India")
                              handleInputChange("state", "");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.country === "India" && (
                        <div className="space-y-2">
                          <Label
                            htmlFor="state"
                            className="text-sm font-medium"
                          >
                            State *
                          </Label>
                          <Select
                            value={formData.state}
                            onValueChange={(value) =>
                              handleInputChange("state", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {indianStates.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Academic Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="institution"
                          className="text-sm font-medium"
                        >
                          Institution *
                        </Label>
                        <Select
                          value={formData.institution}
                          onValueChange={(value) => {
                            handleInputChange("institution", value);
                            if (value !== "Others")
                              handleInputChange("customInstitution", "");
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

                        {/* When "Others", show the free-text + suggestions input */}
                        {formData.institution === "Others" && (
                          <div className="mt-2">
                            <ApprovedInstitutionInput
                              value={formData.customInstitution}
                              onChange={(v) =>
                                handleInputChange("customInstitution", v)
                              }
                              placeholder="Enter your institution"
                            />
                            <p className="text-xs text-muted-foreground ]">
                              If your college name is not here, please enter
                              your college name and proceed.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year" className="text-sm font-medium">
                          Academic Year *
                        </Label>
                        <Select
                          value={formData.year}
                          onValueChange={(value) =>
                            handleInputChange("year", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1st-year">1st Year</SelectItem>
                            <SelectItem value="2nd-year">2nd Year</SelectItem>
                            <SelectItem value="3rd-year">3rd Year</SelectItem>
                            <SelectItem value="4th-year">4th Year</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                            <SelectItem value="masters">Masters</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="PUC">PUC</SelectItem>
                            <SelectItem value="school">School</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="branch" className="text-sm font-medium">
                          Branch/Major *
                        </Label>
                        <Input
                          id="branch"
                          value={formData.branch}
                          onChange={(e) =>
                            handleInputChange("branch", e.target.value)
                          }
                          placeholder="e.g., Computer Science, Physics"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="attendanceMode"
                          className="text-sm font-medium"
                        >
                          Attendance Mode *
                        </Label>
                        <Select
                          value={formData.attendanceMode}
                          onValueChange={(value) =>
                            handleInputChange("attendanceMode", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How will you attend?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-person">In-Person</SelectItem>
                            <SelectItem value="virtual">Virtual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Experience & Goals */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="experience"
                        className="text-sm font-medium"
                      >
                        Quantum Computing Experience
                      </Label>
                      <Select
                        value={formData.experience}
                        onValueChange={(value) =>
                          handleInputChange("experience", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            Complete Beginner
                          </SelectItem>
                          <SelectItem value="beginner">
                            Some Basic Knowledge
                          </SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="motivation"
                        className="text-sm font-medium"
                      >
                        Why do you want to attend? (Optional)
                      </Label>
                      <Textarea
                        id="motivation"
                        value={formData.motivation}
                        onChange={(e) =>
                          handleInputChange("motivation", e.target.value)
                        }
                        placeholder="Share your motivation..."
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="referralCode"
                        className="text-sm font-medium"
                      >
                        Referral Code (Optional)
                        {isReferralCodeLocked && (
                          <span className="text-xs"> 🔒</span>
                        )}
                      </Label>
                      <Input
                        id="referralCode"
                        value={formData.referralCode}
                        onChange={(e) =>
                          handleInputChange("referralCode", e.target.value)
                        }
                        placeholder="Enter referral code"
                        disabled={isReferralCodeLocked}
                        readOnly={isReferralCodeLocked}
                        className={
                          isReferralCodeLocked
                            ? "bg-muted cursor-not-allowed"
                            : ""
                        }
                      />
                      {isReferralCodeLocked && (
                        <p className="text-xs text-muted-foreground">
                          Your referral code is locked and cannot be changed.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms & Submit */}
                  <div className="space-y-3 pt-6 border-t border-border/30">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeTerms", !!checked)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="agreeTerms"
                          className="cursor-pointer text-sm font-medium"
                        >
                          I agree to the terms and conditions *
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreeUpdates"
                        checked={formData.agreeUpdates}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeUpdates", !!checked)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor="agreeUpdates"
                          className="cursor-pointer text-sm font-medium"
                        >
                          Keep me updated about future events
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={isSubmitting || !isEmailVerified}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3" />
                          Processing Registration...
                        </>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Complete Registration
                        </span>
                      )}
                    </Button>

                    {!isEmailVerified && (
                      <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          Please verify your email address before registering
                        </p>
                      </div>
                    )}

                    <div className="text-center">
                      <Button
                        onClick={() =>
                          window.open(WHATSAPP_GROUP_LINK, "_blank")
                        }
                        className="group relative isolate overflow-hidden px-8 py-3 text-base font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 bg-[#0F131A] text-white"
                      >
                        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-quantum-blue to-quantum-purple" />
                        <span className="relative z-10 flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Join WhatsApp Community
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Register;
