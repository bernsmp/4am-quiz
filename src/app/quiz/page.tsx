"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface QuizQuestion {
  id: number;
  question: string;
  answers: {
    a: { text: string; seo_score: number; aeo_score: number };
    b: { text: string; seo_score: number; aeo_score: number };
    c: { text: string; seo_score: number; aeo_score: number };
    d: { text: string; seo_score: number; aeo_score: number };
  };
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "If your content was a person at a party, they'd be...",
    answers: {
      a: { text: "The professor giving a TED talk (2000+ word deep dives)", seo_score: 3, aeo_score: 1 },
      b: { text: "The helpful friend with quick answers (500-800 words)", seo_score: 1, aeo_score: 3 },
      c: { text: "The influencer sharing hot takes (opinion pieces)", seo_score: 2, aeo_score: 2 },
      d: { text: "The salesperson who won't stop pitching (product pages)", seo_score: 0, aeo_score: 0 }
    }
  },
  {
    id: 2,
    question: "When someone wants to verify you're credible, they'll find...",
    answers: {
      a: { text: "My LinkedIn with 10,000+ followers and detailed experience", seo_score: 2, aeo_score: 2 },
      b: { text: "Published articles on my site with author bio and credentials", seo_score: 3, aeo_score: 3 },
      c: { text: "My name mentioned in industry publications and podcasts", seo_score: 2, aeo_score: 3 },
      d: { text: "Our company homepage and product pages", seo_score: 0, aeo_score: 0 }
    }
  },
  {
    id: 3,
    question: "Your content structure is mostly...",
    answers: {
      a: { text: "One massive 'Ultimate Guide' covering everything", seo_score: 3, aeo_score: 1 },
      b: { text: "Multiple short articles (500-800 words) that interlink", seo_score: 2, aeo_score: 3 },
      c: { text: "Mix of deep dives and quick answers", seo_score: 3, aeo_score: 3 },
      d: { text: "Product pages with specs and features", seo_score: 0, aeo_score: 0 }
    }
  },
  {
    id: 4,
    question: "In the last 30 days, how many people have said 'I found you on Google'?",
    answers: {
      a: { text: "10+ per week - we track this", seo_score: 3, aeo_score: 1 },
      b: { text: "A few per month - it happens", seo_score: 2, aeo_score: 1 },
      c: { text: "Rarely - most come from referrals or social", seo_score: 0, aeo_score: 1 },
      d: { text: "No idea - we don't track source", seo_score: 0, aeo_score: 0 }
    }
  },
  {
    id: 5,
    question: "If I visit your site and click 'View Page Source', I'd see...",
    answers: {
      a: { text: "Clean, simple HTML that's easy to read", seo_score: 2, aeo_score: 3 },
      b: { text: "Lots of code and scripts - built on WordPress/Webflow", seo_score: 2, aeo_score: 2 },
      c: { text: "Almost nothing - it's all loaded by JavaScript", seo_score: 2, aeo_score: 0 },
      d: { text: "What's 'View Page Source'?", seo_score: 0, aeo_score: 0 }
    }
  },
  {
    id: 6,
    question: "When you publish content, you...",
    answers: {
      a: { text: "Write and forget", seo_score: 0, aeo_score: 0 },
      b: { text: "Update quarterly based on performance", seo_score: 2, aeo_score: 2 },
      c: { text: "Refresh based on data and search trends", seo_score: 3, aeo_score: 3 },
      d: { text: "Publish once, promote forever (no updates)", seo_score: 1, aeo_score: 1 }
    }
  },
  {
    id: 7,
    question: "If I look at your article's code, would I find special tags that tell Google 'This is an FAQ' or 'This is a How-To guide'?",
    answers: {
      a: { text: "Yes - we use structured data/schema markup", seo_score: 3, aeo_score: 3 },
      b: { text: "We have FAQs and how-tos, but no special tags", seo_score: 2, aeo_score: 1 },
      c: { text: "Just regular headings and paragraphs", seo_score: 1, aeo_score: 0 },
      d: { text: "I have no idea what you're talking about", seo_score: 0, aeo_score: 0 }
    }
  },
  {
    id: 8,
    question: "How do you prove your expertise?",
    answers: {
      a: { text: "Years of experience mentioned in bio", seo_score: 1, aeo_score: 1 },
      b: { text: "Real client results and data-driven case studies", seo_score: 3, aeo_score: 3 },
      c: { text: "Industry certifications and credentials", seo_score: 2, aeo_score: 2 },
      d: { text: "Content quality speaks for itself", seo_score: 1, aeo_score: 0 }
    }
  }
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScores = () => {
    let seoScore = 0;
    let aeoScore = 0;

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = quizQuestions[parseInt(questionId) - 1];
      if (question && answer) {
        seoScore += question.answers[answer as keyof typeof question.answers].seo_score;
        aeoScore += question.answers[answer as keyof typeof question.answers].aeo_score;
      }
    });

    const maxScore = quizQuestions.length * 3;
    const seoPercentage = Math.round((seoScore / maxScore) * 100);
    const aeoPercentage = Math.round((aeoScore / maxScore) * 100);

    return { seoScore: seoPercentage, aeoScore: aeoPercentage };
  };

  const getProfile = (seoScore: number, aeoScore: number) => {
    if (seoScore >= 70 && aeoScore < 50) return "Google Winner";
    if (seoScore < 50 && aeoScore >= 70) return "AI Darling";
    if (seoScore >= 50 && aeoScore >= 50) return "Balanced Operator";
    return "Invisible Expert";
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults) {
    const { seoScore, aeoScore } = calculateScores();
    const profile = getProfile(seoScore, aeoScore);

    return (
      <div className="min-h-screen bg-[#e3ebf2]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-[#88a9c3]/30">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4 text-[#2b4257]">Your Results</CardTitle>
                <CardDescription className="text-lg text-[#345e7d]">
                  Based on your answers, here's your optimization profile:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
                    {profile}
                  </Badge>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-[#2b4257]">SEO Score</h3>
                      <div className="text-3xl font-bold text-[#6da7cc]">{seoScore}%</div>
                      <Progress value={seoScore} className="mt-2" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-[#2b4257]">AEO Score</h3>
                      <div className="text-3xl font-bold text-[#86c444]">{aeoScore}%</div>
                      <Progress value={aeoScore} className="mt-2" />
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-xl text-[#2b4257]">Profile Analysis</h3>
                  <p className="text-[#345e7d]">
                    {profile === "Google Winner" && "You dominate Google but ChatGPT has never heard of you. Your traditional SEO is strong, but you're invisible to AI systems."}
                    {profile === "AI Darling" && "ChatGPT loves you, but humans never click. You're being cited by AI but need better human engagement signals."}
                    {profile === "Balanced Operator" && "You're doing fine, but fine won't cut it by 2026. You need to dominate one platform before the shift accelerates."}
                    {profile === "Invisible Expert" && "Your expertise exists but your visibility doesn't. You have a discovery crisis - competitors are owning your category."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => router.push(`/verify?quizSeo=${seoScore}&quizAeo=${aeoScore}`)} className="text-lg px-8 py-4 h-auto">
                    Verify These Results With Your Actual Website
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()} className="text-lg px-8 py-4 h-auto">
                    Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const selectedAnswer = answers[question.id];

  return (
    <div className="min-h-screen bg-[#e3ebf2]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-[#345e7d]">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <Badge className="bg-[#6da7cc] text-white border-0">{Math.floor(progress)}% Complete</Badge>
            </div>
            <Progress value={progress} className="mb-6" />
          </div>

          <Card className="border-[#88a9c3]/30 shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-semibold leading-relaxed text-[#2b4257]">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(question.answers).map(([key, answer]) => (
                <Button
                  key={key}
                  variant={selectedAnswer === key ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-5 whitespace-normal transition-all duration-200 ${
                    selectedAnswer === key
                      ? "bg-[#86c444] text-white hover:bg-[#86c444] border-[#86c444] scale-[1.02] shadow-md"
                      : "hover:bg-accent/10 hover:-translate-y-0.5 hover:border-[#88a9c3] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#6da7cc] focus-visible:ring-offset-2"
                  }`}
                  onClick={() => handleAnswerSelect(question.id, key)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="font-bold text-lg min-w-[2rem] tracking-wide">{key.toUpperCase()}.</span>
                    <span className="text-sm md:text-base">{answer.text}</span>
                  </div>
                </Button>
              ))}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                >
                  {currentQuestion === quizQuestions.length - 1 ? "View Results" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
