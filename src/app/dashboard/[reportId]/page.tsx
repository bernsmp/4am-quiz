'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import {
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Eye,
  Brain,
  FileSearch,
  Code2,
  Gauge,
  FileText,
  Check,
  X
} from 'lucide-react'

interface AnalysisDetails {
  schema?: {
    score?: number
    details?: {
      hasOrganization?: boolean
      hasFAQ?: boolean
      hasLocalBusiness?: boolean
      schemaCount?: number
      [key: string]: unknown
    }
    enabled?: boolean
    error?: string
  }
  pageSpeed?: {
    score?: number
    details?: {
      performanceScore?: number
      seoScore?: number
      accessibilityScore?: number
      bestPracticesScore?: number
      [key: string]: unknown
    }
    enabled?: boolean
    error?: string
  }
  content?: {
    score?: number
    details?: {
      hasFAQSection?: boolean
      hasHeadings?: boolean
      readabilityScore?: number
      wordCount?: number
      [key: string]: unknown
    }
    enabled?: boolean
    error?: string
  }
  openai?: {
    score?: number
    details?: {
      totalMentions?: number
      queries?: unknown[]
      positiveContext?: boolean
      [key: string]: unknown
    }
    enabled?: boolean
    error?: string
  }
  [key: string]: unknown
}

interface Report {
  website_url: string
  quiz_seo_score: number
  quiz_aeo_score: number
  actual_seo_score: number
  actual_aeo_score: number
  seo_gap: number
  aeo_gap: number
  total_gap: number
  gap_type: string
  profile_type: string
  email: string | null
  analysis_details?: AnalysisDetails // Analysis data from our analyzer system
}

export default function DashboardPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const reportId = params.reportId as string
  const emailParam = searchParams.get('email')

  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [reportId])

  async function fetchReport() {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('report_id', reportId)
        .single()

      if (error || !data) {
        // PGRST116 = not found, expected for invalid report IDs
        if (error?.code !== 'PGRST116') {
          console.warn('Unexpected error fetching report:', error)
        }
        setLoading(false)
        router.push('/verify')
        return
      }

      setReport(data)
      setLoading(false)

      // NOTE: Email capture is now handled by GHL page redirect flow
      // The old direct email capture code is commented out below
      /*
      // If email is provided but not saved, save it
      if (emailParam && !data.email) {
        saveEmail(emailParam)
      }
      */

      // Track dashboard view
      await supabase
        .from('reports')
        .update({
          dashboard_views: (data.dashboard_views || 0) + 1,
          last_viewed_at: new Date().toISOString()
        })
        .eq('report_id', reportId)
    } catch (err) {
      console.warn('Exception fetching report:', err)
      setLoading(false)
      router.push('/verify')
    }
  }

  // NOTE: This function is preserved for future use if needed
  // Currently, email capture is handled by GHL page redirect flow
  /*
  async function saveEmail(email: string) {
    setSavingEmail(true)

    try {
      // Update report with email
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          email: email,
          email_captured_at: new Date().toISOString()
        })
        .eq('report_id', reportId)

      if (updateError) {
        console.error('Error saving email:', updateError)
        return
      }

      // Send to GHL webhook (will create this API next)
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          reportId,
          websiteUrl: report?.website_url,
          seoGap: report?.seo_gap,
          aeoGap: report?.aeo_gap,
          totalGap: report?.total_gap
        })
      })

      // Update local state
      if (report) {
        setReport({ ...report, email })
      }
    } catch (error) {
      console.error('Error in saveEmail:', error)
    } finally {
      setSavingEmail(false)
    }
  }
  */

  const [expandedWeek, setExpandedWeek] = useState<number>(1)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xl text-gray-600">Loading your premium dashboard...</div>
        </motion.div>
      </div>
    )
  }

  if (!report) return null

  // Data for comparison chart
  const chartData = [
    {
      name: 'SEO',
      'Your Prediction': report.quiz_seo_score,
      'Reality': report.actual_seo_score,
    },
    {
      name: 'AEO',
      'Your Prediction': report.quiz_aeo_score,
      'Reality': report.actual_aeo_score,
    },
  ]

  // Insights based on gap_type
  const insights = report.gap_type === 'overconfident' ? [
    {
      icon: AlertCircle,
      title: 'Significant Blind Spot Detected',
      description: `Your ${report.total_gap}-point gap means you're missing opportunities you think you're capturing.`,
      color: 'text-red-500'
    },
    {
      icon: Eye,
      title: 'Visibility Crisis',
      description: 'Potential customers searching for your services can\'t find you, even though you think they can.',
      color: 'text-amber-500'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Impact',
      description: 'This blind spot could be costing you 15-20 qualified leads per month.',
      color: 'text-red-500'
    },
    {
      icon: Target,
      title: 'Quick Wins Available',
      description: 'The good news: once you know the gap exists, it\'s straightforward to fix.',
      color: 'text-green-500'
    },
  ] : [
    {
      icon: Sparkles,
      title: 'You\'re Stronger Than You Think',
      description: 'Your actual performance exceeds your expectations - capitalize on this hidden strength!',
      color: 'text-green-500'
    },
    {
      icon: Brain,
      title: 'Untapped Confidence',
      description: 'You have authority you\'re not leveraging. Time to be more visible.',
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'Growth Opportunity',
      description: 'Push harder into channels you thought weren\'t working - they are!',
      color: 'text-purple-500'
    },
  ]

  const roadmapWeeks = [
    {
      week: 1,
      title: 'Foundation',
      color: 'border-green-500',
      items: [
        'Audit top 10 pages for schema markup gaps',
        'Add FAQ schema to product/service pages',
        'Create author profiles with E-A-T signals'
      ]
    },
    {
      week: 2,
      title: 'Content Optimization',
      color: 'border-blue-500',
      items: [
        'Rewrite 5 key pages with AI-friendly structure',
        'Add clear, direct answers to common questions',
        'Create comparison tables (you vs competitors)'
      ]
    },
    {
      week: 3,
      title: 'Authority Building',
      color: 'border-purple-500',
      items: [
        'Get cited in 3 industry publications',
        'Create data-driven case studies with results',
        'Update LinkedIn profiles with credentials'
      ]
    },
    {
      week: 4,
      title: 'Measurement & Iteration',
      color: 'border-amber-500',
      items: [
        'Test your site in ChatGPT, Perplexity, Claude',
        'Track which queries now surface your brand',
        'Double down on what\'s working'
      ]
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4"
    >
      <div className="max-w-7xl mx-auto">

        {/* Hero Section with Circular Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 mb-4"
          >
            Analysis for: <span className="font-semibold text-gray-900">{report.website_url}</span>
          </motion.p>

          {/* Circular Progress Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
            className="relative w-64 h-64 mx-auto mb-8"
          >
            {/* Pulsing glow effect */}
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl animate-pulse" />

            {/* SVG Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 502 }}
                animate={{ strokeDashoffset: 502 - (502 * Math.min(report.total_gap, 100)) / 100 }}
                transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
                strokeDasharray="502"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-gray-900 mb-2">
                <CountUp
                  start={0}
                  end={report.total_gap}
                  duration={2.5}
                  delay={0.6}
                />
              </div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Gap Score
              </div>
            </div>
          </motion.div>

          {/* Profile Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg"
          >
            <div className={`w-3 h-3 rounded-full ${report.gap_type === 'overconfident' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
            <span className="text-sm font-semibold text-gray-700 capitalize">
              {report.gap_type === 'overconfident' ? 'Blind Spot Detected' : 'Hidden Strength Found'}
            </span>
          </motion.div>
        </motion.div>

        {/* Glassmorphism Score Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          {/* SEO Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative group rounded-xl p-8 backdrop-blur-lg bg-white/60 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                Traditional Search (SEO)
              </h3>

              <div className="space-y-6">
                {/* Prediction */}
                <div>
                  <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Your Prediction</div>
                  <div className="text-4xl font-bold text-blue-600 mb-3">
                    {report.quiz_seo_score}%
                  </div>
                  <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${report.quiz_seo_score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Reality */}
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Reality</div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {report.actual_seo_score}%
                  </div>
                  <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${report.actual_seo_score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Gap */}
                <div className="text-center bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-300/30 rounded-xl p-4 mt-6">
                  <div className="text-xs font-semibold text-red-700 mb-1 uppercase tracking-wide">SEO Gap</div>
                  <div className="text-5xl font-bold text-red-600">
                    {report.seo_gap}
                  </div>
                  <div className="text-sm font-semibold text-red-600 mt-1">points</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AEO Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative group rounded-xl p-8 backdrop-blur-lg bg-white/60 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                AI Search (AEO)
              </h3>

              <div className="space-y-6">
                {/* Prediction */}
                <div>
                  <div className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Your Prediction</div>
                  <div className="text-4xl font-bold text-green-600 mb-3">
                    {report.quiz_aeo_score}%
                  </div>
                  <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${report.quiz_aeo_score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Reality */}
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Reality</div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">
                    {report.actual_aeo_score}%
                  </div>
                  <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${report.actual_aeo_score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Gap */}
                <div className="text-center bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-300/30 rounded-xl p-4 mt-6">
                  <div className="text-xs font-semibold text-red-700 mb-1 uppercase tracking-wide">AEO Gap</div>
                  <div className="text-5xl font-bold text-red-600">
                    {report.aeo_gap}
                  </div>
                  <div className="text-sm font-semibold text-red-600 mt-1">points</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-8 border border-white/40 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              Prediction vs Reality
            </h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Your Prediction" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Reality" fill="#EF4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Lightbulb className="w-7 h-7 text-amber-600" />
            </div>
            Key Insights
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${insight.color} bg-opacity-10`}>
                      <Icon className={`w-6 h-6 ${insight.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{insight.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Technical Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileSearch className="w-7 h-7 text-blue-600" />
              </div>
              Technical Analysis
            </h2>
            <p className="text-gray-600 ml-14">Here&apos;s what we found on your website</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Card 1: Schema Markup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Code2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Schema Markup</h3>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Organization Schema</span>
                  {report.analysis_details?.schema?.details?.hasOrganization ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Found</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Missing</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">FAQ Schema</span>
                  {report.analysis_details?.schema?.details?.hasFAQ ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Found</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Missing</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">LocalBusiness Schema</span>
                  {report.analysis_details?.schema?.details?.hasLocalBusiness ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Found</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Missing</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  {report.analysis_details?.schema ? (
                    <span className="font-medium">
                      {report.analysis_details.schema.details?.schemaCount || 0} schema{(report.analysis_details.schema.details?.schemaCount || 0) === 1 ? '' : 's'} detected
                    </span>
                  ) : (
                    <span className="text-amber-600">Analysis in progress...</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Card 2: PageSpeed Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Gauge className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">PageSpeed Performance</h3>
              </div>

              {report.analysis_details?.pageSpeed?.details ? (
                <div className="space-y-4">
                  {/* Performance Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Performance</span>
                      <span className={`text-lg font-bold ${
                        (report.analysis_details.pageSpeed.details.performanceScore || 0) >= 90 ? 'text-green-600' :
                        (report.analysis_details.pageSpeed.details.performanceScore || 0) >= 50 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {report.analysis_details.pageSpeed.details.performanceScore || 0}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          (report.analysis_details.pageSpeed.details.performanceScore || 0) >= 90 ? 'bg-green-600' :
                          (report.analysis_details.pageSpeed.details.performanceScore || 0) >= 50 ? 'bg-amber-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${report.analysis_details.pageSpeed.details.performanceScore || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* SEO Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">SEO</span>
                      <span className={`text-lg font-bold ${
                        (report.analysis_details.pageSpeed.details.seoScore || 0) >= 90 ? 'text-green-600' :
                        (report.analysis_details.pageSpeed.details.seoScore || 0) >= 50 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {report.analysis_details.pageSpeed.details.seoScore || 0}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          (report.analysis_details.pageSpeed.details.seoScore || 0) >= 90 ? 'bg-green-600' :
                          (report.analysis_details.pageSpeed.details.seoScore || 0) >= 50 ? 'bg-amber-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${report.analysis_details.pageSpeed.details.seoScore || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Accessibility Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Accessibility</span>
                      <span className={`text-lg font-bold ${
                        (report.analysis_details.pageSpeed.details.accessibilityScore || 0) >= 90 ? 'text-green-600' :
                        (report.analysis_details.pageSpeed.details.accessibilityScore || 0) >= 50 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {report.analysis_details.pageSpeed.details.accessibilityScore || 0}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          (report.analysis_details.pageSpeed.details.accessibilityScore || 0) >= 90 ? 'bg-green-600' :
                          (report.analysis_details.pageSpeed.details.accessibilityScore || 0) >= 50 ? 'bg-amber-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${report.analysis_details.pageSpeed.details.accessibilityScore || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-amber-600">
                  <p className="text-sm">Performance analysis in progress...</p>
                </div>
              )}
            </motion.div>

            {/* Card 3: Content Quality */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Content Quality</h3>
              </div>

              {report.analysis_details?.content?.details ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">FAQ Section</span>
                    <span className={`text-sm font-medium ${
                      report.analysis_details.content.details.hasFAQSection ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {report.analysis_details.content.details.hasFAQSection ? 'Found' : 'Missing'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Heading Structure</span>
                    <span className={`text-sm font-medium ${
                      report.analysis_details.content.details.hasHeadings ? 'text-green-600' : 'text-amber-600'
                    }`}>
                      {report.analysis_details.content.details.hasHeadings ? 'Good' : 'Needs Work'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Readability Score</span>
                    <span className="text-lg font-bold text-blue-600">
                      {report.analysis_details.content.details.readabilityScore || 0}/100
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm text-gray-600">
                      Word Count: <span className="font-medium">{report.analysis_details.content.details.wordCount?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-amber-600">
                  <p className="text-sm">Content analysis in progress...</p>
                </div>
              )}
            </motion.div>

            {/* Card 4: AI Visibility */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI Visibility</h3>
              </div>

              {report.analysis_details?.openai?.details ? (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {report.analysis_details.openai.details.totalMentions || 0}/{report.analysis_details.openai.details.queries?.length || 4}
                    </div>
                    <div className="text-sm text-gray-600">Mentions in ChatGPT queries</div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        ((report.analysis_details.openai.details.totalMentions || 0) / (report.analysis_details.openai.details.queries?.length || 4) * 100) >= 75 ? 'bg-green-600' :
                        ((report.analysis_details.openai.details.totalMentions || 0) / (report.analysis_details.openai.details.queries?.length || 4) * 100) >= 50 ? 'bg-amber-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${(report.analysis_details.openai.details.totalMentions || 0) / (report.analysis_details.openai.details.queries?.length || 4) * 100}%` }}
                    />
                  </div>

                  <div className="text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      ((report.analysis_details.openai.details.totalMentions || 0) / (report.analysis_details.openai.details.queries?.length || 4) * 100) >= 75 ? 'bg-green-100 text-green-700' :
                      ((report.analysis_details.openai.details.totalMentions || 0) / (report.analysis_details.openai.details.queries?.length || 4) * 100) >= 50 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {((report.analysis_details.openai.details.totalMentions || 0) / (report.analysis_details.openai.details.queries?.length || 4) * 100) >= 75 ? 'Excellent' :
                       ((report.analysis_details.openai.details.totalMentions || 0) / (report.analysis_details.openai.details.queries?.length || 4) * 100) >= 50 ? 'Good' :
                       'Poor'} Visibility
                    </span>
                  </div>

                  {report.analysis_details.openai.details.positiveContext && (
                    <div className="text-sm text-green-600 text-center">
                      ✓ Mentioned in positive context
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-600 mb-3">AI testing not enabled</p>
                  <p className="text-xs text-gray-500">Enable OpenAI integration for detailed AI visibility analysis</p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-white/70 backdrop-blur-lg rounded-xl p-8 border border-white/40 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                Your 30-Day Roadmap
              </h2>
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                0/12 Completed
              </div>
            </div>

            <div className="space-y-4">
              {roadmapWeeks.map((week) => (
                <div key={week.week} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedWeek(expandedWeek === week.week ? 0 : week.week)}
                    className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-1 h-12 ${week.color} rounded-full`} />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Week {week.week}
                        </div>
                        <div className="text-xl font-bold text-gray-900">{week.title}</div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedWeek === week.week ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedWeek === week.week && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 bg-gray-50">
                          <ul className="space-y-3">
                            {week.items.map((item, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 group cursor-pointer hover:bg-white p-3 rounded-lg transition-colors duration-200"
                              >
                                <CheckCircle2 className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors duration-200 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 leading-relaxed">{item}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#3B82F6] to-[#2a4358] rounded-2xl p-12 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-semibold text-white">Limited Time Strategy Session</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Close Your Gap?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let us help you implement this roadmap and start capturing those 15-20 missed deals per month.
            </p>
            <motion.a
              href="https://sociallysquare.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-white text-purple-700 px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl transition-all duration-300 shadow-xl"
            >
              Let&apos;s Talk Strategy
              <TrendingUp className="w-6 h-6" />
            </motion.a>
          </div>
        </motion.div>

      </div>

      {/* Floating Action Button (Mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-6 right-6 md:hidden z-50"
      >
        <motion.a
          href="https://sociallysquare.com"
          target="_blank"
          rel="noopener noreferrer"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#2a4358] text-white px-6 py-4 rounded-full font-bold shadow-2xl"
        >
          <Sparkles className="w-5 h-5" />
          Get Started
        </motion.a>
      </motion.div>
    </motion.div>
  )
}
