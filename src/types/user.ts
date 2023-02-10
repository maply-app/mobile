export interface UserInfo {
  coords?: {
    geo: {
      coords: {
        lat: number;
        lon: number;
      };
      speed: number;
      direction: number;
    };

    info: {
      battery: number;
    };

    isOnline: boolean;
    lastUpdate?: number;
  }
}

export interface User {
  id: string;

  name: string;
  username: string;
  email: string;

  isAdmin: boolean;

  avatar?: string;
  friends?: User[];

  info?: UserInfo;
}

export interface FriendRequestUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isAdmin: boolean;
}

export interface ReceivedRequest {
  id: string;
  senderID: string;
  sender: FriendRequestUser;
}

export interface SentRequest {
  id: string;
  receiverID: string;
  receiver: FriendRequestUser;
}
