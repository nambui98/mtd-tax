import { Button } from '@workspace/ui/components/button';
import { User } from '@workspace/database';
import Cta from './components/cta';
import Navigation from './components/navigation';
import Hero from './components/hero';
import Features from './components/features';
import Socials from './components/socials';
import Pricing from './components/pricing';
import Faq from './components/faq';
import Support from './components/support';
import Footer from './components/footer';

export default async function Page() {
    return (
        <>
            <Navigation />
            <Hero />
            <Features />
            <Socials />
            <Pricing />
            <Cta />
            <Faq />
            <Support />
            <Footer />
        </>
    );
}
