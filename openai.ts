import { OpenAI } from "https://deno.land/x/openai@1.4.2/mod.ts";
export const openAI = new OpenAI(Deno.env.get("CHATGPT_SECRET")!, {
  baseUrl: "https://api.chatanywhere.cn",
});

export async function chatgpt(content: string) {
  try {
    const response = await openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    });
    return response.choices[0].message.content;
  } catch (e) {
    console.error(e);
  }
}
