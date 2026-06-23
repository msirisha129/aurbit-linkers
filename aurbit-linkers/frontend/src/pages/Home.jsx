import Hero from '../components/Hero';
import ServiceCards from '../components/ServiceCards';
import AIFeaturePanel from '../components/AIFeaturePanel';
import FAQ from '../components/FAQ';
import CTABanner from '../components/CTABanner';

export default function Home({ onGetStarted, onLearnMore }) {
  return (
    <>
      <Hero onGetStarted={onGetStarted} />
      <ServiceCards onLearnMore={onLearnMore} />
      <AIFeaturePanel />
      <FAQ />
      <CTABanner onGetStarted={onGetStarted} />
    </>
  );
}
