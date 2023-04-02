import { UserInfo } from './user'
import { ApiMessage } from './chat'

interface EventEmitter {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isAdmin: boolean;
}

export enum WebsocketEventType {
  CancelRequest = 'cancelRequest',
  SendRequest = 'sendRequest',
  ConfirmRequest = 'confirmRequest',
  DeleteFriend = 'deleteFriend',
  FriendsStats = 'friendsStats',
  NewMessage = 'newMessage',
  MessagesRead = 'readMessages'
}

type WebSocketData<T extends WebsocketEventType, U extends object> = { event: T, data: U };

export type WebSocketPayload =
  WebSocketData<WebsocketEventType.CancelRequest, { id: string }> | // id = request id
  WebSocketData<WebsocketEventType.DeleteFriend, { id: string }> | // id = user id
  WebSocketData<WebsocketEventType.SendRequest, { id: string, sender: EventEmitter }> |
  WebSocketData<WebsocketEventType.ConfirmRequest, { id: string; receiverID: string; receiver: EventEmitter }> | // request id
  WebSocketData<WebsocketEventType.FriendsStats, { [key: string]: Required<UserInfo['coords']> }> |
  WebSocketData<WebsocketEventType.NewMessage, ApiMessage> |
  WebSocketData<WebsocketEventType.MessagesRead, { userId: string }>
