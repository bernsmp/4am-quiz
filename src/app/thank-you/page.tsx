import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Mail, Share2, Download } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#e3ebf2]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-[#86c444] mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-[#2b4257] mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Your 4AM Test analysis is complete. Here&apos;s what happens next:
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Your Results Summary</CardTitle>
              <CardDescription className="text-lg">
                We&apos;ve sent a detailed report to your email with personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">📊</div>
                  <div className="font-semibold">Gap Analysis</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Perception vs Reality breakdown
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">🎯</div>
                  <div className="font-semibold">Action Plan</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Step-by-step improvements
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">📈</div>
                  <div className="font-semibold">Growth Strategy</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Long-term optimization plan
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Check Your Email
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Results
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2b4257] mb-4">
                What&apos;s Your Next Step?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Based on your results, here are some recommended actions:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-left">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🚀 Quick Wins</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Fix critical technical issues</li>
                    <li>• Add missing meta descriptions</li>
                    <li>• Optimize image alt tags</li>
                    <li>• Improve page loading speed</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">📈 Strategic Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Content gap analysis</li>
                    <li>• Keyword opportunity research</li>
                    <li>• Internal linking strategy</li>
                    <li>• AI-powered content creation</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline" className="text-lg px-8 py-4">
                  Back to Home
                </Button>
              </Link>
              <Link href="/quiz">
                <Button className="text-lg px-8 py-4">
                  Take Test Again
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

