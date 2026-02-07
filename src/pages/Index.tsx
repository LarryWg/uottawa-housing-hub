import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureCards } from "@/components/landing/FeatureCards";
import { LandlordHeroSection } from "@/components/landing/LandlordHeroSection";
import { LandlordFeatureCards } from "@/components/landing/LandlordFeatureCards";
import { StatsSection } from "@/components/landing/StatsSection";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { isLandlord, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Skeleton className="h-64 w-full max-w-4xl" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {isLandlord ? (
          <>
            <LandlordHeroSection />
            <LandlordFeatureCards />
            <StatsSection />
          </>
        ) : (
          <>
            <HeroSection />
            <FeatureCards />
            <StatsSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
