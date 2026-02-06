import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const campusImages = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/f7/UOttawa-Tabaret_Hall-2008-05-05.jpg",
    alt: "Tabaret Hall at the University of Ottawa",
    label: "Tabaret Hall",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0c/UOttawa-SITE_Building.jpg",
    alt: "SITE Building at the University of Ottawa",
    label: "SITE Building",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d3/UOttawa-Sports_Complex.jpg",
    alt: "Sports Complex at the University of Ottawa",
    label: "Sports Complex",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${campusImages[0].src})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/90 via-background/80 to-background"
        aria-hidden="true"
      />

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/90 px-4 py-2 text-sm font-medium shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Made for UOttawa Students</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Roommate & Housing
            </span>{" "}
            at UOttawa
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Connect with compatible roommates, explore nearby apartments on our interactive map,
            and get AI-powered lease analysis — all in one place built for campus life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link to="/roommate-finder">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <Link to="/housing-map">Explore Housing</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 text-left"
          >
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Campus snapshots
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {campusImages.map((image) => (
                <div
                  key={image.label}
                  className="group relative overflow-hidden rounded-2xl border bg-background/80 shadow-sm"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                    <div className="text-sm font-semibold text-white">{image.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
