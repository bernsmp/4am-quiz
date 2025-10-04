import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Dark Blue Gradient matching Socially Square */}
      <div className="bg-gradient-to-br from-[#2b4257] to-[#345e7d] px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            THE 4AM TEST
          </h1>
          <p className="text-xl md:text-2xl text-[#e3ebf2] mb-8 max-w-2xl mx-auto">
            Discover the gap between how you think your website performs and how it actually performs.
          </p>
          <Link href="/quiz">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              Start THE 4AM TEST
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content - Light Background */}
      <div className="bg-white px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="max-w-2xl mx-auto mb-12 border-[#88a9c3]/30">
            <CardHeader>
              <CardTitle className="text-2xl text-[#2b4257]">What is THE 4AM TEST?</CardTitle>
              <CardDescription className="text-lg text-[#345e7d]">
                A comprehensive analysis that compares your self-perception with reality through:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-[#2b4257]">🎯 Self-Assessment Quiz</h3>
                  <p className="text-[#345e7d]">
                    8 strategic questions to understand your current SEO and AI optimization mindset
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-[#2b4257]">🔍 Website Analysis</h3>
                  <p className="text-[#345e7d]">
                    Real-time analysis of your website&apos;s SEO, content structure, and technical implementation
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-[#2b4257]">📊 Gap Analysis</h3>
                  <p className="text-[#345e7d]">
                    See exactly where your perception differs from reality and get actionable insights
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-[#2b4257]">🚀 Action Plan</h3>
                  <p className="text-[#345e7d]">
                    Personalized recommendations to bridge the gap and improve your results
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/quiz">
              <Button size="lg" className="text-lg px-8 py-4 h-auto">
                Start THE 4AM TEST
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#6da7cc]">8</div>
              <div className="text-sm text-[#345e7d]">Strategic Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#86c444]">30s</div>
              <div className="text-sm text-[#345e7d]">Website Analysis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#6da7cc]">4</div>
              <div className="text-sm text-[#345e7d]">Profile Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#86c444]">100%</div>
              <div className="text-sm text-[#345e7d]">Free Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
