import React from 'react'
import { useStore } from 'effector-react'
import {
  StyleSheet, Text, TextInput, View,
} from 'react-native'
import { Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { $user } from '../../../../effector/user/store'
import SafeArea from '../../../../components/SafeArea'
import { useSettings } from '../hooks/useSettings'
import { Avatar } from '../../../../components/Avatar'
import { themes } from '../../../../const/theme'

export function Account() {
  const user = useStore($user)!
  const { goBack } = useNavigation()

  const { formikProps, openPicker, avatar, isLoading, isImageLoading } = useSettings(user)

  return (
    <SafeArea style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Настройки профиля</Text>

        <View style={styles.row}>
          <Avatar user={{ username: user.username, avatar }} size={64} />

          <Button
            mode="contained"
            style={styles.button}
            onPress={openPicker}
            disabled={isImageLoading}
            loading={isImageLoading}
          >
            Изменить аватар
          </Button>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Имя пользователя</Text>
          <TextInput
            value={formikProps.values.name}
            onChangeText={formikProps.handleChange('name')}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ник пользователя</Text>
          <TextInput
            value={formikProps.values.username}
            onChangeText={formikProps.handleChange('username')}
            style={styles.input}
          />
        </View>

        <View style={[styles.row, { marginTop: 32 }]}>
          <Button
            mode="contained"
            loading={isLoading}
            disabled={isLoading}
            onPress={formikProps.submitForm}
          >
            Применить настройки
          </Button>

          <Button
            disabled={isLoading}
            style={styles.button}
            onPress={() => {
              formikProps.resetForm()
              goBack()
            }}
          >
            Отменить
          </Button>
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 12,
  },

  container: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 12,
  },

  input: {
    alignSelf: 'stretch',
    backgroundColor: themes.dark.secondaryBackgroundColor,
    borderRadius: 8,
    color: 'white',
    marginTop: 12,

    padding: 12,
  },

  label: {
    color: 'white',
    fontSize: 16,
  },

  row: {
    alignItems: 'center',
    display: 'flex',

    flexDirection: 'row',
    marginBottom: 24,
  },

  title: {
    color: 'white',
    fontSize: 22,

    marginBottom: 32,
  },
})
