import React, {
  useEffect, useRef,
} from 'react'
import { Portal } from '@gorhom/portal'
import { BarCodeScanningResult, Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useWindowDimensions } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import { useCameraPermissions } from 'expo-image-picker'

export function ShareScan() {
  const { width, height } = useWindowDimensions()
  const [permissions, requestPermissions] = useCameraPermissions()

  const timeoutId = useRef(-1)
  const lastQrData = useRef<string>()

  useEffect(() => {
    if (!permissions) {
      void requestPermissions()
    }
  }, [permissions])

  function onScanned(result: BarCodeScanningResult) {
    if (lastQrData.current !== result.data) {
      if (timeoutId.current !== -1) {
        clearTimeout(timeoutId.current)
      }

      lastQrData.current = result.data

      timeoutId.current = setTimeout(() => {
        if (!result.data.startsWith('maply/user')) {
          return
        }

        const payload = result.data
          .substring('maply/user/'.length, result.data.length)
          .split('/')

        void SheetManager.show('scanned-user', {
          payload: {
            userName: payload[0]!,
            name: payload[1]!,
            id: payload[2],
            avatar: payload[3],
          },
        })

        lastQrData.current = undefined
        timeoutId.current = -1
      }, 1500) as unknown as number
    }
  }

  if (!permissions) {
    return null
  }

  if (!permissions.granted) {
    return null
  }

  return (
    <Portal hostName="OuterContentHost">
      <Camera
        style={{ width, height }}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={onScanned}
      />
    </Portal>
  )
}
