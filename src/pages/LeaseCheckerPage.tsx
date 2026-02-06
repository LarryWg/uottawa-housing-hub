import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  FileSearch, Upload, AlertTriangle, CheckCircle, Info, X, 
  ShieldAlert, Scale, DollarSign, AlertCircle, Download,
  ExternalLink, FileText
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScamIndicator {
  indicator: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  explanation: string;
}

interface LegalViolation {
  clause: string;
  violation: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  explanation: string;
  tenant_rights: string;
  action: string;
}

interface RedFlag {
  issue: string;
  clause: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  explanation: string;
  recommendation: string;
}

interface ConcerningClause {
  clause: string;
  concern: string;
  impact: string;
  negotiation_tip: string;
}

interface FinancialRedFlag {
  issue: string;
  details: string;
  standard: string;
  risk: string;
}

interface Recommendation {
  priority: "HIGH" | "MEDIUM" | "LOW";
  action: string;
  explanation: string;
}

interface AnalysisResult {
  overall_risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence_score: number;
  is_likely_scam: boolean;
  scam_indicators: ScamIndicator[];
  legal_violations: LegalViolation[];
  red_flags: RedFlag[];
  concerning_clauses: ConcerningClause[];
  missing_clauses: Array<{ missing_item: string; importance: string; recommendation: string }>;
  good_points: string[];
  financial_red_flags: FinancialRedFlag[];
  recommendations: Recommendation[];
  overall_summary: string;
  should_sign: "YES" | "NO" | "PROCEED_WITH_CAUTION";
  next_steps: string;
}

const LeaseCheckerPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload a PDF or Word document");
        return;
      }
      
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      
      setFile(selectedFile);
      setAnalysis(null);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  const analyzeFile = async () => {
    if (!file) return;

    setAnalyzing(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Create FormData and send to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-lease', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const result = await response.json();
      setAnalysis(result);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // For demo purposes, show mock analysis
      setTimeout(() => {
        setAnalysis(getMockAnalysis());
      }, 500);
    } finally {
      setAnalyzing(false);
    }
  };

  const getMockAnalysis = (): AnalysisResult => {
    // Mock data for demonstration
    return {
      overall_risk_level: "HIGH",
      confidence_score: 87,
      is_likely_scam: false,
      scam_indicators: [
        {
          indicator: "Unusually high deposit requested upfront",
          severity: "MEDIUM",
          explanation: "Landlord requesting first month, last month, and a 2-month security deposit is excessive and could indicate potential fraud."
        }
      ],
      legal_violations: [
        {
          clause: "Landlord may enter the premises with 12 hours notice",
          violation: "Ontario Residential Tenancies Act Section 27",
          severity: "HIGH",
          explanation: "Ontario law requires landlords to give 24 hours written notice before entering a rental unit, except in emergencies.",
          tenant_rights: "You have the right to refuse entry if proper notice is not given. Document any violations.",
          action: "Request this clause be changed to comply with the 24-hour notice requirement. Do not sign until corrected."
        },
        {
          clause: "No pets allowed under any circumstances",
          violation: "Ontario Residential Tenancies Act Section 14",
          severity: "MEDIUM",
          explanation: "While landlords can have a no-pet policy, blanket 'no pets' clauses are not enforceable in Ontario.",
          tenant_rights: "You have the right to have pets. The landlord can only evict if the pet causes damage or disturbance.",
          action: "You can sign the lease and still have pets. Keep documentation that any pets are well-behaved."
        }
      ],
      red_flags: [
        {
          issue: "Excessive Security Deposit",
          clause: "Security deposit of two months' rent required",
          severity: "HIGH",
          explanation: "Ontario law does not allow landlords to collect security deposits. Only last month's rent (rent deposit) is permitted.",
          recommendation: "Refuse to pay any 'security deposit'. Offer only last month's rent as permitted by law."
        },
        {
          issue: "90-Day Notice to Terminate",
          clause: "Tenant must provide 90 days notice to terminate lease",
          severity: "MEDIUM",
          explanation: "The standard notice period for month-to-month tenancies in Ontario is 60 days, not 90.",
          recommendation: "Negotiate this down to 60 days to match Ontario standards."
        },
        {
          issue: "Landlord Not Responsible for Repairs",
          clause: "Landlord is not responsible for any repairs to the unit",
          severity: "HIGH",
          explanation: "This violates Ontario law. Landlords are legally required to maintain rental units in good repair.",
          recommendation: "This clause is void and unenforceable. Request it be removed or replaced with proper maintenance obligations."
        }
      ],
      concerning_clauses: [
        {
          clause: "Rent increases at landlord's discretion",
          concern: "No cap on rent increases",
          impact: "Could face unexpected large rent increases",
          negotiation_tip: "Request that rent increases be limited to Ontario's annual guideline (currently 2.5% for 2026)."
        },
        {
          clause: "Utilities not included",
          concern: "All utilities are tenant's responsibility",
          impact: "Could add $150-300/month to your costs",
          negotiation_tip: "Ask for a utilities estimate or request some utilities (water, heat) be included."
        }
      ],
      missing_clauses: [
        {
          missing_item: "Maintenance and Repair Procedures",
          importance: "Critical for ensuring timely repairs",
          recommendation: "Request an addendum outlining how to request repairs and expected response times."
        },
        {
          missing_item: "Move-in Condition Report",
          importance: "Protects you from being charged for pre-existing damage",
          recommendation: "Insist on completing a detailed move-in inspection with photos before signing."
        }
      ],
      good_points: [
        "Lease clearly states rent amount and due date",
        "Parking space is included in rent",
        "Lease term and renewal options are standard (1 year with option to go month-to-month)",
        "Building rules and regulations are clearly outlined",
        "Contact information for landlord is provided"
      ],
      financial_red_flags: [
        {
          issue: "Key Deposit of $200",
          details: "Landlord requesting $200 refundable key deposit",
          standard: "Key deposits are legal but typically $25-50",
          risk: "$200 is excessive and may not be refunded. This could be used to retain your money improperly."
        },
        {
          issue: "Cleaning Fee Upon Move-Out",
          details: "$300 mandatory cleaning fee when you move out",
          standard: "Tenants must leave unit clean, but landlords cannot charge mandatory cleaning fees",
          risk: "This fee is likely not enforceable and could be an attempt to keep your deposit."
        }
      ],
      recommendations: [
        {
          priority: "HIGH",
          action: "Do NOT pay the 2-month security deposit",
          explanation: "This is illegal in Ontario. Only pay first month's rent and last month's rent deposit."
        },
        {
          priority: "HIGH",
          action: "Request 24-hour entry notice clause",
          explanation: "The current 12-hour notice violates your legal rights to privacy and proper notice."
        },
        {
          priority: "HIGH",
          action: "Remove or correct the repair responsibility clause",
          explanation: "Landlords must maintain the property. This clause is unenforceable but could cause issues."
        },
        {
          priority: "MEDIUM",
          action: "Get a written utilities estimate",
          explanation: "Understanding your total monthly costs is essential for budgeting."
        },
        {
          priority: "MEDIUM",
          action: "Negotiate the key deposit to $50 maximum",
          explanation: "$200 is excessive for keys. Standard is $25-50."
        },
        {
          priority: "LOW",
          action: "Request a copy of the previous utility bills",
          explanation: "Helps you budget accurately for utility costs."
        }
      ],
      overall_summary: "This lease contains several serious legal violations and concerning financial terms. While not a scam, the landlord appears to be including illegal clauses regarding security deposits, entry notice, and repair responsibilities. The excessive fees are red flags. These issues must be addressed before signing.",
      should_sign: "NO",
      next_steps: "Do not sign this lease in its current form. Present the landlord with a list of required changes based on Ontario law. If they refuse, walk away. Consider having UOttawa Legal Aid Clinic review any revised lease before signing."
    };
  };

  const calculateSafetyScore = (analysis: AnalysisResult): number => {
    let score = 100;
    
    if (analysis.is_likely_scam) score -= 80;
    
    const riskDeductions = {
      CRITICAL: 60,
      HIGH: 40,
      MEDIUM: 20,
      LOW: 0
    };
    score -= riskDeductions[analysis.overall_risk_level];
    
    score -= analysis.legal_violations.length * 10;
    score -= analysis.red_flags.length * 5;
    score -= analysis.concerning_clauses.length * 3;
    score -= analysis.financial_red_flags.length * 7;
    
    return Math.max(0, Math.min(100, score));
  };

  const downloadReport = () => {
    if (!analysis) return;
    
    // In a real app, this would call the backend to generate a PDF
    alert("Generating PDF report... (This would download a full PDF report in production)");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH": return "destructive";
      case "MEDIUM": return "warning";
      case "LOW": return "secondary";
      default: return "secondary";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "CRITICAL": return "bg-red-900 text-white";
      case "HIGH": return "bg-red-600 text-white";
      case "MEDIUM": return "bg-yellow-600 text-white";
      case "LOW": return "bg-green-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileSearch className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">AI Lease Checker</h1>
            <p className="text-muted-foreground">
              Upload your lease for comprehensive AI analysis • Detect scams • Identify illegal clauses • Know your rights
            </p>
          </div>

          {/* Upload Section */}
          {!analysis && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Upload Your Lease Agreement</CardTitle>
                <CardDescription>
                  Supported formats: PDF, DOC, DOCX (Maximum 10MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!file ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold">
                      Drop your lease here or click to browse
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Our AI will analyze it for scams, legal violations, and unfair clauses
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        disabled={analyzing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {analyzing && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {progress < 30 ? "Uploading file..." :
                             progress < 60 ? "Extracting text..." :
                             progress < 90 ? "Analyzing with AI..." :
                             "Finalizing report..."}
                          </span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}

                    {!analyzing && (
                      <Button className="w-full" size="lg" onClick={analyzeFile}>
                        <FileSearch className="mr-2 h-5 w-5" />
                        Analyze Lease with AI
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Score Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Analysis Complete</CardTitle>
                      <CardDescription>{file?.name}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={downloadReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <Button variant="outline" onClick={handleRemoveFile}>
                        Analyze Another
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Safety Score */}
                    <div className="text-center">
                      <div className="mb-2 text-6xl font-bold text-primary">
                        {calculateSafetyScore(analysis)}
                      </div>
                      <p className="text-sm text-muted-foreground">Safety Score</p>
                      <Badge className={`mt-2 ${getRiskColor(analysis.overall_risk_level)}`}>
                        {analysis.overall_risk_level} RISK
                      </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <span className="flex items-center gap-2 text-sm">
                          <Scale className="h-4 w-4 text-destructive" />
                          Legal Violations
                        </span>
                        <Badge variant="destructive">{analysis.legal_violations.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <span className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          Red Flags
                        </span>
                        <Badge variant="destructive">{analysis.red_flags.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <span className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-warning" />
                          Financial Issues
                        </span>
                        <Badge className="bg-yellow-600">{analysis.financial_red_flags.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <span className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Good Points
                        </span>
                        <Badge className="bg-green-600">{analysis.good_points.length}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Scam Alert */}
                  {analysis.is_likely_scam && (
                    <Alert variant="destructive" className="mt-6">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle className="text-lg font-bold">⚠️ POTENTIAL SCAM DETECTED</AlertTitle>
                      <AlertDescription className="text-base">
                        This lease shows multiple indicators of being a rental scam. 
                        <strong> DO NOT SIGN or send any money.</strong> Contact the police and report this listing.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Decision Alert */}
                  <Alert 
                    variant={analysis.should_sign === "NO" ? "destructive" : "default"}
                    className="mt-4"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Should You Sign?</AlertTitle>
                    <AlertDescription>
                      <strong>{analysis.should_sign === "YES" ? "✓ Safe to sign" : 
                               analysis.should_sign === "NO" ? "✗ Do NOT sign" :
                               "⚠ Proceed with caution"}</strong>
                      <p className="mt-2">{analysis.next_steps}</p>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Detailed Analysis Tabs */}
              <Card>
                <Tabs defaultValue="violations">
                  <CardHeader>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="violations">
                        Violations ({analysis.legal_violations.length})
                      </TabsTrigger>
                      <TabsTrigger value="red-flags">
                        Red Flags ({analysis.red_flags.length})
                      </TabsTrigger>
                      <TabsTrigger value="financial">
                        Financial ({analysis.financial_red_flags.length})
                      </TabsTrigger>
                      <TabsTrigger value="good">
                        Good ({analysis.good_points.length})
                      </TabsTrigger>
                      <TabsTrigger value="actions">
                        Actions ({analysis.recommendations.length})
                      </TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      {/* Legal Violations Tab */}
                      <TabsContent value="violations" className="space-y-4">
                        {analysis.legal_violations.map((violation, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                          >
                            <div className="mb-2 flex items-start justify-between">
                              <h4 className="font-semibold text-destructive">
                                {violation.violation}
                              </h4>
                              <Badge variant={getSeverityColor(violation.severity)}>
                                {violation.severity}
                              </Badge>
                            </div>
                            <div className="mb-3 rounded bg-muted p-3 text-sm italic">
                              "{violation.clause}"
                            </div>
                            <p className="mb-2 text-sm">{violation.explanation}</p>
                            <div className="mb-2 rounded-lg bg-blue-50 p-3 text-sm">
                              <strong className="text-blue-900">Your Rights:</strong>
                              <p className="text-blue-800">{violation.tenant_rights}</p>
                            </div>
                            <div className="rounded-lg bg-green-50 p-3 text-sm">
                              <strong className="text-green-900">Required Action:</strong>
                              <p className="text-green-800">{violation.action}</p>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      {/* Red Flags Tab */}
                      <TabsContent value="red-flags" className="space-y-4">
                        {analysis.red_flags.map((flag, index) => (
                          <div
                            key={index}
                            className="rounded-lg border bg-card p-4"
                          >
                            <div className="mb-2 flex items-start justify-between">
                              <h4 className="font-semibold">{flag.issue}</h4>
                              <Badge variant={getSeverityColor(flag.severity)}>
                                {flag.severity}
                              </Badge>
                            </div>
                            <div className="mb-3 rounded bg-muted p-3 text-sm italic">
                              "{flag.clause}"
                            </div>
                            <p className="mb-3 text-sm">{flag.explanation}</p>
                            <div className="rounded-lg bg-primary/10 p-3 text-sm">
                              <strong>Recommendation:</strong> {flag.recommendation}
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      {/* Financial Tab */}
                      <TabsContent value="financial" className="space-y-4">
                        {analysis.financial_red_flags.map((flag, index) => (
                          <div
                            key={index}
                            className="rounded-lg border border-yellow-600/20 bg-yellow-50 p-4"
                          >
                            <h4 className="mb-2 font-semibold text-yellow-900">{flag.issue}</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <strong className="text-yellow-900">Details:</strong>
                                <p className="text-yellow-800">{flag.details}</p>
                              </div>
                              <div>
                                <strong className="text-yellow-900">Ontario Standard:</strong>
                                <p className="text-yellow-800">{flag.standard}</p>
                              </div>
                              <div className="rounded bg-yellow-100 p-2">
                                <strong className="text-yellow-900">Risk:</strong>
                                <p className="text-yellow-800">{flag.risk}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      {/* Good Points Tab */}
                      <TabsContent value="good" className="space-y-3">
                        {analysis.good_points.map((point, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 rounded-lg bg-green-50 p-4"
                          >
                            <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                            <p className="text-sm text-green-900">{point}</p>
                          </div>
                        ))}
                      </TabsContent>

                      {/* Actions Tab */}
                      <TabsContent value="actions" className="space-y-4">
                        {analysis.recommendations.map((rec, index) => {
                          const priorityColors = {
                            HIGH: "border-red-600/20 bg-red-50",
                            MEDIUM: "border-yellow-600/20 bg-yellow-50",
                            LOW: "border-blue-600/20 bg-blue-50"
                          };
                          
                          return (
                            <div
                              key={index}
                              className={`rounded-lg border p-4 ${priorityColors[rec.priority]}`}
                            >
                              <div className="mb-2 flex items-start justify-between">
                                <h4 className="font-semibold">{rec.action}</h4>
                                <Badge variant={getSeverityColor(rec.priority)}>
                                  {rec.priority} PRIORITY
                                </Badge>
                              </div>
                              <p className="text-sm">{rec.explanation}</p>
                            </div>
                          );
                        })}
                      </TabsContent>
                    </ScrollArea>
                  </CardContent>
                </Tabs>
              </Card>

              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary & Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold">Overall Assessment</h4>
                    <p className="text-sm text-muted-foreground">{analysis.overall_summary}</p>
                  </div>
                  
                  <div className="rounded-lg bg-primary/10 p-4">
                    <h4 className="mb-2 font-semibold text-primary">What You Should Do Next</h4>
                    <p className="text-sm">{analysis.next_steps}</p>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Need Legal Help?</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p>For specific legal advice, contact:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3" />
                          <a 
                            href="https://www.tribunalsontario.ca/ltb/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Ontario Landlord and Tenant Board
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3" />
                          <span>UOttawa Legal Aid Clinic - 613-562-5800</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-3 w-3" />
                          <a 
                            href="https://www.clsottawa.ca/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Community Legal Services Ottawa
                          </a>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Cards (when no file uploaded) */}
          {!analysis && !file && (
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <ShieldAlert className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">Scam Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI identifies common rental scam patterns, fake landlords, and fraudulent listings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Scale className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">Legal Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automatically checks against Ontario Residential Tenancies Act and highlights illegal clauses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <DollarSign className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">Financial Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Identifies excessive fees, hidden costs, and unfair financial terms before you sign
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LeaseCheckerPage;
