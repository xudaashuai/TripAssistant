export interface BaseMessage {
  ToUserName: string;
  FromUserName: string;
  CreateTime: number;
  MsgId: number;
}

export interface TextMessage extends BaseMessage {
  MsgType: "text";
  Content: string;
}

export interface EventMessage extends BaseMessage {
  MsgType: "event";
  Event: string;
}

export type Message = TextMessage | EventMessage;
