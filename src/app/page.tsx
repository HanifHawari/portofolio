"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import JourneySection from "@/components/JourneySection";
import GeistVillage from "@/components/GeistVillage";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WalkingRobotBar from "@/components/WalkingRobotBar";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--background)", paddingBottom: 64 }}>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <JourneySection />
      <GeistVillage />
      <ContactSection />
      <Footer />
      <WalkingRobotBar />
    </main>
  );
}
