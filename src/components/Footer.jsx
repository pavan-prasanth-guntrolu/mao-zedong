import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Linkedin,
  Mail,
  MessageCircle,
  Instagram,
  Youtube,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import hundredYears from "../../Graphics/Emojis/Theme.png";

const Footer = () => {
  const quickLinks = [
    { name: "About", href: "/about" },
    { name: "Schedule", href: "/schedule" },
    { name: "Workshops", href: "/workshops" },
    { name: "Speakers", href: "/speakers" },
  ];

  const resources = [
    { name: "Hackathon", href: "/hackathon" },
    { name: "Materials", href: "/materials" },
    { name: "FAQ", href: "/faq" },
    { name: "Code of Conduct", href: "/code-of-conduct" },
  ];

  const socialLinks = [
    {
      name: "X (Twitter)",
      href: "https://x.com/rguktsklm_qff25?t=biaMBN4M9_3vEKNrAH7Hxg&s=08",
      icon: FaXTwitter,
      label: "Follow us on X",
    },
    {
      name: "YouTube",
      href: "https://www.youtube.com/@rguktsklm_qff2025",
      icon: Youtube,
      label: "Subscribe on YouTube",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/rguktsklm-qff2025/",
      icon: Linkedin,
      label: "Connect on LinkedIn",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/rguktsklm_qff2025/",
      icon: Instagram,
      label: "Follow us on Instagram",
    },
    {
      name: "Discord",
      href: "https://discord.gg/hHfrUHVZqZ",
      icon: MessageCircle,
      label: "Join us on Discord",
    },
    {
      name: "Email",
      href: "mailto:qiskitfallfest25@rgukt.in",
      icon: Mail,
      label: "Send us an email",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="py-12 lg:py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-4 group">
                <motion.div
                  className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {/* <Atom className="h-6 w-6 text-primary animate-pulse-glow" />
                   */}
                  <img src={hundredYears} width={70} />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold font-poppins text-foreground">
                    Qiskit Fall Fest 2025
                  </h3>
                  <p className="text-sm text-muted-foreground -mt-1">
                    RGUKT Srikakulam
                  </p>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Hands-on Qiskit workshops, guided notebooks, and a campus
                hackathon. Building the future of quantum computing education.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target={
                        social.href.startsWith("mailto:") ? "_self" : "_blank"
                      }
                      rel={
                        social.href.startsWith("mailto:")
                          ? ""
                          : "noopener noreferrer"
                      }
                      className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-1 py-0.5"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                {resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-1 py-0.5"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Register */}
            {/* <motion.div variants={itemVariants}>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Get Involved
              </h4>
              <div className="space-y-4">
                <Link to="/register">
                  <Button className="w-full text-primary-foreground">
                    Register for Event
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Organizers
                  </Button>
                </Link>
                <a
                  href="https://qiskit.org/textbook/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-1 py-0.5"
                >
                  Qiskit Textbook
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </motion.div> */}
          </div>

          {/* Bottom Section */}
          {/* <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-border"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
                <p>
                  © 2025 IIIT Srikakulam Quantum Computing Society. All rights
                  reserved.
                </p>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/code-of-conduct"
                    className="hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-1 py-0.5"
                  >
                    Code of Conduct
                  </Link>
                  <a
                    href="https://github.com/Qiskit/qiskit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-1 py-0.5"
                  >
                    Powered by Qiskit
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
