import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Building, Users, Gift, Phone, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const TIER_OPTIONS = [
  {
    id: "diamond",
    label: "DIAMOND SPONSOR (₹1,00,000+)",
    benefits: [
      "Title sponsor recognition",
      "Logo on all event materials (digital & print)",
      "30-minute keynote speaking slot",
      "Booth space (10x10 ft) at main venue",
      "10 complimentary delegate passes",
      "Naming rights for one major event segment",
      "Exclusive interview opportunity with media",
      "Co-branding on event website homepage",
    ],
  },
  {
    id: "platinum",
    label: "PLATINUM SPONSOR (₹75,000+)",
    benefits: [
      "Prominent logo placement on all materials",
      "15-minute presentation slot",
      "Booth space (8x8 ft)",
      "5 complimentary delegate passes",
      "Panel discussion participation",
      "Social media spotlight features",
      "Logo on event t-shirts and merchandise",
    ],
  },
  {
    id: "gold",
    label: "GOLD SPONSOR (₹50,000+)",
    benefits: [
      "Logo on event materials and website",
      "Booth space (6x6 ft)",
      "3 complimentary delegate passes",
      "Social media mentions",
      "Participation in networking sessions",
    ],
  },
];

const IN_KIND_OPTIONS = [
  "Technical Equipment (Sound, Projector, Laptops)",
  "Stage & Lighting Setup",
  "Printing & Stationery (Banners, Posters, Badges)",
  "Merchandise (T-shirts, Hoodies)",
  "Food & Beverages (Snacks, Drinks, Meals)",
  "Travel & Accommodation Support",
  "Photography / Videography / Media Promotion",
  "Software / Licenses for Workshops or Competitions",
  "Security / Medical / Event Management Services",
  "Certificates & Prizes",
];

const SponsorshipForm = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    companyAddress: "",
    contributionTypes: [],
    selectedTiers: [],
    selectedCategories: [],
    additionalNotes: "",
    boothRequirements: "",
    expectedDeliverables: "",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const toggleContributionType = (type, checked) => {
    const isChecked = Boolean(checked);
    updateFormData(
      "contributionTypes",
      isChecked
        ? Array.from(new Set([...formData.contributionTypes, type]))
        : formData.contributionTypes.filter((item) => item !== type),
    );
  };

  const handleTierChange = (tier, checked) => {
    const isChecked = Boolean(checked);
    updateFormData(
      "selectedTiers",
      isChecked
        ? Array.from(new Set([...formData.selectedTiers, tier]))
        : formData.selectedTiers.filter((t) => t !== tier),
    );
  };

  const handleCategoryChange = (category, checked) => {
    const isChecked = Boolean(checked);
    updateFormData(
      "selectedCategories",
      isChecked
        ? Array.from(new Set([...formData.selectedCategories, category]))
        : formData.selectedCategories.filter((c) => c !== category),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contributionTypes.length === 0) {
      toast({
        title: "Select a Contribution Type",
        description: "Choose at least one way you'd like to support the event.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      organization_name: formData.organizationName,
      contact_person: formData.contactPerson,
      email: formData.email,
      phone: formData.phone || null,
      company_address: formData.companyAddress,
      contribution_types: formData.contributionTypes,
      financial_tiers: formData.selectedTiers,
      in_kind_categories: formData.selectedCategories,
      booth_requirements: formData.boothRequirements || null,
      expected_deliverables: formData.expectedDeliverables || null,
      additional_notes: formData.additionalNotes || null,
    };

    try {
      setSubmitting(true);
      const { error } = await supabase.from("sponsorship_form_submissions").insert([payload]);

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Thank you! Our team will reach out shortly to discuss next steps.",
      });

      setFormData({
        organizationName: "",
        contactPerson: "",
        email: "",
        phone: "",
        companyAddress: "",
        contributionTypes: [],
        selectedTiers: [],
        selectedCategories: [],
        additionalNotes: "",
        boothRequirements: "",
        expectedDeliverables: "",
      });
    } catch (submissionError) {
      console.error("Error submitting sponsorship form:", submissionError);
      toast({
        title: "Submission Failed",
        description: "Something went wrong while sending your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Become a Sponsor | Qiskit Fall Fest 2025</title>
        <meta name="description" content="Apply to become a sponsor for Qiskit Fall Fest 2025 at IIIT Srikakulam. Support quantum computing education and gain visibility among tech students." />
        <meta name="keywords" content="sponsor quantum computing, Qiskit Fall Fest sponsor, quantum technology sponsorship, IIIT Srikakulam sponsors" />
        <link rel="canonical" href="https://quantum.rgukt.in/sponsorship-form" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-poppins mb-8 text-center">
              Become a <span className="text-gradient">Sponsor</span>
            </h1>
            <p className="text-xl text-muted-foreground text-center mb-12">
              Join us in supporting quantum computing education and innovation at IIIT Srikakulam.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <Card className="border-2 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                  <CardTitle className="flex items-center text-xl">
                    <Building className="h-6 w-6 mr-3 text-blue-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="organizationName">Organization/Company Name *</Label>
                    <Input
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyAddress">Company Address *</Label>
                    <Textarea
                      id="companyAddress"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contribution Preferences */}
              <Card className="border-2 border-gradient-to-r from-green-500 to-teal-500 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
                  <CardTitle className="flex items-center text-xl">
                    <Gift className="h-6 w-6 mr-3 text-green-600" />
                    Section 1: Contribution Preferences
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose one or multiple ways your organization would like to support Qiskit Fall Fest 2025.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div
                      className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
                        formData.contributionTypes.includes("financial")
                          ? "border-primary/60 bg-primary/5 shadow-lg shadow-primary/20"
                          : "border-white/10"
                      }`}
                    >
                      <Checkbox
                        id="financial-support"
                        checked={formData.contributionTypes.includes("financial")}
                        onCheckedChange={(checked) => toggleContributionType("financial", checked)}
                      />
                      <div>
                        <Label htmlFor="financial-support" className="font-semibold cursor-pointer">
                          Financial Sponsorship
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Provide monetary support and unlock premium visibility across the festival.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
                        formData.contributionTypes.includes("in-kind")
                          ? "border-primary/60 bg-primary/5 shadow-lg shadow-primary/20"
                          : "border-white/10"
                      }`}
                    >
                      <Checkbox
                        id="in-kind-support"
                        checked={formData.contributionTypes.includes("in-kind")}
                        onCheckedChange={(checked) => toggleContributionType("in-kind", checked)}
                      />
                      <div>
                        <Label htmlFor="in-kind-support" className="font-semibold cursor-pointer">
                          In-Kind Sponsorship
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Offer products, services, or expertise that elevate on-ground experiences.
                        </p>
                      </div>
                    </div>
                  </div>

                  {formData.contributionTypes.includes("financial") && (
                    <div className="space-y-4">
                      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
                        <div>
                          <h3 className="text-lg font-semibold">Financial Sponsorship Tiers</h3>
                          <p className="text-sm text-muted-foreground">
                            Select the investment levels that best match your goals. Multiple selections are welcome.
                          </p>
                        </div>
                        <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 text-sm text-primary-foreground/80">
                          <p className="font-semibold text-primary">Need a custom package?</p>
                          <p className="mt-1">
                            Combine multiple tiers or add bespoke benefits. Our partnerships team will work with you to craft a personalised plan.
                          </p>
                        </div>
                      </div>
                      <div className="grid gap-4">
                        {TIER_OPTIONS.map((tier) => (
                          <div
                            key={tier.id}
                            className={`rounded-2xl border p-6 transition-all ${
                              formData.selectedTiers.includes(tier.id)
                                ? "border-primary/60 bg-primary/10"
                                : "border-white/10"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={`tier-${tier.id}`}
                                checked={formData.selectedTiers.includes(tier.id)}
                                onCheckedChange={(checked) => handleTierChange(tier.id, checked)}
                              />
                              <div>
                                <Label htmlFor={`tier-${tier.id}`} className="text-base font-semibold cursor-pointer">
                                  {tier.label}
                                </Label>
                                <ul className="mt-3 space-y-2">
                                  {tier.benefits.map((benefit) => (
                                    <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                                      <CheckCircle className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                                      <span>{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.contributionTypes.includes("in-kind") && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">In-Kind Support Areas</h3>
                        <p className="text-sm text-muted-foreground">
                          Let us know the resources or services you can provide. Select all that apply.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {IN_KIND_OPTIONS.map((category) => (
                          <div
                            key={category}
                            className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
                              formData.selectedCategories.includes(category)
                                ? "border-primary/60 bg-primary/5"
                                : "border-white/10"
                            }`}
                          >
                            <Checkbox
                              id={category}
                              checked={formData.selectedCategories.includes(category)}
                              onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                            />
                            <Label htmlFor={category} className="cursor-pointer text-sm font-medium leading-relaxed">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="Share specific expectations, deliverables, or partnership ideas."
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      The more details you provide, the better we can tailor the sponsorship experience for you.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full btn-quantum" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Sponsorship Application"}
              </Button>
            </form>

            <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-xl">
              <div className="flex items-start space-x-4 mb-6">
                <Users className="h-8 w-8 text-indigo-600 mt-1" />
                <div>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Gain national visibility among 23,000+ tech-driven students and researchers while positioning your brand at the forefront of the quantum revolution. Elevate your influence through tiered recognition and exclusive engagement opportunities.
                  </p>
                </div>
              </div>
              <div className="border-t border-indigo-300 dark:border-indigo-700 pt-6">
                <h4 className="font-semibold mb-4 text-xl flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-indigo-600" />
                  Contact for More Details
                </h4>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                    Email: <a href="mailto:sponsers.quantum@rgukt.in" className="text-primary ml-1 hover:underline">sponsers.quantum@rgukt.in</a>
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                    Phone: +91 93925 23650 | +91 91821 66849
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default SponsorshipForm;