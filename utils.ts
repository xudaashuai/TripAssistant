import { Message } from "./types.ts";

export function buildReplyResponse(replyMessage: Message) {
  return `<xml>
  <ToUserName>${replyMessage.FromUserName}</ToUserName>
  <FromUserName>${replyMessage.ToUserName}</FromUserName>
  <CreateTime>${Date.now()}</CreateTime>
  <MsgType>text</MsgType>
  <Content>谢谢侬</Content>
</xml>`;
}
