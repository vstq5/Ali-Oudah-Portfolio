import { useEffect, useState, useCallback } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSplineReady, setIsSplineReady] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('is-loading', isLoading);
    return () => {
      document.body.classList.remove('is-loading');
    };
  }, [isLoading]);

  const handleLoadComplete = useCallback(() => {
    setIsLoading(false);

    // Spline (iframe) can mis-measure while the preloader covers the page.
    // Nudge a resize after the main content becomes visible to stabilize layout.
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    });
  }, []);

  return (
    <>
      {/* Preloader */}
      {isLoading && (
        <Preloader
          onComplete={handleLoadComplete}
          canComplete={isSplineReady}
          maxWaitMs={12000}
        />
      )}

      {/* Main content */}
      <div
        className={`transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Navbar />
        <main>
          <Hero introReady={!isLoading} onSplineReady={() => setIsSplineReady(true)} />
          <About />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
