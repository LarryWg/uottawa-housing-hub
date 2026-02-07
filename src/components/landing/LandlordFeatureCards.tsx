import { LayoutList, Map, FileSearch, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const landlordFeatures = [
  {
    icon: LayoutList,
    title: "My Listings",
    description:
      "Add, edit, and manage your rental properties. Your listings appear on the Housing Map where students browse available homes near campus.",
    link: "/my-listings",
    color: "from-primary to-primary/80",
  },
  {
    icon: Map,
    title: "Housing Map",
    description:
      "See where your properties appear alongside campus. Students use the map to find apartments by location, price, and distance to uOttawa.",
    link: "/housing-map",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: FileSearch,
    title: "Lease Checker",
    description:
      "Use our AI lease analyzer to review tenant agreements or draft terms. Understand common clauses and protect your interests.",
    link: "/lease-checker",
    color: "from-amber-500 to-amber-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function LandlordFeatureCards() {
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
            Tools for Landlords
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to list properties, reach students, and manage your rentals
            in the uOttawa area.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {landlordFeatures.map((feature) => {
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
                    <Button asChild variant="ghost" className="group/btn h-auto p-0 font-medium text-primary hover:bg-transparent">
                      <Link to={feature.link} className="flex items-center gap-2">
                        Open
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
