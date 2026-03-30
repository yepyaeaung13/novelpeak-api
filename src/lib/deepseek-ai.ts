import { encoding_for_model } from 'tiktoken';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const enc = encoding_for_model('gpt-4'); // DeepSeek compatible

function splitByTokens(text: string, maxTokens: number): string[] {
  const tokens = enc.encode(text);
  const chunks: string[] = [];
  let start = 0;
  while (start < tokens.length) {
    const end = Math.min(start + maxTokens, tokens.length);
    const chunkTokens = tokens.slice(start, end);
    const chunk = enc.decode(chunkTokens);
    chunks.push(chunk as any);
    start = end;
  }
  return chunks;
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
      max_tokens: 4000, // ensure enough for output
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
  // Adjust maxTokens per chunk to leave room for output (e.g., 3000 tokens)
  const maxInputTokens = 3000;
  const chunks = splitByTokens(text, maxInputTokens);
  console.log(`Splitting into ${chunks.length} chunks`);

  const translatedChunks: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Translating chunk ${i + 1}/${chunks.length}`);
    translatedChunks.push(await translateChunk(chunks[i], targetLang));
  }
  return translatedChunks.join('\n\n');
}