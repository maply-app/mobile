import { useFormik } from 'formik'
import { useState } from 'react'
import { ImagePickerResult, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { User } from '../../../../types/user'
import { updateSettingsFx } from '../../../../effector/user/effects/user'
import { useNavigation } from '@react-navigation/native'
import { useStore } from 'effector-react'

export function useSettings(user: User) {
  const [image, setImage] = useState<ImagePickerResult>()
  const { goBack } = useNavigation()

  const isLoading = useStore(updateSettingsFx.pending)
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [avatar, setAvatar] = useState(user.avatar)

  const formikProps = useFormik({
    initialValues: {
      name: user.name,
      username: user.username,
    },
    onSubmit: (values) => {
      updateSettingsFx({
        name: values.name,
        username: values.username,
        image,
      }).then(() => goBack())
    },
    onReset: () => {
      setAvatar(user.avatar)
    },
  })

  function openPicker() {
    setIsImageLoading(true);

    const result = launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: MediaTypeOptions.Images,
      quality: 1,
    })

    result.then(((result) => {
      setIsImageLoading(false);

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

    isLoading,
    isImageLoading
  }
}
