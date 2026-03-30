
// DeepSeek API endpoint (chat completions)
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Helper: call DeepSeek for translation
export async function translateText(text: string, targetLang: string) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat', // or 'deepseek-coder' if preferred
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following text to ${targetLang}. Preserve the style and nuances of the original text. Output only the translated text.`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.3, // lower = more deterministic
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  const data: any = await response.json();
  return data.choices[0].message.content;
}