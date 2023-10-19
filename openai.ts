import { ChatCompletionMessage, OpenAI } from "./deps.ts";
import { Message, TextMessage } from "./types.ts";

export const openAI = new OpenAI(Deno.env.get("CHATGPT4_SECRET")!, {
  baseUrl: "https://api.chatanywhere.com.cn",
});

const kvClient = await Deno.openKv();

async function getChatContext(
  message: Message
): Promise<ChatCompletionMessage[] | null> {
  const text = await kvClient.get<string>([`chat_${message.FromUserName}`]);
  console.log(text);
  if (text.value) {
    return JSON.parse(text.value);
  }

  return null;
}

export async function chatgpt(message: TextMessage) {
  if (message.Content === "/:bye") {
    await kvClient.set([`chat_${message.FromUserName}`], JSON.stringify([]));
    return "/:bye";
  }

  const context = (await getChatContext(message)) || [];

  context.push({
    role: "user",
    content: message.Content,
  });

  console.log(context);

  try {
    const response = await openAI.createChatCompletion({
      model: "gpt-4",
      messages: context,
    });

    context.push(response.choices[0].message);

    kvClient.set([`chat_${message.FromUserName}`], JSON.stringify(context));
    return response.choices[0].message.content || "";
  } catch (e) {
    console.error(e);
  }
}
