import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#e3ebf2]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#2b4257] mb-6">
              About THE 4AM TEST
            </h1>
            <p className="text-xl text-[#345e7d] max-w-2xl mx-auto">
              Understanding the gap between perception and reality in website optimization
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Why THE 4AM TEST?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Most website owners have a perception of how well their site performs, but reality often tells a different story.
                  THE 4AM TEST bridges this gap by combining self-assessment with actual website analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Take our 8-question assessment to understand your optimization mindset, then let us analyze your actual website
                  to reveal where perception meets reality.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6da7cc] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Self-Assessment</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Answer 8 strategic questions about your SEO and AI optimization approach
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#86c444] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Website Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We analyze your actual website for SEO, technical, and content optimization
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#345e7d] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">Gap Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Discover the difference between perception and reality with actionable insights
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2b4257] mb-6">
              Ready to discover your optimization reality?
            </h2>
            <Link href="/quiz">
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                Start THE 4AM TEST
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

