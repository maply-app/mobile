import { webSocketURL } from '../const/web'
import { WebsocketEventType, WebSocketPayload } from '../types/ws'
import {
  friendRemoved, requestDeclined, requestReceived, wsRequestAccepted, wsUpdateFriendsLocation,
} from '../effector/user/events'

interface Config { token: string, reconnect: boolean }

export class WebSocketManager {
  private static open: boolean

  private static connection: WebSocket

  private static readonly config: Config

  private static initialize(config: Config) {
    const connection = new WebSocket(`${webSocketURL}?Token=${config.token}`)

    connection.onopen = WebSocketManager.onOpen
    connection.onclose = WebSocketManager.onClose
    connection.onmessage = WebSocketManager.onMessage

    return connection
  }

  private static onOpen() {
    console.log('WEBSOCKET CONNECTION SUCCESSFULLY OPENED')
    this.open = true
  }

  private static onClose() {
    console.log('WEBSOCKET CONNECTION CLOSED')
    this.open = false

    if (this.config.reconnect) {
      this.initialize(this.config)
    }
  }

  private static onMessage(event: MessageEvent) {
    const payload = <WebSocketPayload>JSON.parse(event.data)

    if (payload.event !== WebsocketEventType.FriendsStats) {
      console.log(
        `WEBSOCKET EVENT TYPE: ${payload.event} VALUE: ${JSON.stringify(
          payload.data,
        )}`,
      )
    }

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
      default: {
        break
      }
    }
  }

  public static openConnection(config: Config) {
    if (!WebSocketManager.open) {
      WebSocketManager.connection = WebSocketManager.initialize(config)
    }
  }

  public static closeConnection() {
    if (WebSocketManager.open) {
      WebSocketManager.connection.close()
    }
  }
}
