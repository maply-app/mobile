import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { User } from './user'

export type ScreenProps = {
  Home: undefined;
  Search: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Info: undefined;
  Conversation: User;
  Conversations: undefined;

  // settings
  Settings: undefined;
  Share: undefined;

  Security: undefined;
  Theming: undefined;
  Notifications: undefined;
  Premium: undefined;
  Account: undefined;
};

export type NavigationProps = NativeStackScreenProps<ScreenProps>['navigation'];
