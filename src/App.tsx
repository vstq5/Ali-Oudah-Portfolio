import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ReactLenis } from 'lenis/react';
import gsap from 'gsap';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const lenisRef = useRef<any>(null);

  // Synchronize Lenis with GSAP's internal ticker to prevent double-paints during heavy scroll
  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // Disable GSAP's lag smoothing to avoid jumps during scroll
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  // Disable hover effects while scrolling for massive performance boost
  useEffect(() => {
    let timer: number;
    const enableHover = () => document.body.classList.remove('disable-hover');

    const onScroll = () => {
      document.body.classList.add('disable-hover');
      clearTimeout(timer);
      timer = setTimeout(enableHover, 150);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ smoothWheel: true, duration: 1.2 }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div aria-hidden="true" className="noise-overlay" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Analytics />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ReactLenis>
  );
};

export default App;
