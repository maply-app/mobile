import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { NavigationProps } from '../../../types/navigation'
import { signOut } from '../../../effector/user/events'

interface SettingsItem {
  key: string;

  icon?: {
    name: string
    color?: string
    backgroundColor?: string
  }

  content?: string;
  action?: () => void;

  containerStyle?: ViewStyle;
  contentStyle?: TextStyle;

  disabled?: boolean;
}

export function useSettingsNavigation(): SettingsItem[] {
  const { navigate } = useNavigation<NavigationProps>()

  return useMemo<SettingsItem[]>(() => [
    {
      key: 'account-settings',
      content: 'Настройки профиля',
      icon: {
        name: 'person',
      },
      action: () => navigate('Account'),
    },
    {
      key: 'security',
      content: 'Конфендициальность и безопасность',
      icon: {
        name: 'lock',
      },
      action: () => navigate('Security'),
      disabled: true,
    },
    {
      key: 'theming',
      content: 'Внешний вид',
      icon: {
        name: 'palette',
      },
      action: () => navigate('Theming'),
    },
    {
      key: 'notifications',
      content: 'Настройки уведомлений',
      icon: {
        name: 'notifications',
      },
      action: () => navigate('Notifications'),
      disabled: true,
    },
    {
      key: 'premium',
      content: 'Maply Premium',
      icon: {
        name: 'local-fire-department',
      },
      action: () => navigate('Premium'),
      disabled: true,
    },
    {
      key: 'exit',
      content: 'Выйти из аккаунта',
      action: signOut,

      containerStyle: {
        marginTop: 32,
      },

      contentStyle: {
        color: 'red',
        marginLeft: 0,
      },
    },
  ], [])
}
