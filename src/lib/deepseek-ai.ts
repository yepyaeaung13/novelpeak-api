import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
/**
 * Split text into chunks of roughly `maxChars` characters,
 * respecting paragraph boundaries.
 */
function splitIntoChunks(text: string, maxLength = 2000): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of text.split("\n")) {
    if ((current + paragraph).length > maxLength) {
      chunks.push(current);
      current = paragraph;
    } else {
      current += (current ? "\n" : "") + paragraph;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

/**
 * Translate a single chunk via DeepSeek.
 */
async function translateChunk(
  chunk: string,
  targetLang: string,
): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a professional translator. Translate the following text to ${targetLang}. Preserve style and nuance. Do NOT summarize. Do NOT omit anything. Translate FULL text.`,
      },
      { role: "user", content: chunk },
    ],
    model: "deepseek-chat",
    max_tokens: 4000,
  });

  return completion.choices[0].message.content ?? "";
}

/**
 * Main translation function: splits text, translates each chunk, joins.
 */
export async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  const chunks = splitIntoChunks(text, 2000);

  const translatedChunks: string[] = [];

  for (const chunk of chunks) {
    const res = await translateChunk(chunk, targetLang);
    translatedChunks.push(res);
  }

  return translatedChunks.join("\n\n");
}
