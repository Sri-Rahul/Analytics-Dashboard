"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AuroraText } from "@/components/ui/aurora-text";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  ExternalLink,
  Heart
} from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Dashboard", href: "/" },
      { name: "Analytics", href: "/analytics" },
      { name: "Reports", href: "/reports" },
      { name: "Integrations", href: "/integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "API Reference", href: "/api" },
      { name: "Community", href: "/community" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Security", href: "/security" },
    ],
  },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: Twitter,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:contact@admybrand.com",
    icon: Mail,
  },
];

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn(
      "relative bg-gradient-to-b from-background to-neutral-50 dark:to-neutral-950 border-t border-border/50",
      className
    )}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link 
                href="/" 
                className="flex items-center space-x-3 group"
                aria-label="ADmyBRAND Insights - Go to homepage"
              >
                <div className="relative">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <BarChart3 className="h-6 w-6" />
                  </motion.div>
                  <BorderBeam
                    size={60}
                    duration={6}
                    borderWidth={1}
                    colorFrom="var(--primary)"
                    colorTo="var(--primary)"
                    className="opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  />
                </div>
                <div>
                  <AuroraText 
                    className="text-xl font-bold tracking-tight"
                    colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"]}
                  >
                    ADmyBRAND
                  </AuroraText>
                  <p className="text-sm text-muted-foreground">
                    Professional Analytics
                  </p>
                </div>
              </Link>
            </motion.div>

            <motion.p 
              className="text-sm text-muted-foreground leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Advanced analytics dashboard providing real-time insights and comprehensive data visualization for modern businesses.
            </motion.p>

            {/* Contact Info */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg",
                      "bg-neutral-100 dark:bg-neutral-800 hover:bg-primary hover:text-primary-foreground",
                      "transition-all duration-200 group"
                    )}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + sectionIndex * 0.1 + linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm text-muted-foreground hover:text-primary",
                        "transition-colors duration-200 flex items-center group"
                      )}
                    >
                      <span>{link.name}</span>
                      {link.href.startsWith("http") && (
                        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          className="mt-12 pt-8 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <h3 className="text-lg font-semibold mb-2">
              Stay updated with our latest features
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified about new dashboard features and analytics insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg border border-border",
                  "bg-background/50 backdrop-blur-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                  "transition-all duration-200"
                )}
              />
              <button
                className="px-6 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-border/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2025 Rahul. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Heart className="h-4 w-4 text-red-500 fill-current" />
              </motion.div>
              <span>using Magic UI & Next.js</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
