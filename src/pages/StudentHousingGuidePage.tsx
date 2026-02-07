import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const StudentHousingGuide = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Student Housing Guide (Ottawa)
            </h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              A practical checklist for finding a place, avoiding scams, and understanding what to look for
              before you sign.
            </p>
          </div>
        </section>

        {/* Content */}
        <section>
          <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3">
            {/* Quick checklist */}
            <aside className="lg:col-span-1">
              <div className="rounded-xl border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Quick checklist</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>✅ See the unit in-person (or verify a live video tour).</li>
                  <li>✅ Confirm the address + who owns/manages it.</li>
                  <li>✅ Use the Ontario Standard Lease (if applicable).</li>
                  <li>✅ Get everything in writing (rent, utilities, move-in).</li>
                  <li>✅ Never pay “application/holding” fees you can’t verify.</li>
                </ul>
              </div>

              <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Emergency red flags</h2>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>🚩 “Pay right now or you lose it.”</li>
                  <li>🚩 Refuses to show the unit or give a real address.</li>
                  <li>🚩 Asks for sensitive info early (SIN, banking logins).</li>
                  <li>🚩 Wants unusual payment methods or changing instructions.</li>
                  <li>🚩 Lease has penalties/fines for everything or waives rights.</li>
                </ul>
              </div>
            </aside>

            {/* Main guide */}
            <div className="space-y-8 lg:col-span-2">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">1) Before you message a landlord</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Set your budget (rent + utilities + internet + transit).</li>
                  <li>Decide must-haves: furnished, laundry, pets, parking, distance to campus.</li>
                  <li>Search the address online and compare listing photos across sites.</li>
                  <li>Be cautious of prices that are way below market for the area.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">2) Viewing the unit</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Verify the unit matches the listing (layout, windows, appliances).</li>
                  <li>Test water pressure, locks, smoke/CO alarms, and look for pests/mould.</li>
                  <li>Ask what’s included: heat/hydro/water/internet, and get it in writing.</li>
                  <li>Take photos/video during the viewing.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">3) Lease basics to confirm</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Exact address + unit number, start date, monthly rent, due date.</li>
                  <li>Deposit details (what it is, when it applies, refund rules).</li>
                  <li>Rules about guests/roommates/subletting and any building policies.</li>
                  <li>Maintenance responsibilities and how to request repairs.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">4) Scam-safe payment habits</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Pay only after verifying the unit + the landlord/manager identity.</li>
                  <li>Get written receipts for deposits and rent.</li>
                  <li>Don’t send sensitive documents unless you trust the recipient.</li>
                  <li>Keep a paper trail: emails, messages, screenshots, and documents.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">5) Move-in day</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Do a move-in inspection and document any damage.</li>
                  <li>Confirm keys/fobs work and you have mailbox access.</li>
                  <li>Save emergency contacts and maintenance request process.</li>
                </ul>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Want to automate this?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Use the Lease Checker to scan for unusual clauses, missing info, and pressure tactics.
                </p>
                <div className="mt-4">
                  <a
                    href="/lease-checker"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Go to Lease Checker
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

export default StudentHousingGuide;
