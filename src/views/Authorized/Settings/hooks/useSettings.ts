import { useFormik } from 'formik'
import { useState } from 'react'
import { ImagePickerResult, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { User } from '../../../../types/user'
import { updateSettings } from '../../../../effector/user/events'

export function useSettings(user: User) {
  const [image, setImage] = useState<ImagePickerResult>()

  const [avatar, setAvatar] = useState(user.avatar)

  const formikProps = useFormik({
    initialValues: {
      name: user.name,
      username: user.username,
    },
    onSubmit: (values) => {
      updateSettings({
        name: values.name,
        username: values.username,
        image,
      })
    },
    onReset: () => {
      setAvatar(user.avatar)
    },
  })

  function openPicker() {
    const result = launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: MediaTypeOptions.Images,
      quality: 1,
    })

    result.then(((result) => {
      if (result.canceled) {
        return
      }

      setImage(result)
      setAvatar(result.assets?.[0]?.uri ?? user.avatar)
    }))
  }

  return {
    formikProps,
    openPicker,
    avatar,
  }
}
