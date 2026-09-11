import Hero from "../sections/Hero";
import Features from "../sections/Features";
import WhoItsFor from "../sections/WhoItsFor";
import MobileApps from "../sections/MobileApps";
import Stats from "../sections/Stats";
import Pricing from "../sections/Pricing";
import ComingSoon from "../sections/ComingSoon";
import About from "../sections/About";
import FAQ from "../sections/FAQ";
import ContactTeaser from "../sections/ContactTeaser";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <WhoItsFor />
      <MobileApps />
      <Stats />
      <Pricing />
      <ComingSoon />
      <About />
      <FAQ />
      <ContactTeaser />
    </>
  );
}
