import { Heading } from "@/components/catalyst/heading";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import Link from "next/link";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Home as HomeIcon, Linkedin, Globe } from "lucide-react";
import { FeatureSteps } from "@/components/ui/feature-section";
import { AnimatedHighlightHeader } from "@/components/ui/animated-highlight-header";

export default function Home() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <HomeIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/suziekane/",
      icon: <Linkedin className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Socially Square",
      link: "https://sociallysquare.com/",
      icon: <Globe className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <FloatingNav navItems={navItems} />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#2b4257] via-[#345e7d] to-[#4a6f8f] px-6 py-20 md:py-32">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-10 leading-tight tracking-tight">
            Your Customers Didn&apos;t Disappear. They Just Can&apos;t Find You Anymore. <AnimatedHighlightHeader />
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            The window is closing on taking control of AI search visibility before your competitors lock you out permanently.
          </p>
          <div className="mb-8 text-[#e3ebf2] text-lg md:text-xl max-w-2xl mx-auto">
            <p className="mb-6">
              This 2-minute diagnostic shows you exactly where you stand — and reveals what&apos;s costing you deals every single day.
            </p>
            <ul className="space-y-4 text-left max-w-xl mx-auto">
              <li className="flex items-start gap-4">
                <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                <span className="mt-1.5">Instant visibility gap analysis — See exactly where you&apos;re losing to competitors</span>
              </li>
              <li className="flex items-start gap-4">
                <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                <span className="mt-1.5">Zero risk, maximum clarity — No credit card, No sales pitch.</span>
              </li>
              <li className="flex items-start gap-4">
                <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                <span className="mt-1.5">Instant results | Actionable steps to take right now</span>
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
                  Find My AI Invisibility Gap
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="bg-gradient-to-br from-blue-50/40 via-white to-blue-50/30 px-6 py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6da7cc]/5 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-4xl">
          <Heading level={2} className="text-4xl md:text-5xl text-center mb-16 tracking-tight !font-extrabold !text-[#2a4358]">
            The Silent Deal-Killer You Can&apos;t See&nbsp;Coming
          </Heading>

          <div className="prose prose-xl max-w-3xl mx-auto text-[#345e7d] mb-8">
            <p className="text-2xl font-semibold text-[#2a4358]">
              Right now, someone is researching companies in your space.
            </p>
          </div>

          {/* Staccato rhythm box */}
          <Card className="p-8 md:p-10 mb-8 bg-gray-50/80 border-l-4 border-[#2b4257] shadow-md max-w-3xl mx-auto rounded-xl">
            <p className="text-xl md:text-2xl text-[#345e7d] mb-4">They&apos;re not calling you.</p>
            <p className="text-xl md:text-2xl text-[#345e7d] mb-4">They&apos;re not even Googling you.</p>
            <p className="text-xl md:text-2xl font-bold text-[#2a4358]">
              They&apos;re asking ChatGPT: &quot;Who are the best [your category] companies?&quot;
            </p>
          </Card>

          <div className="prose prose-xl max-w-3xl mx-auto mb-8">
            <p className="text-2xl text-[#345e7d] mb-6 text-center">
              Your competitor&apos;s name appears. Yours doesn&apos;t.
            </p>
            <p className="text-2xl font-bold text-[#2a4358] mb-6 text-center">
              The contract gets signed before you even know the opportunity exists.
            </p>
          </div>

          {/* Critical message highlight */}
          <Card className="p-8 md:p-10 my-10 bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-l-4 border-amber-500 shadow-lg max-w-3xl mx-auto rounded-xl hover:shadow-xl transition-all duration-300">
            <p className="text-xl md:text-2xl font-bold text-[#2a4358] leading-relaxed mb-4">
              This is the new reality. 73% of B2B buyers now start with AI tools, not Google.
            </p>
          </Card>
        </div>
      </div>

      {/* Zero-Click Search Section */}
      <div className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 px-6 py-24">
        <div className="container mx-auto max-w-4xl">
          <Heading level={2} className="text-4xl md:text-5xl text-center mb-16 tracking-tight !font-extrabold !text-[#2a4358]">
            Welcome to the age of &quot;Zero-Click&nbsp;Search.&quot;
          </Heading>

          <Card className="p-10 mb-12 bg-white shadow-xl shadow-blue-900/10 border border-blue-100/50 rounded-2xl ring-1 ring-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
            <p className="text-2xl md:text-3xl font-bold text-[#6da7cc] mb-4">
              65% of Google searches now end without a single click to any website. On mobile? It&apos;s 75%.
            </p>
            <p className="text-2xl text-[#345e7d]">
              Think about that for a second. Three out of four mobile searches never leave Google. The searcher gets their answer right there, courtesy of AI Overviews and direct answer boxes.
            </p>
          </Card>

          <div className="prose prose-xl max-w-3xl mx-auto text-[#345e7d] mb-12">
            <p className="mb-4 text-2xl">
              <strong className="text-[#2a4358]">Zero clicks to your website. Zero opportunity to convert them. Zero chance to even know they existed.</strong>
            </p>
            <p className="mb-6 text-2xl">
              Your perfect SEO rankings? Your months of content creation? Completely bypassed by Zero-Click Search.
            </p>
          </div>

          <Card className="p-10 bg-[#e3ebf2] border border-blue-100/50 rounded-2xl shadow-lg mb-12 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
            <p className="text-2xl font-semibold text-[#2a4358] mb-6">
              It works like this: your company is ranking #1 for your main commercial keyword. Traffic is steady. Conversions are predictable. Everything is working.
            </p>
            <p className="text-2xl text-[#345e7d] mb-4">
              Then Google rolls out AI Overviews for your industry.
            </p>
            <p className="text-2xl text-[#345e7d] mb-4">
              Your ranking doesn&apos;t change. You&apos;re still #1.
            </p>
            <p className="text-2xl font-bold text-[#2a4358]">
              But your traffic drops by 34% in six weeks.
            </p>
          </Card>

          <div className="prose prose-xl max-w-3xl mx-auto text-[#345e7d] mb-12">
            <p className="mb-4 text-2xl">
              The clicks don&apos;t go to a competitor. They don&apos;t go anywhere.
            </p>
            <p className="mb-6 font-semibold text-[#2a4358] text-2xl">
              Because the AI answers the question right there on the search results page.
            </p>
            <p className="mb-6 text-2xl">
              Now multiply that across every keyword you rank for. Every piece of content you&apos;ve optimized. Every dollar you&apos;ve spent on SEO.
            </p>
            <p className="text-2xl font-bold text-[#2a4358]">
              That&apos;s not a future problem. Zero-Click Search is happening RIGHT NOW — whether you realize it or not.
            </p>
          </div>
        </div>
      </div>

      {/* Good News Section */}
      <div className="bg-white px-6 py-24">
        <div className="container mx-auto max-w-4xl">
          <Heading level={2} className="text-4xl md:text-5xl text-center mb-12 tracking-tight !font-extrabold !text-[#2a4358]">
            Here is the good news in all of this.
          </Heading>

          <Card className="p-10 mb-10 bg-gradient-to-br from-green-50/80 to-emerald-50/50 border-l-4 border-[#86c543] shadow-xl shadow-green-900/10 max-w-3xl mx-auto rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <p className="text-2xl md:text-3xl font-bold text-[#2a4358] mb-6">
              Companies that secured AI visibility positioning in the past 6 months are now capturing 340% more qualified traffic than competitors who are still &quot;figuring it out.&quot;
            </p>
            <p className="text-2xl text-[#345e7d] mb-4">
              Not 10% more. Not 25% more. <span className="font-bold text-[#2a4358]">340% more.</span>
            </p>
          </Card>

          <div className="prose prose-xl max-w-3xl mx-auto text-[#345e7d]">
            <p className="mb-6 text-2xl">
              The brands that establish AI authority first get cited more frequently. That citation frequency compounds. It becomes a self-reinforcing cycle.
            </p>
            <p className="mb-6 text-2xl font-semibold text-[#2a4358]">
              Your competitors who figure this out now will become the &quot;default answer&quot; in your niche.
            </p>
            <p className="mb-6 text-2xl">
              And once that authority is established? You&apos;ll spend 10X more time and money trying to displace them.
            </p>
            <p className="text-2xl font-bold text-[#2a4358]">
              The window for easy AI positioning is shrinking every month. What took 2 weeks to achieve six months ago now takes 2 months. By next year? It could take 6 months and cost 5X more.
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Section */}
      <div className="bg-gradient-to-b from-gray-50/50 to-blue-50/30 px-6 py-24">
        <div className="container mx-auto max-w-4xl">
          <Heading level={2} className="text-4xl md:text-5xl text-center mb-8 tracking-tight !font-extrabold !text-[#2a4358]">
            The 2-Minute Quiz That Explains Your Missing Customers
          </Heading>

          <p className="text-2xl text-[#345e7d] text-center mb-12 max-w-3xl mx-auto">
            While your competitors are capturing Zero-Click Search visibility, this shows you exactly where you&apos;re losing ground - and what to fix first.
          </p>

          <Card className="p-10 mb-10 shadow-xl shadow-blue-900/10 border border-blue-100/50 rounded-2xl ring-1 ring-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-default">
            <h3 className="text-2xl font-semibold text-[#2a4358] mb-6">
              It&apos;s a diagnostic mirror that shows you exactly where you stand in both worlds:
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                <span className="text-[#345e7d] text-2xl mt-1">Traditional search (Google, Bing)</span>
              </li>
              <li className="flex items-start gap-4">
                <Image src="/check.png" alt="Check" width={40} height={40} className="flex-shrink-0" />
                <span className="text-[#345e7d] text-2xl mt-1">AI search (ChatGPT, Perplexity, Claude)</span>
              </li>
            </ul>
          </Card>

          <FeatureSteps
            features={[
              {
                step: "1",
                title: "Answer 8 strategic questions (2 minutes max)",
                content: "",
                image: "/step-1.gif"
              },
              {
                step: "2",
                title: "Get your predicted SEO + AEO performance scores",
                content: "",
                image: "/step-2.gif"
              },
              {
                step: "3",
                title: "Enter your website URL for real-world verification",
                content: "",
                image: "/step-3.gif"
              },
              {
                step: "4",
                title: "See the gap — and what it's costing you",
                content: "",
                image: "/step-4.gif"
              }
            ]}
            title="Here's what happens:"
            autoPlayInterval={2000}
            className="mb-12"
          />

          <Card className="p-10 bg-[#e3ebf2] border border-blue-100/50 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
            <h3 className="text-3xl font-bold text-[#2a4358] mb-6">
              You&apos;ll discover:
            </h3>
            <ul className="space-y-4">
              {[
                'Whether you\'re a "Google Winner" but "AI Ghost"',
                "If competitors dominate AI while you dominate traditional search",
                "The exact blind spots killing opportunities",
                "Which gap to fix first for maximum ROI"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Image src="/check.png" alt="Check" width={32} height={32} className="flex-shrink-0" />
                  <span className="text-[#345e7d] text-xl mt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-2xl font-bold text-[#2a4358] mb-4">
              No fluff. No upsells. No 47-page reports.
            </p>
            <p className="text-xl text-[#345e7d]">
              Just the raw data you need to stop guessing and start winning.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-br from-[#2b4257] via-[#345e7d] to-[#1f3546] px-6 py-28 md:py-40">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-12 tracking-tight leading-tight">
            Take the Test. Face the Truth. Fix the Gap Before Your Competitors Lock You Out.
          </h2>

          <div className="space-y-6 mb-10 text-[#e3ebf2] text-xl md:text-2xl max-w-2xl mx-auto">
            <p>Every day you wait, competitors establish stronger AI authority.</p>
            <p>Every day you&apos;re invisible, someone researches your category and finds them instead.</p>
            <p>Every day the gap widens, the catch-up costs multiply.</p>
          </div>

          <Card className="p-10 bg-[#6da7cc] text-white mb-12 shadow-2xl shadow-blue-900/30 max-w-2xl mx-auto rounded-2xl hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-default">
            <p className="text-2xl font-semibold mb-4">
              Companies that established AI visibility strategies in the past 6 months report capturing 340% more qualified traffic than those who are still waiting.
            </p>
            <p className="text-2xl opacity-90">
              That&apos;s the difference between acting now and &quot;seeing how this plays out.&quot;
            </p>
          </Card>

          <div className="mb-10 text-[#e3ebf2] text-xl md:text-2xl max-w-2xl mx-auto">
            <p className="mb-6">
              The early movers are becoming the default answers in their industries. Once that authority compounds, displacing them becomes exponentially harder and more expensive.
            </p>
            <p className="text-2xl font-bold text-white mb-4">
              This takes 2 minutes. The competitive advantage lasts years.
            </p>
            <p className="text-xl">
              No credit card. No sales pitch. No BS.
            </p>
            <p className="mt-4 text-xl italic">
              Just the diagnostic truth about where you stand in the search revolution that&apos;s already happening.
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
                  Show Me Where I&apos;m Losing Deals
                </span>
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#2b4257] px-6 py-12">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-6">
            <Image
              src="/AEO Logo - 3.jpg"
              alt="AEO Strategist"
              width={250}
              height={100}
              className="mx-auto"
            />
          </div>
          <p className="text-white/80 text-lg mb-2">An offshoot of Socially Square</p>
          <p className="text-[#86c543] text-2xl font-bold tracking-wider">BE THE ANSWER</p>
        </div>
      </div>
    </div>
  );
}
