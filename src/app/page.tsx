import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            THE 4AM TEST
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover the gap between how you think your website performs and how it actually performs.
          </p>

          <Card className="max-w-2xl mx-auto mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">What is THE 4AM TEST?</CardTitle>
              <CardDescription className="text-lg">
                A comprehensive analysis that compares your self-perception with reality through:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-lg mb-2">🎯 Self-Assessment Quiz</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    8 strategic questions to understand your current SEO and AI optimization mindset
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">🔍 Website Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Real-time analysis of your website's SEO, content structure, and technical implementation
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">📊 Gap Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    See exactly where your perception differs from reality and get actionable insights
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">🚀 Action Plan</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Personalized recommendations to bridge the gap and improve your results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/quiz">
              <Button size="lg" className="text-lg px-8 py-4">
                Start THE 4AM TEST
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">8</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Strategic Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">30s</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Website Analysis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Profile Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Free Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
