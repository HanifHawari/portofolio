"use client";
import { useState } from "react";

import Navigasi from "@/components/umum/Navigasi";
import BagianHero from "@/components/bagian/BagianHero";
import BagianTentang from "@/components/bagian/BagianTentang";
import BagianProyek from "@/components/bagian/BagianProyek";
import BagianPerjalanan from "@/components/bagian/BagianPerjalanan";
import BagianPencapaian from "@/components/bagian/BagianPencapaian";
import DesaGeist from "@/components/animasi/DesaGeist";
import BagianKontak from "@/components/bagian/BagianKontak";
import BagianFooter from "@/components/bagian/BagianFooter";
import RobotBerjalan from "@/components/animasi/RobotBerjalan";
import Preloader from "@/components/umum/Preloader";

export default function Home() {
  const [isPreloaderDone, setIsPreloaderDone] = useState(false);

  return (
    <main className="min-h-screen" style={{ background: "var(--background)", paddingBottom: 64 }}>
      <Preloader onComplete={() => setIsPreloaderDone(true)} />
      <Navigasi />
      <BagianHero isPreloaderDone={isPreloaderDone} />
      <BagianTentang />
      <BagianProyek />
      <BagianPencapaian />
      <BagianPerjalanan />
      <DesaGeist />
      <BagianKontak />
      <BagianFooter />
      <RobotBerjalan />
    </main>
  );
}
