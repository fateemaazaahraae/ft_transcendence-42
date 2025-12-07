export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: number;
};

export type NewMessageEvent = { conversation: any; message: Message };
