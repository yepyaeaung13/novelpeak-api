import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a professional translator and editor specializing in the Myanmar language. First, translate the following text accurately, preserving the style and nuances of the original. Then, review and edit the translation to ensure it is highly readable, uses modern vocabulary, and flows naturally for contemporary Myanmar readers. Output only the final edited text.",
        // content: `You are a professional translator. Translate the following text to ${targetLang}. Preserve the style and nuances of the original text. Output only the translated text.`,
        // content: `You are a professional translator. Translate the following text to ${targetLang}. Preserve the original formatting, including line breaks and paragraphs. If the original lacks structure, add appropriate line breaks to enhance readability. Output only the translated text.`
      },
      { role: "user", content: text },
    ],
    model: "deepseek-reasoner",
  });

  return completion.choices[0].message.content ?? "";
}
