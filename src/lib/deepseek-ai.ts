import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
/**
 * Split text into chunks of roughly `maxChars` characters,
 * respecting paragraph boundaries.
 */
function splitIntoChunks(text: string, maxLength = 1200): string[] {
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
        content: `You are a translation engine.
        STRICT RULES:
        - Translate the text to ${targetLang}
        - DO NOT explain anything
        - DO NOT add extra sentences
        - DO NOT add introductions
        - DO NOT say anything before or after
        - ONLY return the translated text
        The output must start directly with translation.`,
      },
      { role: "user", content: chunk },
    ],
    model: "deepseek-chat",
    max_tokens: 4000,
    temperature: 0,
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
