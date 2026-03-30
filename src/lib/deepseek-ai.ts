import { encoding_for_model } from 'tiktoken';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Fallback split by characters (roughly 4 chars per token)
function splitByChars(text: string, maxChars: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + maxChars, text.length);
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

function splitByTokens(text: string, maxTokens: number): string[] {
  try {
    const enc = encoding_for_model('gpt-4'); // DeepSeek compatible
    const tokens = enc.encode(text);
    console.log(`Total tokens: ${tokens.length}`);

    if (tokens.length <= maxTokens) {
      return [text]; // no split needed
    }

    const chunks: string[] = [];
    let start = 0;
    while (start < tokens.length) {
      const end = Math.min(start + maxTokens, tokens.length);
      const chunkTokens = tokens.slice(start, end);
      const chunk = enc.decode(chunkTokens);
      chunks.push(chunk as any);
      start = end;
    }
    enc.free(); // optional, free memory
    return chunks;
  } catch (err) {
    console.error('Tokenization failed, falling back to character split', err);
    // fallback: split by characters (safe limit ~5000 chars = ~1250 tokens)
    return splitByChars(text, 5000);
  }
}

async function translateChunk(chunk: string, targetLang: string): Promise<string> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLang}. Preserve the style and nuances of the original text. Output only the translated text.`,
        },
        { role: 'user', content: chunk },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data: any = await response.json();
  return data.choices[0].message.content;
}

export async function translateText(text: string, targetLang: string): Promise<string> {
  // Use 1500 tokens per chunk to leave room for output (max 4000 tokens)
  const maxInputTokens = 1500;
  const chunks = splitByTokens(text, maxInputTokens);
  console.log(`Splitting into ${chunks.length} chunks`);

  const translatedChunks: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Translating chunk ${i + 1}/${chunks.length}`);
    const translated = await translateChunk(chunks[i], targetLang);
    translatedChunks.push(translated);
  }
  return translatedChunks.join('\n\n');
}