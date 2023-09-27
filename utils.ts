import { Message } from "./types.ts";

export function buildReplyResponse(replyMessage: Message, content?: string) {
  return `<xml>
  <ToUserName>${replyMessage.FromUserName}</ToUserName>
  <FromUserName>${replyMessage.ToUserName}</FromUserName>
  <CreateTime>${Date.now()}</CreateTime>
  <MsgType>text</MsgType>
  <Content>${content}</Content>
</xml>`;
}
