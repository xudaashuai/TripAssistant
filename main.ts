const TOKEN = Deno.env.get("WECHAT_TOKEN"); // 替换为你在微信公众平台设置的 Token

import { EventMessage, Message, TextMessage } from "./types.ts";
import { buildReplyResponse } from "./utils.ts";
import { chatgpt } from "./openai.ts";
import { encodeHex, parse } from "./deps.ts";

async function checkSignature(
  signature: string,
  timestamp: string,
  nonce: string
) {
  const arr = [TOKEN, timestamp, nonce].sort().join("");
  const res = encodeHex(
    await crypto.subtle.digest("sha-1", new TextEncoder().encode(arr))
  );

  console.log(res, signature);
  return signature === res;
}

async function handleGet(req: Request) {
  const url = new URL(req.url, `http://${req.headers.get("host")}`);
  const signature = url.searchParams.get("signature") || "";
  const timestamp = url.searchParams.get("timestamp") || "";
  const nonce = url.searchParams.get("nonce") || "";
  const echostr = url.searchParams.get("echostr") || "";

  console.log(signature, timestamp, nonce, echostr);
  if (await checkSignature(signature, timestamp, nonce)) {
    return new Response(echostr);
  }
  return new Response();
}

function handleEvent(message: EventMessage) {
  if (message.Event === "subscribe") {
    return new Response(
      buildReplyResponse(
        message,
        "大家好，我是403旅行助手，很高兴为你们的2023年的旅行提供帮助和建议。无论是行程规划、酒店预订还是旅行小贴士，我都在这里为你们服务。请告诉我你们的需求，让我们一起让这次旅行更加完美！"
      )
    );
  }
  return new Response();
}

async function handleTextMessage(message: TextMessage) {
  return new Response(buildReplyResponse(message, await chatgpt(message)));
}

async function handlePost(req: Request) {
  const message = parse(await req.text()).xml as unknown as Message;
  console.log(message);

  if (message.MsgType === "event") {
    return handleEvent(message);
  }
  if (message.MsgType === "voice" && message.Recognition) {
    return handleTextMessage({
      ...message,
      MsgType: "text",
      Content: message.Recognition,
    });
  }

  if (message.MsgType === "text") {
    return handleTextMessage(message);
  }

  return new Response();
}

Deno.serve(async (req: Request) => {
  if (req.method === "GET") {
    return handleGet(req);
  }
  const response = await handlePost(req);
  console.log(await response.text());
  return response;
});
