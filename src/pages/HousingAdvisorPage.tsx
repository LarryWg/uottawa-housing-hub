import { useMemo, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type QuestionOption = {
  label: string;
  value: string;
};

type Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
};

type AnswerMap = Record<string, string>;

type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
};

type Neighborhood = {
  id: string;
  name: string;
  vibe: "quiet" | "balanced" | "lively";
  distance: "walk" | "bike" | "bus" | "far";
  budget: "low" | "mid" | "high";
  highlights: string[];
  cautions: string[];
};

const questions: Question[] = [
  {
    id: "budget",
    prompt: "What monthly rent range are you aiming for?",
    options: [
      { label: "Under $900", value: "low" },
      { label: "$900–$1200", value: "mid" },
      { label: "$1200+", value: "high" },
    ],
  },
  {
    id: "commute",
    prompt: "How do you want to commute to campus?",
    options: [
      { label: "Walk", value: "walk" },
      { label: "Bike", value: "bike" },
      { label: "Bus / LRT", value: "bus" },
      { label: "Drive", value: "drive" },
    ],
  },
  {
    id: "vibe",
    prompt: "What neighborhood vibe fits you best?",
    options: [
      { label: "Quiet and residential", value: "quiet" },
      { label: "Balanced", value: "balanced" },
      { label: "Lively / social", value: "lively" },
    ],
  },
  {
    id: "amenities",
    prompt: "What matters most nearby?",
    options: [
      { label: "Nightlife & restaurants", value: "nightlife" },
      { label: "Cafes & study spots", value: "cafes" },
      { label: "Parks & green space", value: "green" },
      { label: "Groceries & essentials", value: "essentials" },
    ],
  },
  {
    id: "roommates",
    prompt: "Are you open to roommates?",
    options: [
      { label: "Yes, roommates are fine", value: "roommates" },
      { label: "Prefer to live alone", value: "solo" },
    ],
  },
];

const neighborhoods: Neighborhood[] = [
  {
    id: "sandy-hill",
    name: "Sandy Hill",
    vibe: "lively",
    distance: "walk",
    budget: "mid",
    highlights: ["Closest to campus", "Student-heavy community", "Walkable to classes"],
    cautions: ["Can be noisy on weekends"],
  },
  {
    id: "byward-market",
    name: "ByWard Market",
    vibe: "lively",
    distance: "walk",
    budget: "high",
    highlights: ["Nightlife and restaurants", "Walkable downtown living"],
    cautions: ["Higher rent and busier streets"],
  },
  {
    id: "centretown",
    name: "Centretown",
    vibe: "balanced",
    distance: "bus",
    budget: "mid",
    highlights: ["Good transit access", "Mix of apartments and houses"],
    cautions: ["Longer walk to campus"],
  },
  {
    id: "old-ottawa-east",
    name: "Old Ottawa East",
    vibe: "quiet",
    distance: "bike",
    budget: "mid",
    highlights: ["Parks and canal paths", "Quiet streets"],
    cautions: ["Fewer nightlife options"],
  },
  {
    id: "vanier",
    name: "Vanier",
    vibe: "quiet",
    distance: "bus",
    budget: "low",
    highlights: ["More affordable options", "Good bus connections"],
    cautions: ["Farther commute to campus"],
  },
  {
    id: "glebe",
    name: "The Glebe / Old Ottawa South",
    vibe: "balanced",
    distance: "bus",
    budget: "high",
    highlights: ["Charming streets and cafes", "Close to parks"],
    cautions: ["Higher rent prices"],
  },
];

const getScore = (answer: AnswerMap, neighborhood: Neighborhood) => {
  let score = 0;

  if (answer.budget === neighborhood.budget) score += 3;
  if (answer.budget === "low" && neighborhood.budget === "mid") score += 1;
  if (answer.budget === "high" && neighborhood.budget === "mid") score += 1;

  if (answer.commute === "walk" && neighborhood.distance === "walk") score += 3;
  if (answer.commute === "bike" && neighborhood.distance === "bike") score += 3;
  if (answer.commute === "bus" && neighborhood.distance === "bus") score += 3;
  if (answer.commute === "drive") score += 1;

  if (answer.vibe === neighborhood.vibe) score += 3;
  if (answer.vibe === "balanced" && neighborhood.vibe !== "lively") score += 1;

  if (answer.amenities === "nightlife" && neighborhood.vibe === "lively") score += 2;
  if (answer.amenities === "cafes" && neighborhood.vibe !== "lively") score += 1;
  if (answer.amenities === "green" && neighborhood.vibe === "quiet") score += 2;
  if (answer.amenities === "essentials") score += 1;

  if (answer.roommates === "roommates" && neighborhood.budget !== "high") score += 1;
  if (answer.roommates === "solo" && neighborhood.budget === "high") score += 1;

  return score;
};

const buildSummary = (answer: AnswerMap) => {
  const budgetLabel = questions[0].options.find((opt) => opt.value === answer.budget)?.label;
  const commuteLabel = questions[1].options.find((opt) => opt.value === answer.commute)?.label;
  const vibeLabel = questions[2].options.find((opt) => opt.value === answer.vibe)?.label;
  const amenityLabel = questions[3].options.find((opt) => opt.value === answer.amenities)?.label;
  const roommateLabel = questions[4].options.find((opt) => opt.value === answer.roommates)?.label;

  return [
    `Budget: ${budgetLabel ?? "N/A"}`,
    `Commute: ${commuteLabel ?? "N/A"}`,
    `Vibe: ${vibeLabel ?? "N/A"}`,
    `Amenities: ${amenityLabel ?? "N/A"}`,
    `Roommates: ${roommateLabel ?? "N/A"}`,
  ];
};

const HousingAdvisorPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "bot",
      text: "Hi! I’m the local-only Housing Advisor. Answer a few questions and I’ll suggest the best uOttawa neighborhoods for you.",
    },
    { id: "q-0", role: "bot", text: questions[0].prompt },
  ]);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[step];

  const recommendations = useMemo(() => {
    if (!showResult) return [];
    const scored = neighborhoods
      .map((neighborhood) => ({
        ...neighborhood,
        score: getScore(answers, neighborhood),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 2);
  }, [answers, showResult]);

  const summary = useMemo(() => buildSummary(answers), [answers]);

  const handleAnswer = (option: QuestionOption) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: option.value };
    const nextStep = step + 1;

    setAnswers(nextAnswers);
    setMessages((prev) => [
      ...prev,
      { id: `a-${currentQuestion.id}`, role: "user", text: option.label },
    ]);

    if (nextStep < questions.length) {
      setStep(nextStep);
      setMessages((prev) => [
        ...prev,
        { id: `q-${nextStep}`, role: "bot", text: questions[nextStep].prompt },
      ]);
    } else {
      setShowResult(true);
      setMessages((prev) => [
        ...prev,
        {
          id: "result",
          role: "bot",
          text: "Here are your top neighborhood picks based on your answers:",
        },
      ]);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
    setMessages([
      {
        id: "intro",
        role: "bot",
        text: "Hi! I’m the local-only Housing Advisor. Answer a few questions and I’ll suggest the best uOttawa neighborhoods for you.",
      },
      { id: "q-0", role: "bot", text: questions[0].prompt },
    ]);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <div className="border-b bg-muted/30 px-4 py-6">
          <div className="container">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Housing Advisor (Local Demo)</h1>
              <Badge variant="secondary">No API calls</Badge>
            </div>
            <p className="mt-2 text-muted-foreground">
              This demo runs fully in your browser and does not send data anywhere.
            </p>
          </div>
        </div>

        <div className="container flex flex-1 flex-col gap-6 py-8 lg:flex-row">
          <section className="flex-1 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border bg-background"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {!showResult && currentQuestion && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">Choose one</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option.value}
                      variant="secondary"
                      onClick={() => handleAnswer(option)}
                      className="justify-start"
                    >
                      {option.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {showResult && (
              <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                Start over
              </Button>
            )}
          </section>

          <aside className="w-full space-y-4 lg:w-96">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {summary.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </CardContent>
            </Card>

            {showResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top picks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-base font-semibold">{rec.name}</div>
                        <Badge variant="outline">{rec.vibe}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {rec.highlights.join(" • ")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Watch for: {rec.cautions.join(" • ")}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HousingAdvisorPage;
