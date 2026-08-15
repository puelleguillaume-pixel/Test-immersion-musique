import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { SoundToggle } from "@/components/layout/SoundToggle";
import { PageTransition } from "@/components/layout/PageTransition";
import { CartDrawer } from "@/components/catalogue/CartDrawer";

const Home = lazy(() => import("@/pages/Home"));
const Catalogue = lazy(() => import("@/pages/Catalogue"));
const Collabs = lazy(() => import("@/pages/Collabs"));
const Univers = lazy(() => import("@/pages/Univers"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ivoire/20 border-t-cuir-bright" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen">
      <div className="grain-overlay" />
      <CustomCursor />
      <SoundToggle />
      <CartDrawer />
      <Navbar />

      <main className="pt-[76px]">
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/collabs" element={<Collabs />} />
                <Route path="/univers" element={<Univers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
