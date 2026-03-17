export async function generateInsights(subscriptions) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-insights`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptions })
      }
    )
    const data = await response.json()
    return data.insights
  } catch (error) {
    console.error('OpenAI insights error:', error)
    return []
  }
}