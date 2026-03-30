// DeepSeek API endpoint (chat completions)
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export function splitTextIntoChunks(text: string, maxChunkLength: number = 2000): string[] {
  // split by double newline (paragraphs)
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = '';
  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxChunkLength && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = para;
    } else {
      currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

// Helper: call DeepSeek for translation
export async function translateChunk(chunk: string, targetLang: string) {
  const response = await fetch(DEEPSEEK_API_URL, {
    // ... same as before, but with max_tokens
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLang}. Preserve style and nuances. Output only the translated text.`,
        },
        { role: "user", content: chunk },
      ],
      temperature: 0.3,
      max_tokens: 4000, // set appropriate limit
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data: any = await response.json();
  return data.choices[0].message.content;
}
