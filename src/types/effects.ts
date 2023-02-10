import { ImagePickerResult } from 'expo-image-picker'

export interface ChangeSettingsFxProps {
  name?: string;
  username?: string;
  image?: ImagePickerResult
}
