/// <reference lib="deno.unstable" />

import { Message } from "./types.ts";

const BASE_URL = "https://api.weixin.qq.com/cgi-bin/";

const client = await createWechatClient();

export enum ENDPOINT {
  USER_INFO = "user/info",
}

export type Request = {
  endpoint: ENDPOINT.USER_INFO;
  payload: {};
};

class WechatClient {
  kvClient: Deno.Kv;
  constructor(kvClient: Deno.Kv) {
    this.kvClient = kvClient;
  }

  async refreshAccessToken() {
    const token = await getAccessToken();
    console.log("access_token", token);
    await this.kvClient.set(["access_token"], token);
    return token;
  }

  async getAccessToken() {
    const tokenFromKv = await this.kvClient.get<string>(["access_token"]);
    if (tokenFromKv.value) {
      return tokenFromKv.value;
    }
    return this.refreshAccessToken();
  }

  async sendMessage(message: Message, content: string) {
    const url = `${BASE_URL}message/custom/send?access_token=${await this.getAccessToken()}`;
    await fetch(
      new Request(url, {
        method: "POST",
        body: JSON.stringify({
          touser: message.FromUserName,
          msgtype: "text",
          text: {
            content,
          },
        }),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  async request(url: string) {
    const res = await fetch(url);

    return res.json();
  }
}

async function getAccessToken(): Promise<string | null> {
  const url = `${BASE_URL}token?grant_type=client_credential&appid=${Deno.env.get(
    "APP_ID"
  )}&secret=${Deno.env.get("APP_SECRET")}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.access_token) {
    return data.access_token;
  } else {
    console.error("Error fetching access token:", data);
    return null;
  }
}

async function createWechatClient(): Promise<WechatClient> {
  return new WechatClient(await Deno.openKv());
}

export default client;
