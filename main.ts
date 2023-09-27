const TOKEN = Deno.env.get("WECHAT_TOKEN"); // 替换为你在微信公众平台设置的 Token
import { encodeHex } from "https://deno.land/std@0.203.0/encoding/hex.ts";
import { parse } from "https://deno.land/x/xml@2.1.1/mod.ts";
import { EventMessage, Message } from "./types.ts";
import { buildReplyResponse } from "./utils.ts";

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
  if (message.event === "subscribe") {
    return new Response(buildReplyResponse(message));
  }
  return new Response();
}

async function handlePost(req: Request) {
  const message = parse(await req.text()).xml as unknown as Message;
  console.log(message);

  if (message.MsgType === "event") {
    return handleEvent(message);
  }

  return new Response();
}

Deno.serve(async (req: Request) => {
  if (req.method === "GET") {
    return handleGet(req);
  }
  const response = await handlePost(req);
  console.log(response);
  return response;
});
