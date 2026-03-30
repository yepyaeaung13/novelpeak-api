import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
/**
 * Split text into chunks of roughly `maxChars` characters,
 * respecting paragraph boundaries.
 */
// function splitIntoChunks(text: string, maxChars = 2000): string[] {
//   // Split by double newline (paragraphs)
//   const paragraphs = text.split(/\n\s*\n/);
//   const chunks: string[] = [];
//   let current = "";

//   for (const para of paragraphs) {
//     if (current.length + para.length + 2 > maxChars && current) {
//       chunks.push(current);
//       current = para;
//     } else {
//       current = current ? `${current}\n\n${para}` : para;
//     }
//   }
//   if (current) chunks.push(current);
//   return chunks;
// }

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
        content: `You are a professional translator. Translate the following text to ${targetLang}. Preserve the style and nuances of the original text. Output only the translated text.`,
      },
      { role: "user", content: chunk },
    ],
    model: "deepseek-chat",
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
  // const chunks = splitIntoChunks(text);
  // const translatedChunks = await Promise.all(
  //   chunks.map((chunk) => translateChunk(chunk, targetLang)),
  // );
  // return translatedChunks.join("\n\n");
  const response = await translateChunk(text, targetLang);
  return response ?? "";
}
