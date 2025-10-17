import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Lock,
  Save,
  ArrowLeft,
  Edit,
  MapPin,
  Check,
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ---- helpers ----
const onlyDigits10 = (v) => (v || "").replace(/\D/g, "").slice(0, 10);

// Countries list
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

// Indian states list
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

// Institute options
const instituteOptions = [
  "RGUKT Srikakulam",
  "RGUKT Nuzvid",
  "RGUKT RK Valley",
  "RGUKT Ongole",
  "Others",
];

// Available avatars
const availableAvatars = [
  {
    id: "crop_einstein",
    name: "Einstein",
    src: "images/Crop_Einstein.png",
    alt: "Einstein Avatar",
  },
  {
    id: "crop_future",
    name: "Future",
    src: "images/Crop_Future.png",
    alt: "Future Avatar",
  },
  {
    id: "crop_heisenberg",
    name: "Heisenberg",
    src: "images/Crop_Heisenbergpng.png",
    alt: "Heisenberg Avatar",
  },
  {
    id: "crop_schrodinger",
    name: "Schrödinger",
    src: "images/Crop_Schrodinger.png",
    alt: "Schrödinger Avatar",
  },
  {
    id: "simplified_illustration",
    name: "Quantum",
    src: "images/Simplified_Illustration.png",
    alt: "Quantum Avatar",
  },
];

// Validation schema (phone must be exactly 10 digits)
const profileSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\d{10}$/, "Enter exactly 10 digits (0–9)"),
    institution: z.string().min(1, "Institution is required"),
    customInstitution: z.string().optional(),
    year: z.string().min(1, "Year is required"),
    branch: z.string().min(1, "Branch is required"),
    experience: z.string().optional(),
    motivation: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().optional(),
    gender: z.string().min(1, "Gender is required"),
    attendanceMode: z.string().min(1, "Attendance mode is required"),
    avatar: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.institution === "Others") {
        return data.customInstitution && data.customInstitution.trim() !== "";
      }
      return true;
    },
    {
      message: "Please enter your institution name",
      path: ["customInstitution"],
    }
  );

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const watchedCountry = watch("country");
  const watchedInstitution = watch("institution");
  const watchedAvatar = watch("avatar");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const { data, error } = await supabase
          .from("registrations")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setValue("fullName", data.fullName || "");
          setValue("email", data.email || "");
          // sanitize to 10 digits on load
          setValue("phone", data.phone ? onlyDigits10(String(data.phone)) : "");
          setValue("year", data.year || "");
          setValue("branch", data.branch || "");
          setValue("experience", data.experience || "");
          setValue("motivation", data.motivation || "");
          setValue("country", data.country || "");
          setValue("state", data.state || "");
          setValue("gender", data.gender || "");
          setValue("attendanceMode", data.attendance_mode || "");
          setValue("avatar", data.avatar || "");

          if (data.institution) {
            const inOptions = instituteOptions.includes(data.institution);
            if (inOptions) {
              setValue("institution", data.institution);
              setValue("customInstitution", "");
            } else {
              setValue("institution", "Others");
              setValue("customInstitution", data.institution);
            }
          } else {
            setValue("institution", "");
            setValue("customInstitution", "");
          }

          setProfileData(data);
        } else {
          setProfileData(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate, setValue, toast]);

  const onSubmit = async (formData) => {
    setUpdating(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        // store as integer; schema already ensures 10 digits
        phone: formData.phone ? parseInt(formData.phone, 10) : null,
        institution:
          formData.institution === "Others"
            ? formData.customInstitution
            : formData.institution,
        year: formData.year,
        branch: formData.branch,
        experience: formData.experience || "",
        motivation: formData.motivation || "",
        country: formData.country,
        state: formData.state || "",
        gender: formData.gender,
        attendance_mode: formData.attendanceMode,
        avatar: formData.avatar || "",
      };

      const { error } = await supabase
        .from("registrations")
        .update(updateData)
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setProfileData({
        ...profileData,
        ...updateData,
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description:
          error?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div className="max-w-md w-full text-center">
          <motion.div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-blue-600" />
          </motion.div>
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="mb-6">Please sign in to access your profile.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </motion.div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not registered — show CTA to Register (no form here)
  if (!profileData) {
    return (
      <motion.div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Complete Your Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We couldn’t find a registration for your account. Please
                  register first to set up your profile and manage your details.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate("/register")}
                    className="flex-1"
                  >
                    Go to Registration
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(-1)}
                  >
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Registered — show profile (and edit mode)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background py-12 px-4"
    >
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        {/* Profile Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {editMode ? "Update Your Details" : "My Profile"}
              </CardTitle>
              {!editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone (digits-only, max 10) */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>

                  <Input
                    id="phone"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    {...register("phone", {
                      onChange: (e) => {
                        const clean = onlyDigits10(e.target.value);
                        setValue("phone", clean, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      },
                    })}
                    onKeyDown={(e) => {
                      // allow control/navigation keys
                      const allowedKeys = [
                        "Backspace",
                        "Delete",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Home",
                        "End",
                      ];
                      if (allowedKeys.includes(e.key)) return;

                      // block anything that isn't 0–9
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted =
                        (e.clipboardData || window.clipboardData).getData(
                          "text"
                        ) || "";
                      const clean = onlyDigits10(pasted);
                      setValue("phone", clean, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    onDrop={(e) => {
                      // prevent dropping text with spaces/symbols
                      e.preventDefault();
                    }}
                  />

                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          {/* <SelectItem value="other">Other</SelectItem> */}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-sm text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                {/* Institution */}
                <div className="space-y-2">
                  <Label
                    htmlFor="institution"
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    Institution/Organization *
                  </Label>
                  <Controller
                    name="institution"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          if (value !== "Others")
                            setValue("customInstitution", "");
                        }}
                        value={field.value}
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
                    )}
                  />
                  {errors.institution && (
                    <p className="text-sm text-red-500">
                      {errors.institution.message}
                    </p>
                  )}

                  {watchedInstitution === "Others" && (
                    <div className="mt-2">
                      <Input
                        id="customInstitution"
                        {...register("customInstitution")}
                        placeholder="Enter your institution name"
                      />
                      {errors.customInstitution && (
                        <p className="text-sm text-red-500">
                          {errors.customInstitution.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="year" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Year/Level *
                  </Label>
                  <Controller
                    name="year"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year/level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="5th Year">5th Year</SelectItem>
                          <SelectItem value="Masters">Masters</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Post-Doc">Post-Doc</SelectItem>
                          <SelectItem value="Faculty">Faculty</SelectItem>
                          <SelectItem value="Industry Professional">
                            Industry Professional
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.year && (
                    <p className="text-sm text-red-500">
                      {errors.year.message}
                    </p>
                  )}
                </div>

                {/* Branch */}
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch/Specialization *</Label>
                  <Input
                    id="branch"
                    {...register("branch")}
                    placeholder="Enter your branch or specialization"
                  />
                  {errors.branch && (
                    <p className="text-sm text-red-500">
                      {errors.branch.message}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* State (only for India) */}
                {watchedCountry === "India" && (
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Controller
                      name="state"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your state" />
                          </SelectTrigger>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Attendance Mode */}
                <div className="space-y-2">
                  <Label htmlFor="attendanceMode">
                    Preferred Attendance Mode *
                  </Label>
                  <Controller
                    name="attendanceMode"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select attendance mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="virtual">Virtual</SelectItem>
                          <SelectItem value="in-person">In-Person</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.attendanceMode && (
                    <p className="text-sm text-red-500">
                      {errors.attendanceMode.message}
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">
                    Experience with Quantum Computing
                  </Label>
                  <Textarea
                    id="experience"
                    {...register("experience")}
                    placeholder="Tell us about your experience with quantum computing (optional)"
                    rows={3}
                  />
                </div>

                {/* Motivation */}
                <div className="space-y-2">
                  <Label htmlFor="motivation">Motivation for Joining</Label>
                  <Textarea
                    id="motivation"
                    {...register("motivation")}
                    placeholder="What motivates you to join Qiskit Fall Fest? (optional)"
                    rows={3}
                  />
                </div>

                {/* Profile Avatar Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">
                    Profile Avatar
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose an avatar to represent your profile
                  </p>
                  <Controller
                    name="avatar"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {availableAvatars.map((avatar) => (
                          <motion.div
                            key={avatar.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                              field.value === avatar.id
                                ? "border-quantum-cyan bg-quantum-cyan/10"
                                : "border-border hover:border-quantum-cyan/50"
                            }`}
                            onClick={() => field.onChange(avatar.id)}
                          >
                            <div className="aspect-square relative overflow-hidden rounded-lg p-2">
                              <img
                                src={avatar.src}
                                alt={avatar.alt}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = "/images/default-avatar.svg";
                                }}
                              />
                              {field.value === avatar.id && (
                                <div className="absolute top-1 right-1 bg-quantum-cyan rounded-full p-1">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <p className="text-center text-xs font-medium py-2">
                              {avatar.name}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  />
                  {watchedAvatar && (
                    <div className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-quantum-cyan">
                        {(() => {
                          const meta = availableAvatars.find(
                            (a) => a.id === watchedAvatar
                          );
                          if (meta?.src) {
                            return (
                              <img
                                src={meta.src}
                                alt="Selected avatar preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            );
                          }
                          const source = (
                            watch("fullName") ||
                            watch("email") ||
                            "User"
                          ).trim();
                          const base = source.includes("@")
                            ? source.split("@")[0]
                            : source;
                          const parts = base
                            .replace(/[_\-.]+/g, " ")
                            .split(" ")
                            .filter(Boolean);
                          const initials = (
                            (parts[0]?.[0] || "") +
                              (parts.length > 1
                                ? parts[parts.length - 1][0]
                                : "") ||
                            parts[0]?.slice(0, 2) ||
                            "U"
                          ).toUpperCase();

                          return (
                            <div className="w-full h-full bg-primary text-white flex items-center justify-center">
                              <span className="text-sm font-semibold">
                                {initials}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">Selected Avatar</p>
                        <p className="text-xs text-muted-foreground">
                          {
                            availableAvatars.find((a) => a.id === watchedAvatar)
                              ?.name
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2"
                  >
                    {updating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Update Profile
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              profileData && (
                <div className="space-y-6">
                  {/* Avatar Display */}
                  <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-quantum-cyan">
                      {(() => {
                        const meta = availableAvatars.find(
                          (a) => a.id === profileData.avatar
                        );
                        if (meta?.src) {
                          return (
                            <img
                              src={meta.src}
                              alt="Profile avatar"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          );
                        }
                        const source = (
                          profileData.fullName ||
                          profileData.email ||
                          "User"
                        ).trim();
                        const base = source.includes("@")
                          ? source.split("@")[0]
                          : source;
                        const parts = base
                          .replace(/[_\-.]+/g, " ")
                          .split(" ")
                          .filter(Boolean);
                        const initials = (
                          (parts[0]?.[0] || "") +
                            (parts.length > 1
                              ? parts[parts.length - 1][0]
                              : "") ||
                          parts[0]?.slice(0, 2) ||
                          "U"
                        ).toUpperCase();

                        return (
                          <div className="w-full h-full bg-primary text-white flex items-center justify-center">
                            <span className="text-lg font-semibold">
                              {initials}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        {profileData.fullName}
                      </h3>
                      <p className="text-muted-foreground">
                        {profileData.avatar
                          ? availableAvatars.find(
                              (a) => a.id === profileData.avatar
                            )?.name + " Avatar"
                          : "Default Avatar"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </Label>
                      <p className="text-lg font-semibold">
                        {profileData.fullName || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <p className="text-lg">
                        {profileData.email || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <p className="text-lg">
                        {profileData.phone || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Gender
                      </Label>
                      <p className="text-lg capitalize">
                        {profileData.gender || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Institution/Organization
                      </Label>
                      <p className="text-lg">
                        {profileData.institution || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Year/Level
                      </Label>
                      <p className="text-lg">
                        {profileData.year || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Branch/Specialization
                      </Label>
                      <p className="text-lg">
                        {profileData.branch || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Preferred Attendance Mode
                      </Label>
                      <p className="text-lg capitalize">
                        {profileData.attendance_mode || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Country
                      </Label>
                      <p className="text-lg">
                        {profileData.country || "Not provided"}
                      </p>
                    </div>

                    {profileData.country === "India" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          State
                        </Label>
                        <p className="text-lg">
                          {profileData.state || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {profileData.experience && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Experience with Quantum Computing
                      </Label>
                      <p className="text-lg whitespace-pre-wrap">
                        {profileData.experience}
                      </p>
                    </div>
                  )}

                  {profileData.motivation && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Motivation for Joining
                      </Label>
                      <p className="text-lg whitespace-pre-wrap">
                        {profileData.motivation}
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Profile;
