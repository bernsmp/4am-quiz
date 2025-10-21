import { Button } from "@/components/catalyst/button";
import { Heading } from "@/components/catalyst/heading";
import { Text } from "@/components/catalyst/text";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#2b4257] via-[#345e7d] to-[#4a6f8f] px-6 py-20 md:py-32">
        {/* Header Logo */}
        <div className="container mx-auto max-w-7xl px-6 pt-6 pb-4">
          <Link href="/">
            <Image
              src="/AEO Logo - 3.jpg"
              alt="AEO Strategist"
              width={200}
              height={80}
              className="cursor-pointer"
            />
          </Link>
        </div>
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-10 leading-tight tracking-tight">
            Your Customers Didn&apos;t Disappear. They Just Can&apos;t Find You&nbsp;Anymore.{" "}
            <span className="inline-block">Here&apos;s What&nbsp;Changed.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            The website is changing fast. What worked yesterday before your competitors took you out permanently.
          </p>
          <div className="mb-8 text-[#e3ebf2] text-base md:text-lg max-w-2xl mx-auto">
            <p className="mb-6">
              This 2-minute diagnostic shows you exactly where your website reality — and reveals what a cunning few rivals may single day.
            </p>
            <ul className="space-y-4 text-left max-w-xl mx-auto">
              <li className="flex items-start gap-4">
                <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                <span className="mt-1.5">Your search visibility are fading — See exactly where your team is losing money to competitors</span>
              </li>
              <li className="flex items-start gap-4">
                <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                <span className="mt-1.5">Stealth rivals are Actionable steps every single organization</span>
              </li>
              <li className="flex items-start gap-4">
                <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                <span className="mt-1.5">You&apos;re losing customers the Zero-Click trap where your competitors</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Link href="/quiz">
              <ShimmerButton
                className="px-8 py-4 text-lg font-bold shadow-xl hover:shadow-green-500/30"
                shimmerColor="#ffffff"
                background="linear-gradient(to right, #86c444, #76b33d)"
                borderRadius="10px"
              >
                <span className="text-white">
                  Find My Invisibility Gap
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Problem Section - Enhanced */}
      <div className="bg-gradient-to-br from-blue-50/40 via-white to-blue-50/30 px-6 py-24 relative overflow-hidden">
        {/* Subtle decorative element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6da7cc]/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-4xl">
          <Heading level={2} className="text-4xl md:text-5xl text-center mb-16 tracking-tight !font-extrabold">
            The Silent Deal-Killer You Can&apos;t See&nbsp;Coming
          </Heading>

          {/* Opening hook with icon */}
          <div className="flex items-start gap-4 mb-8 max-w-3xl mx-auto">
            <div className="text-4xl flex-shrink-0">🔍</div>
            <p className="text-2xl md:text-3xl font-semibold text-[#2b4257] mt-1">
              Right now, someone is searching for exactly what you offer.
            </p>
          </div>

          {/* Staccato rhythm box */}
          <Card className="p-8 md:p-10 mb-8 bg-gray-50/80 border-l-4 border-[#2b4257] shadow-md max-w-3xl mx-auto rounded-xl">
            <p className="text-xl md:text-2xl text-[#345e7d] mb-4">They&apos;re not calling you.</p>
            <p className="text-xl md:text-2xl text-[#345e7d] mb-4">They&apos;re not even seeing you.</p>
            <p className="text-xl md:text-2xl font-bold text-[#2b4257]">
              They&apos;re seeing <em>your competitors</em> — the ones who show up when they search:
              &quot;Who are the best SEO strategy companies?&quot;
            </p>
          </Card>

          <div className="prose prose-xl max-w-3xl mx-auto">
            <p className="text-lg text-[#345e7d] mb-6 text-center">
              Your competitor&apos;s advantage is silent. Invisible. You can&apos;t see it in your analytics.
            </p>
          </div>

          {/* Critical message highlight */}
          <Card className="p-8 md:p-10 my-10 bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-l-4 border-amber-500 shadow-lg max-w-3xl mx-auto rounded-xl hover:shadow-xl transition-all duration-300">
            <p className="text-xl md:text-2xl font-bold text-[#2b4257] leading-relaxed">
              But it&apos;s killing your business. And you don&apos;t even know it&apos;s happening.
            </p>
          </Card>

          {/* Statistics callout */}
          <Card className="p-10 bg-white border border-blue-100/50 shadow-xl shadow-blue-900/10 rounded-2xl max-w-3xl mx-auto hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="text-5xl font-extrabold text-[#6da7cc]">70%</div>
              <div>
                <p className="text-xl font-bold text-[#2b4257] mb-2">
                  of B2B buyers now start with search, not referrals
                </p>
                <p className="text-lg text-[#345e7d]">
                  So if you&apos;re waiting for the phone to ring...
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Zero-Click Search Section */}
      <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 px-6 py-24">
        <div className="container mx-auto max-w-4xl">
          <Heading level={2} className="text-4xl md:text-5xl text-center mb-16 tracking-tight !font-extrabold">
            Welcome to the age of &quot;Zero-Click&nbsp;Search.&quot;
          </Heading>

          <Card className="p-10 mb-12 bg-white shadow-xl shadow-blue-900/10 border border-blue-100/50 rounded-2xl ring-1 ring-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
            <p className="text-2xl md:text-3xl font-bold text-[#6da7cc] mb-4">
              65% of Google searches now end without a single click to any website. Or, reader? It fizzle.
            </p>
            <p className="text-lg text-[#345e7d]">
              Think about that for a moment. Those are your mobile searches never leave Google. The answer gets read right on search results page.
            </p>
          </Card>

          <div className="prose prose-xl max-w-3xl mx-auto text-[#345e7d] mb-12">
            <p className="mb-4">
              <strong className="text-[#2b4257]">Zero clicks to your website. Zero opportunity to convert them. Zero chance to grow.</strong>
            </p>
            <p className="mb-4">
              Your competitor is still ranking. Conversions are shrinking. Everything is
            </p>
            <p className="mb-6 font-semibold text-[#2b4257]">
              Because for in exactly the question--right here on the search results page.
            </p>
          </div>

          <Card className="p-10 bg-[#6da7cc] text-white shadow-xl shadow-blue-900/20 mb-12 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
            <p className="text-lg font-semibold mb-4">
              Then either calls up, or information for your industry.
            </p>
            <p className="text-lg mb-4">
              Your visibility doesn&apos;t change. None of it
            </p>
            <p className="text-lg">
              But either one, or ChatGPT&apos;s incredibly new voice AI.
            </p>
          </Card>

          <div className="prose prose-xl max-w-3xl mx-auto text-[#345e7d]">
            <p className="mb-4 font-semibold text-[#2b4257]">
              Because for in exactly the question--right here on the search results page.
            </p>
            <p className="mb-6">
              Here&apos;s what it means for your industry:
            </p>
            <ul className="space-y-3 mb-8">
              <li>Even if you could, today&apos;s business goes to competitors taking 65% other who want to turn clicks to call</li>
              <li>The truth? None. AI other who&apos;s citing search, taking—Zero clicks.</li>
              <li>Because for in exactly the question--right here on the search results page.</li>
            </ul>
            <p className="text-xl font-bold text-[#2b4257] mb-4">
              That&apos;s why difference between clicks and &quot;how they got&quot; let AI/Zero.
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      <div className="bg-gradient-to-b from-white to-gray-50/50 px-6 py-24">
        <div className="container mx-auto max-w-4xl">
          <Heading level={2} className="text-4xl md:text-5xl text-center mb-12 tracking-tight !font-extrabold">
            The 2-Minute Quiz That Explains Your Missing&nbsp;Customers
          </Heading>

          <Card className="p-10 mb-10 shadow-xl shadow-blue-900/10 border border-blue-100/50 rounded-2xl ring-1 ring-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
            <h3 className="text-xl font-semibold text-[#2b4257] mb-6">
              It&apos;s a diagnostic online that shows you exactly where you&apos;re being outmaneuvered:
            </h3>
            <ul className="space-y-5">
              {[
                "Traditional search (Google, Bing)",
                "AI search (ChatGPT, Perplexity, Claude)",
                "Industry your website GBP, for Zero-click architecture"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                  <span className="text-[#345e7d] text-lg mt-1">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-[#2b4257] mb-6">
              Here&apos;s what happens:
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "📋",
                  title: "Answer 8 strategic questions (2 minutes max)",
                  description: ""
                },
                {
                  icon: "🔍",
                  title: "Get an instant Deep-Dive to discover hidden visibility gaps",
                  description: ""
                },
                {
                  icon: "📊",
                  title: "Show your website GBP, for Zero-click architecture",
                  description: ""
                },
                {
                  icon: "✅",
                  title: "See the gap — and their fix for maximum ROI",
                  description: ""
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-[#2b4257] mb-2">{item.title}</h4>
                    {item.description && (
                      <p className="text-[#345e7d]">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-10 bg-[#e3ebf2] border border-blue-100/50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
            <h3 className="text-xl font-semibold text-[#2b4257] mb-6">
              You&apos;ll discover:
            </h3>
            <ul className="space-y-4">
              {[
                'Whether you\'re a "Google Where" but "AI Utility"',
                "The exact gaps between where you think vs fact",
                "Pinpoint blind spots others already accelerate business ROI",
                "What the heck fix results, for AI page reports.",
                "The 90% fix results, for AI page reports.",
                "And best value you need for fixing landing most answering"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Image src="/check.png" alt="Check" width={32} height={32} className="flex-shrink-0" />
                  <span className="text-[#345e7d] mt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-br from-[#2b4257] via-[#345e7d] to-[#1f3546] px-6 py-28 md:py-40">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-12 tracking-tight leading-tight !dark:text-white">
            Take the Test. Face the truth. Fix the Gap Before Your Competitors Lock You&nbsp;Out.
          </h2>

          <div className="space-y-6 mb-10 text-[#e3ebf2] text-lg max-w-2xl mx-auto">
            <p>Every day you wait, competitors establish stronger AI authority.</p>
            <p>Every day you&apos;re invisible, someone else is building trust where you should be.</p>
            <p>Every day that website, the truth can boost healthy.</p>
          </div>

          <Card className="p-10 bg-[#6da7cc] text-white mb-12 shadow-2xl shadow-blue-900/30 max-w-2xl mx-auto rounded-2xl hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-default">
            <p className="text-xl font-semibold mb-4">
              Companies that established AI visibility strategies in the past 6 months report outpacing industry peers by 2-3x in lead flow.
            </p>
            <p className="text-lg opacity-90">
              Once they&apos;ve built authority, squeezing in becomes exponentially harder. Expensive. Slow.
            </p>
          </Card>

          <div className="mb-10 text-[#e3ebf2] text-lg max-w-2xl mx-auto">
            <p className="font-semibold mb-4">
              That&apos;s why difference between clicks and &quot;how they place now wait,&quot; let AI/Zero.
            </p>
            <p className="text-2xl font-bold text-white mb-2">
              This takes 2 minutes. The competitive advantage lasts.
            </p>
            <p className="italic">
              (It could cost, fix, this starts with, for AI)
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/quiz">
              <ShimmerButton
                className="px-8 py-4 text-lg font-bold shadow-xl hover:shadow-green-500/30"
                shimmerColor="#ffffff"
                background="linear-gradient(to right, #86c444, #76b33d)"
                borderRadius="10px"
              >
                <span className="text-white">
                  Start the Invisibility Test
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#2b4257] px-6 py-10">
        <div className="container mx-auto max-w-4xl text-center">
          <Image
            src="/AEO Logo - 3.jpg"
            alt="AEO Strategist"
            width={250}
            height={100}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
