const TOKEN = "ppp"; // 替换为你在微信公众平台设置的 Token

function checkSignature(
  signature: string,
  timestamp: string,
  nonce: string
): boolean {
  const arr = [TOKEN, timestamp, nonce].sort().join("");
  const computedSignature = new TextEncoder().encode(arr);
  const hash = new Uint8Array(20);
  crypto.subtle.digest("SHA-1", computedSignature).then((digest) => {
    hash.set(new Uint8Array(digest));
  });
  return (
    signature ===
    Array.from(hash)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

Deno.serve((req: Request) => {
  console.log(req);
  const url = new URL(req.url, `http://${req.headers.get("host")}`);
  const signature = url.searchParams.get("signature") || "";
  const timestamp = url.searchParams.get("timestamp") || "";
  const nonce = url.searchParams.get("nonce") || "";
  const echostr = url.searchParams.get("echostr") || "";

  console.log(signature, timestamp, nonce, echostr);
  if (checkSignature(signature, timestamp, nonce)) {
    return new Response(echostr);
  }
  return new Response();
});
