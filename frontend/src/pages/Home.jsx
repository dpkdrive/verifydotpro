import AboutSection from "../components/home-components/AboutSection";
// import ContactSection from "../components/home-components/ContactSection";
import HeroSection from "../components/home-components/Hero";
import ResearchAreas from "../components/home-components/ResearchAreas";
import WhyVerifyPro from "../components/home-components/WhyVerifyPro";

export default function Home() {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <ResearchAreas />
            <WhyVerifyPro />
            {/* <ContactSection /> */}
        </>
    );
}