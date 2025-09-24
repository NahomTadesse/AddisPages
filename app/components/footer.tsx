"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Mountain,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
  Send,
  Plane,
  Bed,
  Camera,
  TreePine,
  Info,
  Heart,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    alert("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  const footerLinks = {
    destinations: [
      { name: "World Heritage Sites", href: "/destinations/heritage" },
      { name: "Lalibela Rock Churches", href: "/places/lalibela" },
      { name: "Simien Mountains", href: "/places/simien" },
      { name: "Lake Tana", href: "/places/lake-tana" },
      { name: "Gondar Castles", href: "/places/gondar" },
      { name: "Blue Nile Falls", href: "/places/blue-nile-falls" },
      { name: "National Parks", href: "/destinations/parks" },
      { name: "Religious Sites", href: "/destinations/religious" },
    ],
    planning: [
      { name: "Getting Here", href: "/travel/getting-here" },
      { name: "Getting Around", href: "/travel/getting-around" },
      { name: "When to Visit", href: "/travel/when-to-visit" },
      { name: "Travel Tips", href: "/travel/tips" },
      { name: "Itineraries", href: "/travel/itineraries" },
      { name: "Safety & Health", href: "/travel/safety" },
      { name: "Visa Information", href: "/travel/visa" },
      { name: "Weather", href: "/travel/weather" },
    ],
    accommodation: [
      { name: "Hotels & Resorts", href: "/accommodation/hotels" },
      { name: "Eco Lodges", href: "/accommodation/eco" },
      { name: "Mountain Lodges", href: "/accommodation/mountain" },
      { name: "Budget Options", href: "/accommodation/budget" },
      { name: "Luxury Hotels", href: "/accommodation/luxury" },
      { name: "Community Stays", href: "/accommodation/community" },
      { name: "Camping", href: "/accommodation/camping" },
    ],
    activities: [
      { name: "Trekking & Hiking", href: "/things/trekking" },
      { name: "Cultural Tours", href: "/things/culture" },
      { name: "Wildlife Watching", href: "/things/wildlife" },
      { name: "Photography Tours", href: "/things/photography" },
      { name: "Boat Trips", href: "/things/boat-trips" },
      { name: "Horseback Riding", href: "/things/horseback" },
      { name: "Bird Watching", href: "/things/birding" },
      { name: "Community Tourism", href: "/things/community" },
    ],
    services: [
      { name: "Tourist Information", href: "/services/info" },
      { name: "Tour Operators", href: "/services/operators" },
      { name: "Transport Services", href: "/services/transport" },
      { name: "Guides & Interpreters", href: "/services/guides" },
      { name: "Equipment Rental", href: "/services/equipment" },
      { name: "Emergency Services", href: "/services/emergency" },
    ],
    aboutUs: [
      { name: "About Amhara", href: "/about/region" },
      { name: "Tourism Bureau", href: "/about/bureau" },
      { name: "Our Mission", href: "/about/mission" },
      { name: "Sustainability", href: "/about/sustainability" },
      { name: "Partners", href: "/about/partners" },
      { name: "Contact Us", href: "/contact" },
      { name: "Press Center", href: "/press" },
      { name: "Careers", href: "/careers" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
              <p className="text-emerald-50">
                Get the latest updates on events, new attractions, and travel
                tips for Amhara
              </p>
            </div>
            <div className="w-full md:w-auto">
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-gray-900 border-0"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Mountain className="h-8 w-8 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-xl font-bold">Visit Amhara</span>
                  <span className="text-sm text-gray-400">
                    Ethiopia&apos;s Historic Heart
                  </span>
                </div>
              </Link>
              <p className="text-gray-300 mb-6 max-w-md">
                Discover the wonders of Amhara region - from the ancient
                rock-hewn churches of Lalibela to the dramatic landscapes of the
                Simien Mountains. Experience Ethiopia&apos;s rich history,
                vibrant culture, and natural beauty.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">+251 11 234 5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">hello@visitamhara.gov.et</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm">Amhara Region, Ethiopia</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-emerald-400"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-emerald-400"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-emerald-400"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-emerald-400"
                >
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Destinations */}
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Camera className="h-4 w-4 mr-2 text-emerald-400" />
                Destinations
              </h4>
              <ul className="space-y-2">
                {footerLinks.destinations.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Plan Your Trip */}
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Plane className="h-4 w-4 mr-2 text-emerald-400" />
                Plan Your Trip
              </h4>
              <ul className="space-y-2">
                {footerLinks.planning.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accommodation */}
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Bed className="h-4 w-4 mr-2 text-emerald-400" />
                Accommodation
              </h4>
              <ul className="space-y-2">
                {footerLinks.accommodation.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities */}
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <TreePine className="h-4 w-4 mr-2 text-emerald-400" />
                Things to Do
              </h4>
              <ul className="space-y-2">
                {footerLinks.activities.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Services */}
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Info className="h-4 w-4 mr-2 text-emerald-400" />
                Services
              </h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-emerald-400" />
                About Us
              </h4>
              <ul className="space-y-2">
                {footerLinks.aboutUs.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Globe className="h-4 w-4 mr-2 text-emerald-400" />
                Quick Info
              </h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <strong className="text-white">Best Time to Visit:</strong>
                  <p>October to March (dry season)</p>
                </div>
                <div>
                  <strong className="text-white">Time Zone:</strong>
                  <p>East Africa Time (EAT) - UTC+3</p>
                </div>
                <div>
                  <strong className="text-white">Currency:</strong>
                  <p>Ethiopian Birr (ETB)</p>
                </div>
                <div>
                  <strong className="text-white">Languages:</strong>
                  <p>Amharic, English</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              <p>© 2025 Amhara Region Tourism Bureau. All rights reserved.</p>
              <p className="mt-1">
                Powered by Ministry of Tourism - Ethiopia, Land of Origins
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                href="/accessibility"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Accessibility
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ethiopian Tourism Badge */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <span>Proudly promoting</span>
            <span className="text-yellow-400 font-semibold">
              Ethiopia - Land of Origins
            </span>
            <span>🇪🇹</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
