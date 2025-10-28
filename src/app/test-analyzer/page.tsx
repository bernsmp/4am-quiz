'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAnalyzerPage() {
  const [url, setUrl] = useState('https://apple.com')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')

  const runTest = async () => {
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const response = await fetch('/api/test-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Test failed')
        return
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Analyzer Test Page</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test PageSpeed & Schema Generation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={runTest} disabled={loading}>
                {loading ? 'Testing...' : 'Run Test'}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}
          </CardContent>
        </Card>

        {results && (
          <>
            {/* PageSpeed Results */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>📊 PageSpeed Results</CardTitle>
              </CardHeader>
              <CardContent>
                {(results.pageSpeed as {error?: string; details?: {note?: string}})?.error ? (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-amber-800 font-semibold mb-2">❌ PageSpeed Failed</p>
                    <p className="text-sm text-amber-700">{String((results.pageSpeed as {error: string}).error)}</p>
                    {(results.pageSpeed as {details?: {note?: string}})?.details?.note && (
                      <p className="text-xs text-amber-600 mt-2">{String((results.pageSpeed as {details: {note: string}}).details.note)}</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {((results.pageSpeed as {details?: {performanceScore?: number}})?.details?.performanceScore) || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Performance</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {((results.pageSpeed as {details?: {seoScore?: number}})?.details?.seoScore) || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">SEO</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {((results.pageSpeed as {details?: {accessibilityScore?: number}})?.details?.accessibilityScore) || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Accessibility</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-amber-600">
                        {((results.pageSpeed as {details?: {bestPracticesScore?: number}})?.details?.bestPracticesScore) || 0}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Best Practices</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schema Results */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>📝 Schema Generation Results</CardTitle>
              </CardHeader>
              <CardContent>
                {(results.schema as {details?: {generatedSchemas?: {recommendations?: string[]; implementationCode?: string}}})?.details?.generatedSchemas ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <p className="font-semibold text-green-800 mb-2">✅ Schemas Generated</p>
                      <ul className="text-sm text-green-700 space-y-1">
                        {((results.schema as {details: {generatedSchemas: {recommendations: string[]}}}).details.generatedSchemas.recommendations || []).map((rec: string, i: number) => (
                          <li key={i}>• {rec}</li>
                        ))}
                      </ul>
                    </div>

                    {(results.schema as {details?: {generatedSchemas?: {implementationCode?: string}}})?.details?.generatedSchemas?.implementationCode && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Generated Code:</h3>
                          <Button
                            size="sm"
                            onClick={() => {
                              const code = (results.schema as {details: {generatedSchemas: {implementationCode: string}}}).details.generatedSchemas.implementationCode
                              navigator.clipboard.writeText(code)
                              alert('Code copied to clipboard!')
                            }}
                          >
                            Copy Code
                          </Button>
                        </div>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                          {(results.schema as {details: {generatedSchemas: {implementationCode: string}}}).details.generatedSchemas.implementationCode}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-600">No schemas generated</div>
                )}
              </CardContent>
            </Card>

            {/* Raw Results */}
            <Card>
              <CardHeader>
                <CardTitle>🔍 Raw Results (Debug)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs max-h-96">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
