import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  AtSign,
  Users,
  LifeBuoy,
  Handshake,
  Info,
  Plane,
  Train,
  Bus,
  ArrowDown,
  Navigation,
  Car,
} from "lucide-react";
import { FaLinkedin, FaYoutube, FaInstagram, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([formData]);

      if (error) throw error;

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "General Queries",
      description: "Get in touch with our organizing team",
      contact: "qiskitfallfest25@rgukt.in",
      action: "mailto:qiskitfallfest25@rgukt.in",
    },
    {
      icon: Phone,
      title: "General Queries",
      description: "Call us for any questions or support",
      contact: "+91 98859 84638, +91 93928 10073",
      action: "tel:+919885984638",
    },
    {
      icon: AtSign,
      title: "Hackathon Support",
      description: "Registration, submissions, and judging",
      contact: "support.quantum@rgukt.in",
      action: "mailto:support.quantum@rgukt.in",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "RGUKT Srikakulam Campus",
      contact: "Srikakulam, Andhra Pradesh, India",
      action: "https://maps.app.goo.gl/3YQe1nMD5zfYcNfs7",
    },
  ];

  const socialLinks = [
    {
      icon: FaXTwitter,
      name: "X (Twitter)",
      url: "https://x.com/rguktsklm_qff25?t=biaMBN4M9_3vEKNrAH7Hxg&s=08",
      color: "from-gray-700 to-gray-900",
      hoverColor: "group-hover:from-gray-800 group-hover:to-black",
    },
    {
      icon: FaYoutube,
      name: "YouTube",
      url: "https://www.youtube.com/@rguktsklm_qff2025",
      color: "from-red-600 to-red-800",
      hoverColor: "group-hover:from-red-700 group-hover:to-red-900",
    },
    {
      icon: FaLinkedin,
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/rguktsklm-qff2025/",
      color: "from-blue-600 to-blue-800",
      hoverColor: "group-hover:from-blue-700 group-hover:to-blue-900",
    },
    {
      icon: FaInstagram,
      name: "Instagram",
      url: "https://www.instagram.com/rguktsklm_qff2025/",
      color: "from-pink-500 via-purple-500 to-indigo-500",
      hoverColor:
        "group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600",
    },
    {
      icon: FaDiscord,
      name: "Discord",
      url: "https://discord.gg/hHfrUHVZqZ",
      color: "from-indigo-600 to-indigo-800",
      hoverColor: "group-hover:from-indigo-700 group-hover:to-indigo-900",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <section className="hero-gradient py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-poppins mb-6">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground">
              Have questions? We're here to help make your quantum journey
              successful
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="glass-card border border-white/10 text-center h-full">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {method.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">
                          {method.description}
                        </p>
                        {method.title === "General Queries" && method.icon === Phone ? (
                          <div className="space-y-1">
                            <a
                              href="tel:+919885984638"
                              className="block text-primary hover:text-primary-hover transition-colors font-medium"
                            >
                              +91 98859 84638
                            </a>
                            <a
                              href="tel:+919392810073"
                              className="block text-primary hover:text-primary-hover transition-colors font-medium"
                            >
                              +91 93928 10073
                            </a>
                          </div>
                        ) : (
                          <a
                            href={method.action}
                            target="__blank"
                            className="text-primary hover:text-primary-hover transition-colors font-medium break-all inline-block"
                          >
                            {method.contact}
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Social Media Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold font-poppins mb-6 text-center">
                Connect With Us <span className="text-gradient">Socially</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {socialLinks.map((social, index) => {
                  const SocialIcon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="glass-card border border-white/10 overflow-hidden h-full relative">
                        <CardContent className="p-6 text-center relative z-10">
                          <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center text-3xl text-primary">
                            <SocialIcon />
                          </div>
                          <h3 className="font-semibold mb-1">{social.name}</h3>
                        </CardContent>
                      </Card>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* How to Reach Us Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold font-poppins mb-8 text-center">
                How to Reach <span className="text-gradient">RGUKT Srikakulam</span>
              </h2>

              {/* Location Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <Card className="glass-card border border-white/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-60"></div>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <MapPin className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
                      🏫 Campus Location
                    </h3>
                    <div className="bg-background/50 p-4 rounded-lg border border-white/5">
                    <p className="text-muted-foreground leading-relaxed">
                    <strong>Rajiv Gandhi University of Knowledge Technologies (RGUKT) – Srikakulam</strong><br />
                    SM Puram (Village), Etcherla (Mandal)<br />
                    Srikakulam District, Andhra Pradesh – 532410
                    </p>
                    </div>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* By Air */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -5 }}
                >
                <Card className="glass-card border border-white/10 overflow-hidden relative group h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-sky-500 opacity-50"></div>
                <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Plane className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center text-blue-600 dark:text-blue-400">✈️ By Air</h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Fly to Vishakapatnam Airport</p>
                    <p className="text-xs text-muted-foreground">VTZ - ~100 km from campus</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Hire Cab to RTC Complex</p>
                    <p className="text-xs text-muted-foreground">Reach Vishakapatnam RTC Complex</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bus className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Take Srikakulam Bus</p>
                    <p className="text-xs text-muted-foreground">Get dropped in Chilakapalem</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Car className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Hire Auto to Campus</p>
                    <p className="text-xs text-muted-foreground">Reach RGUKT SKLM (SM Puram)</p>
                    </div>
                  </div>
                </div>
                </CardContent>
                </Card>
                </motion.div>

                {/* By Train */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                <Card className="glass-card border border-white/10 overflow-hidden relative group h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-50"></div>
                <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Train className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center text-green-600 dark:text-green-400">🚆 By Train</h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">1</span>
                    </div>
                    <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Reach Srikakulam Station</p>
                    <p className="text-xs text-muted-foreground">Amadalavalasa (from anywhere)</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Car className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Auto to Chilakapalem</p>
                    <p className="text-xs text-muted-foreground">~15 km from station</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Navigation className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">Auto to IIIT SM Puram</p>
                    <p className="text-xs text-muted-foreground">Final destination</p>
                    </div>
                  </div>
                </div>
                </CardContent>
                </Card>
                </motion.div>

                {/* By Road */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                <Card className="glass-card border border-white/10 overflow-hidden relative group h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 opacity-50"></div>
                <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Bus className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center text-orange-600 dark:text-orange-400">🚌 By Road</h3>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-orange-600">1</span>
                    </div>
                    <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">APSRTC to Srikakulam</p>
                    <p className="text-xs text-muted-foreground">From anywhere in Andhra Pradesh</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Navigation className="h-3 w-3 text-orange-600" />
                    </div>
                    <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Reach Etcherla</p>
                    <p className="text-xs text-muted-foreground">Via NH-16 highway</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Car className="h-3 w-3 text-orange-600" />
                    </div>
                    <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Auto to IIIT SKLM</p>
                    <p className="text-xs text-muted-foreground">SM Puram campus</p>
                    </div>
                  </div>
                </div>
                </CardContent>
                </Card>
                </motion.div>
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8"
              >
                <Card className="glass-card border border-white/10 overflow-hidden">
                <CardContent className="p-6 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Info className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold mb-2 text-primary">Travel Tips</h4>
                <p className="text-sm text-muted-foreground">
                GPS coordinates: <strong>18.2949° N, 83.8938° E</strong><br />
                Best time to travel: Early morning or evening to avoid peak heat<br />
                Keep campus contact number handy for any assistance
                </p>
                </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <Card className="glass-card border border-white/10 mb-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50"></div>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold font-poppins mb-6 text-center">
                  Send Us a <span className="text-gradient">Message</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2 flex items-center"
                      >
                        <span className="bg-primary/10 p-1 rounded-md mr-2">
                          <span className="block h-3 w-3 rounded-full bg-primary"></span>
                        </span>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2 flex items-center"
                      >
                        <span className="bg-primary/10 p-1 rounded-md mr-2">
                          <span className="block h-3 w-3 rounded-full bg-primary"></span>
                        </span>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2 flex items-center"
                    >
                      <span className="bg-primary/10 p-1 rounded-md mr-2">
                        <span className="block h-3 w-3 rounded-full bg-primary"></span>
                      </span>
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-popover"
                    >
                      <option value="">Select a topic</option>
                      <option value="registration">
                        Registration Questions
                      </option>
                      <option value="technical">Technical Support</option>
                      <option value="sponsorship">Sponsorship Inquiry</option>
                      <option value="media">Media & Press</option>
                      <option value="general">General Questions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2 flex items-center"
                    >
                      <span className="bg-primary/10 p-1 rounded-md mr-2">
                        <span className="block h-3 w-3 rounded-full bg-primary"></span>
                      </span>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-white/20 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-quantum px-8 py-2 text-primary-foreground rounded-lg shadow-md relative group animate-pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </span>
                      <span className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></span>
                    </Button>
                  </div>

                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-green-700 dark:text-green-400">
                        Message sent successfully! We'll get back to you soon.
                      </span>
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-red-700 dark:text-red-400">
                        Failed to send message. Please try again or contact us
                        directly.
                      </span>
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Code of Conduct */}
            <Card className="glass-card border border-white/10 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary opacity-50"></div>
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold font-poppins mb-4">
                    Code of <span className="text-gradient">Conduct</span>
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
                    We follow a zero-tolerance Code of Conduct. Respect everyone
                    — harassment is not tolerated. Report incidents to
                    <a
                      href="mailto:contact.quantum@rgukt.in"
                      className="text-primary hover:underline ml-1"
                    >
                      contact.quantum@rgukt.in
                    </a>
                    .
                  </p>
                  <Button
                    variant="outline"
                    className="px-6 py-2 glass-card border border-white/20 hover:border-primary/50 rounded-lg shadow-md relative group"
                  >
                    <span className="relative z-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center">
                      View Full Code of Conduct
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity"></span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>


          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Contact;
