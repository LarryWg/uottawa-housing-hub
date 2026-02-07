import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const LeaseFAQ = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Lease FAQ (Ontario / Ottawa)
            </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Common questions students ask before signing. This is general info to help you
              spot issues—if you’re unsure, use the Lease Checker or get advice.
            </p>
          </div>
        </section>

        {/* Content */}
        <section>
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Fast red-flag scan</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>🚩 Missing unit address or landlord service address</li>
                  <li>🚩 “Non-refundable deposits” (beyond reasonable key deposit)</li>
                  <li>🚩 Huge late fees or “fines” for rules</li>
                  <li>🚩 Clauses saying landlord can enter anytime</li>
                  <li>🚩 Clauses that “waive your rights” or ban complaints</li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold">What to keep</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>✅ A copy of the signed lease</li>
                  <li>✅ Receipts for deposits/rent</li>
                  <li>✅ Screenshots of listing + messages</li>
                  <li>✅ Move-in photos / inspection notes</li>
                </ul>
              </div>
            </aside>

            {/* Main FAQ */}
            <div className="space-y-8 lg:col-span-2">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                  Do I have to use the Ontario Standard Lease?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  For many private residential rentals in Ontario, the Ontario Standard Lease is
                  the required form. If someone gives you a “custom” lease, it can be a warning sign—
                  at minimum, compare it carefully and make sure key details are clear.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">What deposits are normal?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  You’ll often see a last-month’s-rent deposit. Key/fob deposits can exist, but “damage
                  deposits,” “application fees,” or “non-refundable holding deposits” are common scam or
                  unfair patterns. Always insist on receipts.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">What should the lease clearly include?</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Full address + unit number</li>
                  <li>Start date, rent amount, when it’s due</li>
                  <li>What utilities/services are included vs paid by tenant</li>
                  <li>Rules about guests, roommates, subletting (if any)</li>
                  <li>How maintenance requests work</li>
                  <li>Landlord’s service address / contact details</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Can a landlord enter anytime?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  A clause saying “landlord can enter at any time without notice” is a major red flag.
                  Legit agreements should respect notice and reasonable entry rules. If you see this,
                  flag it and ask for the clause to be corrected.
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">What about “fines” for noise/guests/cleaning?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Be cautious of leases that try to add a bunch of fines (e.g., “$100 per guest” or
                  “$50/day late fee”). Even if written, it may not be enforceable—and it’s often used to
                  intimidate students. Your tool should flag these as “penalty / intimidation language.”
                </p>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">How do I avoid being scammed before I pay?</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Verify the exact unit address and who owns/manages it</li>
                  <li>See the unit in person or do a live video tour (not prerecorded)</li>
                  <li>Never feel rushed to send money “to secure the unit”</li>
                  <li>Use traceable payments and keep receipts</li>
                  <li>Be wary of requests for sensitive info (SIN, banking login, etc.)</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Use the Lease Checker</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  If you’re unsure, paste the lease text into the Lease Checker. It can highlight missing
                  details and suspicious clauses so you know what to ask before signing.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href="/lease-checker"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Go to Lease Checker
                  </a>
                  <a
                    href="/resources/student-housing-guide"
                    className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    Student Housing Guide
                  </a>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Disclaimer: This page is general information for a student project and is not legal advice.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LeaseFAQ;
