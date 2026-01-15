const DEFAULT_RETRIES = 2
const DEFAULT_BASE_DELAY_MS = 500

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const isRetryableError = (error: unknown) => {
  if (!error || typeof error !== "object") return false
  const record = error as { status?: number; statusCode?: number; message?: string }
  const status = record.status ?? record.statusCode
  const message = record.message ?? ""
  return status === 503 || /503|overloaded|service unavailable/i.test(message)
}

const stripCodeFences = (text: string) =>
  text.replace(/```json/gi, "").replace(/```/g, "").trim()

const extractJsonBlock = (text: string, open: "{" | "[", close: "}" | "]") => {
  const start = text.indexOf(open)
  const end = text.lastIndexOf(close)
  if (start === -1 || end === -1 || end <= start) return undefined
  return text.slice(start, end + 1).trim()
}

export const parseJsonResponse = <T>(text: string): T => {
  const cleaned = stripCodeFences(text)
  const candidates = [
    cleaned,
    extractJsonBlock(cleaned, "{", "}"),
    extractJsonBlock(cleaned, "[", "]"),
  ].filter((candidate): candidate is string => Boolean(candidate))

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T
    } catch {
      continue
    }
  }

  throw new Error("AI response was not valid JSON.")
}

type GenerateResult = { response: { text: () => string } }

export const generateTextWithRetry = async (
  generate: () => Promise<GenerateResult>,
  options?: { retries?: number; baseDelayMs?: number }
) => {
  const retries = options?.retries ?? DEFAULT_RETRIES
  const baseDelayMs = options?.baseDelayMs ?? DEFAULT_BASE_DELAY_MS
  let attempt = 0

  while (true) {
    try {
      const result = await generate()
      const response = await result.response
      return response.text()
    } catch (error) {
      if (!isRetryableError(error) || attempt >= retries) {
        throw error
      }
      const delay = baseDelayMs * 2 ** attempt
      attempt += 1
      await sleep(delay)
    }
  }
}
