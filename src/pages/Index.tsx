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

    // Using a ResizeObserver to trigger a resize event when main content appears
    // This is more robust than a fixed timeout
    const observer = new ResizeObserver(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Observe the main element once it's visible
    const mainElement = document.querySelector('main');
    if (mainElement) {
      observer.observe(mainElement);

      // Clean up observer after a short delay once stable
      setTimeout(() => {
        observer.disconnect();
      }, 1000);
    }
  }, []);

  return (
    <>
      {/* Preloader */}
      {isLoading && (
        <Preloader
          onComplete={handleLoadComplete}
          canComplete={isSplineReady}
          maxWaitMs={20000}
        />
      )}

      {/* Main content */}
      <div
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'
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
