import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const RoommateTips = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Roommate Tips
            </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              A quick guide to finding compatible roommates, setting expectations early,
              and avoiding common conflicts.
            </p>
          </div>
        </section>

        {/* Content */}
        <section>
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Before you commit</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>✅ Meet (or video call) at least once.</li>
                  <li>✅ Talk schedule: sleep, classes, work.</li>
                  <li>✅ Agree on budget + how to split costs.</li>
                  <li>✅ Discuss guests, parties, and quiet hours.</li>
                  <li>✅ Align on cleanliness expectations.</li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Compatibility questions</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• Early bird or night owl?</li>
                  <li>• Study environment: quiet vs social?</li>
                  <li>• Cooking habits and shared food?</li>
                  <li>• Substance use / vaping / smoking?</li>
                  <li>• Pets? Allergies?</li>
                </ul>
              </div>
            </aside>

            {/* Main tips */}
            <div className="space-y-8 lg:col-span-2">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">1) Talk money clearly</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Decide how rent is split (equal, by room size, etc.).</li>
                  <li>Agree on utilities: who pays, how you reimburse, due dates.</li>
                  <li>Plan for one-time costs: deposits, move-in supplies, furniture.</li>
                  <li>Pick a simple system (e.g., one person pays, others e-transfer monthly).</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">2) Set house rules (write them down)</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Quiet hours and guests (overnights, partners, parties).</li>
                  <li>Cleaning schedule: kitchen, bathroom, garbage/recycling.</li>
                  <li>Shared items: paper towels, cleaning supplies, spices, etc.</li>
                  <li>Food policy: shared vs labeled, fridge/freezer space.</li>
                </ul>
                <p className="mt-3 text-sm text-muted-foreground">
                  Tip: keep it simple—a 1-page “roommate agreement” prevents a lot of issues.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">3) Cleanliness expectations</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Be honest: are you tidy, average, or messy?</li>
                  <li>Define what “clean” means (dishes same day? weekly bathroom?).</li>
                  <li>Agree on how to handle mess conflicts—talk early, not after weeks.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">4) Communication (what to do when something’s off)</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Have a weekly 5-minute check-in at the start.</li>
                  <li>Use “I” statements: “I’m having trouble sleeping with noise at 1am.”</li>
                  <li>Be specific and propose a solution, not just a complaint.</li>
                  <li>Don’t use group chats to argue—talk in person if possible.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">5) Practical safety + logistics</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Decide on key handling (spares, lockouts, lost keys).</li>
                  <li>Share emergency contacts (optional but useful).</li>
                  <li>Clarify who is on the lease and how notices/repairs are handled.</li>
                  <li>Document move-in condition with photos for everyone.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Want help matching?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the Roommate Finder to compare preferences (sleep schedule, social level,
                  cleanliness, pets, etc.).
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/roommate-finder"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Go to Roommate Finder
                  </a>
                  <a
                    href="/my-matches"
                    className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    View My Matches
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RoommateTips;
