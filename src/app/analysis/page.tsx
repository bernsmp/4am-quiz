"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, AlertCircle, Globe } from "lucide-react";

export default function AnalysisPage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!url.trim()) return;

    setIsAnalyzing(true);

    // Simulate website analysis
    setTimeout(() => {
      const mockResults = {
        url: url,
        seo_score: Math.floor(Math.random() * 40) + 30, // 30-70 range
        schema_markup: Math.random() > 0.5,
        meta_tags: Math.random() > 0.3,
        headings_structure: Math.random() > 0.4,
        content_quality: Math.floor(Math.random() * 50) + 25,
        technical_issues: Math.floor(Math.random() * 5),
        mobile_friendly: Math.random() > 0.2,
        page_speed: Math.floor(Math.random() * 30) + 40,
        recommendations: [
          "Add more internal links to improve site navigation",
          "Include alt text for all images",
          "Add schema markup for better search visibility",
          "Improve page loading speed",
          "Create more comprehensive meta descriptions"
        ]
      };

      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000); // 3 second analysis simulation
  };

  const handleStartOver = () => {
    setUrl("");
    setAnalysisComplete(false);
    setAnalysisResults(null);
  };

  if (analysisComplete && analysisResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4 flex items-center justify-center gap-2">
                  <CheckCircle className="text-green-600" />
                  Analysis Complete
                </CardTitle>
                <CardDescription className="text-lg">
                  Here's what we found for: <strong>{analysisResults.url}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-xl">SEO Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Overall SEO Score</span>
                        <Badge variant={analysisResults.seo_score > 60 ? "default" : "secondary"}>
                          {analysisResults.seo_score}%
                        </Badge>
                      </div>
                      <Progress value={analysisResults.seo_score} />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          {analysisResults.schema_markup ? (
                            <CheckCircle className="text-green-600 w-4 h-4" />
                          ) : (
                            <AlertCircle className="text-red-600 w-4 h-4" />
                          )}
                          Schema Markup
                        </div>
                        <div className="flex items-center gap-2">
                          {analysisResults.meta_tags ? (
                            <CheckCircle className="text-green-600 w-4 h-4" />
                          ) : (
                            <AlertCircle className="text-red-600 w-4 h-4" />
                          )}
                          Meta Tags
                        </div>
                        <div className="flex items-center gap-2">
                          {analysisResults.headings_structure ? (
                            <CheckCircle className="text-green-600 w-4 h-4" />
                          ) : (
                            <AlertCircle className="text-red-600 w-4 h-4" />
                          )}
                          Heading Structure
                        </div>
                        <div className="flex items-center gap-2">
                          {analysisResults.mobile_friendly ? (
                            <CheckCircle className="text-green-600 w-4 h-4" />
                          ) : (
                            <AlertCircle className="text-red-600 w-4 h-4" />
                          )}
                          Mobile Friendly
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-xl">Technical Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Page Speed Score</span>
                        <Badge variant={analysisResults.page_speed > 70 ? "default" : "secondary"}>
                          {analysisResults.page_speed}%
                        </Badge>
                      </div>
                      <Progress value={analysisResults.page_speed} />

                      <div className="flex justify-between items-center">
                        <span>Technical Issues</span>
                        <Badge variant={analysisResults.technical_issues === 0 ? "default" : "destructive"}>
                          {analysisResults.technical_issues} found
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Content Quality</span>
                        <Badge variant={analysisResults.content_quality > 60 ? "default" : "secondary"}>
                          {analysisResults.content_quality}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-xl mb-4">Recommendations</h3>
                  <div className="grid gap-3">
                    {analysisResults.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => router.push("/thank-you")} className="text-lg px-8 py-4">
                    Get Full Report
                  </Button>
                  <Button variant="outline" onClick={handleStartOver} className="text-lg px-8 py-4">
                    Analyze Another Site
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4 flex items-center justify-center gap-2">
                <Globe className="text-blue-600" />
                Website Analysis
              </CardTitle>
              <CardDescription className="text-lg">
                Enter your website URL to discover how it really performs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isAnalyzing ? (
                <>
                  <div className="space-y-4">
                    <label htmlFor="url" className="text-sm font-medium">
                      Website URL
                    </label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">What we'll analyze:</h3>
                    <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• SEO optimization and meta tags</li>
                      <li>• Content structure and quality</li>
                      <li>• Technical performance</li>
                      <li>• Mobile responsiveness</li>
                      <li>• Schema markup implementation</li>
                    </ul>
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!url.trim()}
                    className="w-full text-lg py-6"
                  >
                    Start Analysis
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Analyzing your website...</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      This usually takes about 30 seconds
                    </p>
                  </div>
                  <Progress value={66} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

