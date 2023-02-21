import { webSocketURL } from '../const/web'
import { WebsocketEventType, WebSocketPayload } from '../types/ws'
import {
  friendRemoved,
  requestDeclined,
  requestReceived,
  wsMessageReceived,
  wsMessagesRead,
  wsRequestAccepted,
  wsUpdateFriendsLocation,
} from '../effector/user/events'

interface Config { token: string, reconnect: boolean }

export class WebSocketManager {
  private static open: boolean

  private static connection: WebSocket

  private static config: Config

  private static initialize(config: Config) {
    this.config = config
    const connection = new WebSocket(`${webSocketURL}?Token=${config.token}`)

    connection.onopen = () => console.log('Opened')
    connection.onclose = WebSocketManager.onClose.bind(this)
    connection.onmessage = WebSocketManager.onMessage.bind(this)

    return connection
  }

  private static onClose() {
    if (this.open) {
      this.open = false

      if (this.config.reconnect) {
        this.initialize(this.config)
      }
    }
  }

  private static onMessage(event: MessageEvent) {
    const payload = <WebSocketPayload>JSON.parse(event.data)

    switch (payload.event) {
      case WebsocketEventType.FriendsStats: {
        wsUpdateFriendsLocation(payload.data)
        break
      }
      case WebsocketEventType.SendRequest: {
        requestReceived({
          id: payload.data.id,
          senderID: payload.data.sender.id,
          sender: payload.data.sender,
        })

        break
      }
      case WebsocketEventType.DeleteFriend: {
        friendRemoved(payload.data.id)
        break
      }
      case WebsocketEventType.ConfirmRequest: {
        wsRequestAccepted(payload.data)
        break
      }
      case WebsocketEventType.CancelRequest: {
        requestDeclined(payload.data.id)
        break
      }
      case WebsocketEventType.MessagesRead: {
        wsMessagesRead(payload.data.userId)
        break
      }
      case WebsocketEventType.NewMessage: {
        wsMessageReceived(payload.data)
        break
      }
      default: {
        break
      }
    }
  }

  public static openConnection(config: Config) {
    if (!WebSocketManager.open) {
      this.open = true
      WebSocketManager.connection = WebSocketManager.initialize(config)
    }
  }

  public static closeConnection() {
    if (WebSocketManager.open) {
      WebSocketManager.connection.close()
    }
  }
}
