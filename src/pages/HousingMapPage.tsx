import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Map } from "lucide-react";

const HousingMapPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Map className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Housing Map</h1>
          <p className="text-muted-foreground">Coming soon - explore apartments near UOttawa!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HousingMapPage;
