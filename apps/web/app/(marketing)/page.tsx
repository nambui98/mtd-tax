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
    const data = await fetch('http://localhost:8000/api/v1/users');
    const json = await data.json();
    const users: User[] = json.data;
    console.log('====================================');
    console.log(json.data);
    console.log('====================================');
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
