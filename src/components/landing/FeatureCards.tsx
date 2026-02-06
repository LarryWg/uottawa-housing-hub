import { Users, Map, FileSearch, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const features = [
  {
    icon: Users,
    title: "Roommate Matcher",
    description:
      "Swipe through compatible profiles based on lifestyle, budget, and preferences. Find your perfect living partner with our Tinder-style matching system.",
    link: "/roommate-finder",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Map,
    title: "Interactive Housing Map",
    description:
      "Explore apartments near campus with our AI-powered map. Search naturally like 'Show me 2BR under $1000 within 15 min walk' and find your ideal home.",
    link: "/housing-map",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: FileSearch,
    title: "Lease Checker",
    description:
      "Upload your lease and let our AI analyze it for red flags, hidden fees, and concerning terms. Understand your rights before you sign.",
    link: "/lease-checker",
    color: "from-amber-500 to-amber-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function FeatureCards() {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Everything You Need to Find Your Home
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Our platform combines smart matching, location insights, and AI analysis to make 
            finding housing as a student easier than ever.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={cardVariants}>
                <Card className="group relative h-full overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader className="pb-4">
                    <div
                      className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <Button asChild variant="ghost" className="group/btn p-0 h-auto font-medium text-primary hover:bg-transparent">
                      <Link to={feature.link} className="flex items-center gap-2">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
