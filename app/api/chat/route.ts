import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'

export const maxDuration = 30

const ALLOWED_MODELS = [
  'openai/gpt-5-mini',
  'openai/gpt-5',
  'anthropic/claude-opus-4.6',
]

export async function POST(req: Request) {
  const { messages, model: requestedModel }: { messages: UIMessage[]; model?: string } = await req.json()

  const model = requestedModel && ALLOWED_MODELS.includes(requestedModel) ? requestedModel : 'openai/gpt-5-mini'

  const result = streamText({
    model,
    system: `You are Ariyan AI, an advanced AI assistant. You are helpful, precise, and creative. 
You provide clear, well-structured responses. When asked about code, provide clean, well-commented examples.
You format your responses with proper markdown when helpful.`,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
