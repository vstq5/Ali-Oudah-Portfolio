import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import WorkedWith from '@/components/WorkedWith';
import ToolsRing from '@/components/ToolsRing';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WorkedWith />
        <ToolsRing />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;
