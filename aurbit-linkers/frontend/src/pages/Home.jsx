import Hero from '../components/Hero';
import ChatSupportSection from '../components/ChatSupportSection';
import ServiceCards from '../components/ServiceCards';
import AIFeaturePanel from '../components/AIFeaturePanel';
import FAQ from '../components/FAQ';
import CTABanner from '../components/CTABanner';

export default function Home({ onGetStarted, onLearnMore }) {
  return (
    <>
      <Hero onGetStarted={onGetStarted} />
      <ChatSupportSection />
      <ServiceCards onLearnMore={onLearnMore} />
      <AIFeaturePanel />
      <FAQ />
      <CTABanner onGetStarted={onGetStarted} />
    </>
  );
}
