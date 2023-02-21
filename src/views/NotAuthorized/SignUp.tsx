import React, { useEffect } from 'react'
import {
  StyleSheet, Text, View, TextInput,
} from 'react-native'
import { Link, useNavigation } from '@react-navigation/native'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { Button } from 'react-native-paper'
import { useStore } from 'effector-react'
import { useAssets } from 'expo-asset'
import { Image } from 'expo-image'
import { createEvent, createStore, sample } from 'effector'
import SafeArea from '../../components/SafeArea'
import { signUp } from '../../effector/user/events'
import { themes } from '../../const/theme'
import { signUpFx } from '../../effector/user/effects/user'
import { NavigationProps } from '../../types/navigation'

const bodySchema = object().shape({
  name: string()
    .required('Данное поле обязательно!')
    .trim()
    .min(2, 'Минимальная длина имени - 2 символа')
    .max(24, 'Максимальная длина имени - 24 символа'),
  username: string()
    .required('Данное поле обязательно!')
    .trim()
    .min(4, 'Минимальная длина ника - 4 символа')
    .max(24, 'Максимальная длина ника - 24 символа'),

  email: string()
    .required('Данное поле обязательно!')
    .email('Некорректная почта'),

  password: string()
    .required('Данное поле обязательно!')
    .trim()
    .test(
      'only alphabet',
      'Недопустимые символы в пароле',
      (v) => !!v && /^[\w!@#$%^&*()_+"№:,.;-]+$/.test(v),
    )
    .min(8, 'Минимальная длина пароля - 8 символов.')
    .max(24, 'максимальная длина пароля - 24 символа.'),
})

enum SignUpStatus {
  NotSent,
  Loading,
  Success,
  Fail
}

const requestPending = createEvent()

const $signUpStatus = createStore(SignUpStatus.NotSent)
  .on(requestPending, () => SignUpStatus.Loading)
  .on(signUpFx.failData, () => SignUpStatus.Fail)
  .on(signUpFx.doneData, () => SignUpStatus.Success)

sample({
  clock: signUpFx.pending,
  target: requestPending,
  filter: (pending) => pending,
})

export function SignUp() {
  const { navigate } = useNavigation<NavigationProps>()

  const status = useStore($signUpStatus)
  const logo = useAssets(require('../../assets/logo.png'))[0]!

  useEffect(() => {
    if (status === SignUpStatus.Success) {
      navigate('SignIn')
    }
  }, [status])

  return (
    <SafeArea>
      <View style={styles.container}>
        {logo && <Image source={{ uri: logo[0].uri }} style={styles.logo} />}

        {status === SignUpStatus.Fail && (<Text style={styles.errorText}>Ошибка регистрации</Text>)}

        <View style={styles.uiContainer}>
          <Formik
            initialValues={{
              name: '',
              username: '',
              password: '',
              email: '',
            }}
            onSubmit={signUp}
            validationSchema={bodySchema}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isValid,
              errors,
            }) => (
              <View>
                <Text style={styles.label}>Имя пользователя</Text>
                <TextInput
                  style={styles.field}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  placeholderTextColor={themes.dark.primaryColor}
                  autoCapitalize="none"
                  placeholder="Ваше имя"
                />
                {errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
                <Text style={styles.label}>Ник пользователя</Text>
                <TextInput
                  style={styles.field}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  placeholderTextColor={themes.dark.primaryColor}
                  autoCapitalize="none"
                  placeholder="Ваш ник"
                />
                {errors.username ? (
                  <Text style={styles.errorText}>{errors.username}</Text>
                ) : null}

                <Text style={styles.label}>E-mail пользователя</Text>
                <TextInput
                  style={styles.field}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholderTextColor={themes.dark.primaryColor}
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  placeholder="Ваша почта"
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}

                <Text style={styles.label}>Пароль пользователя</Text>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  placeholderTextColor={themes.dark.primaryColor}
                  style={styles.field}
                  autoCapitalize="none"
                  secureTextEntry
                  placeholder="Ваш Пароль"
                />
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}

                <Button
                  style={styles.button}
                  mode="contained"
                  disabled={!isValid || values.name.length === 0}
                  loading={status === SignUpStatus.Loading}
                  onPress={() => handleSubmit()}
                >
                  Зарегистрироваться
                </Button>

                <Text style={styles.text}>
                  Есть аккаунт?
                  {' '}
                  <Link style={styles.link} to="/SignIn">
                    Войти
                  </Link>
                </Text>
              </View>
            )}
          </Formik>
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
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },

  errorText: {
    color: 'red',
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
    marginTop: '5%',
    textAlign: 'center',
  },

  uiContainer: {
    display: 'flex',
    width: '80%',
  },
})
