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

export interface VoiceMessage extends BaseMessage {
  MsgType: "voice";
  Recognition?: string;
}

export type Message = TextMessage | EventMessage | VoiceMessage;
