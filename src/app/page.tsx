import Navigasi from "@/components/umum/Navigasi";
import BagianHero from "@/components/bagian/BagianHero";
import BagianTentang from "@/components/bagian/BagianTentang";
import BagianProyek from "@/components/bagian/BagianProyek";
import BagianPerjalanan from "@/components/bagian/BagianPerjalanan";

import DesaGeist from "@/components/animasi/DesaGeist";
import BagianKontak from "@/components/bagian/BagianKontak";
import BagianFooter from "@/components/bagian/BagianFooter";
import PreloaderWrapper from "@/components/animasi/PreloaderWrapper";

export default function Home() {
  return (
    <PreloaderWrapper>
      <main className="min-h-screen" style={{ background: "var(--background)" }}>
        <Navigasi />
        <BagianHero />
        <BagianTentang />
        <BagianProyek />

        <BagianPerjalanan />
        <DesaGeist />
        <BagianKontak />
        <BagianFooter />
      </main>
    </PreloaderWrapper>
  );
}
