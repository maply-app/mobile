import React, { useState } from 'react'
import {
  StyleSheet, Text, View, TextInput,
} from 'react-native'
import { Button } from 'react-native-paper'
import { Link } from '@react-navigation/native'
import { useStore } from 'effector-react'
import { useAssets } from 'expo-asset'
import { Image } from 'expo-image'
import SafeArea from '../../components/SafeArea'
import { $errors, $pending } from '../../effector/ui/store'
import { signIn } from '../../effector/user/events'
import { themes } from '../../const/theme'

export function SignIn() {
  const [email, setEmail] = useState(__DEV__ ? 'user2@example.com' : '')
  const [password, setPassword] = useState(__DEV__ ? 'Q1w1e1r1t1y!@' : '')

  const logo = useAssets(require('../../assets/logo.png'))[0]!

  const errors = useStore($errors)
  const pending = useStore($pending)

  return (
    <SafeArea style={{ flex: 1 }}>
      <View style={styles.container}>
        {logo && <Image source={{ uri: logo[0].uri }} style={styles.logo} />}

        {errors.signIn && <Text style={styles.error}>Неверный логин или пароль</Text>}

        <View style={styles.uiContainer}>
          <Text style={styles.label}>E-mail пользователя</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.field}
            placeholder="Ваша почта"
            placeholderTextColor={themes.dark.primaryColor}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Пароль</Text>

          <TextInput
            secureTextEntry
            placeholder="Ваш пароль"
            value={password}
            placeholderTextColor={themes.dark.primaryColor}
            onChangeText={setPassword}
            style={styles.field}
            autoCapitalize="none"
          />

          <Button
            loading={pending.signIn}
            style={styles.button}
            mode="contained"
            onPress={() => signIn({ email, password })}
          >
            Войти
          </Button>

          <Text style={styles.text}>
            Нет аккаунта?
            {' '}
            <Link style={styles.link} to="/SignUp">
              Зарегистрироваться
            </Link>
          </Text>
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    borderRadius: 15,
    marginTop: 24,
  },

  container: {
    alignItems: 'center',
    backgroundColor: themes.dark.backgroundColor,

    display: 'flex',
    flex: 1,
    justifyContent: 'center',

    paddingBottom: 96,
  },

  error: {
    color: themes.dark.error,
    fontSize: 16,
    marginBottom: 24,
  },

  field: {
    backgroundColor: themes.dark.secondaryBackgroundColor,
    borderRadius: 8,
    borderWidth: 0,

    color: 'white',
    marginBottom: 6,

    marginTop: 6,
    padding: 12,
  },

  label: {
    color: themes.dark.primaryColor,
    fontSize: 16,
    marginTop: 12,
  },

  link: {
    color: '#eebefa',
  },

  logo: {
    height: 120,
    marginBottom: 32,
    width: 100,
  },

  text: {
    color: 'white',
    marginTop: 12,
    textAlign: 'center',
  },

  uiContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
  },
})
