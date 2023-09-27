const TOKEN = "ppp"; // 替换为你在微信公众平台设置的 Token
import { encodeToString } from "https://deno.land/std/encoding/hex.ts";
async function checkSignature(
  signature: string,
  timestamp: string,
  nonce: string
) {
  const arr = [TOKEN, timestamp, nonce].sort().join("");
  const res = encodeToString(
    new Uint8Array(
      await crypto.subtle.digest("sha-1", new TextEncoder().encode(arr))
    )
  );

  console.log(res, signature);
  return signature === res;
}

Deno.serve(async (req: Request) => {
  console.log(req);
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
});
