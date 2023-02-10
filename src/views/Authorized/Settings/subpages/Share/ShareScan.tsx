import React, { useCallback, useEffect, useState } from 'react'
import { Portal } from '@gorhom/portal'
import { BarCodeScanningResult, Camera, Point } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useWindowDimensions } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import Svg, { Path } from 'react-native-svg'
import { useCameraPermissions } from 'expo-image-picker'

export function ShareScan() {
  const { width, height } = useWindowDimensions()
  const [codeBounds, setCodeBounds] = useState<Point[]>()
  const [permissions, requestPermissions] = useCameraPermissions()

  useEffect(() => {
    if (!permissions) {
      void requestPermissions()
    }
  }, [permissions])

  function onScanned(result: BarCodeScanningResult) {
    console.log(result.bounds)
    setCodeBounds(result.cornerPoints)
  }

  function getPath(bounds: Point[]) {
    return `M ${bounds.map((point) => `${point.x},${point.y}`).join(',')},${bounds[0].x},${bounds[0].y}`
  }

  function parseCode(code: string) {
    if (!code.startsWith('maply/user')) {
      return
    }

    const payload = code
      .substring('maply/user/'.length, code.length)
      .split('/')

    void SheetManager.show('user-profile', {
      payload: {
        userName: payload[0]!,
        name: payload[1]!,
        id: payload[2],
        avatar: payload[3],
      },
    })
  }

  if (codeBounds) {
    console.log(getPath(codeBounds))
  }

  if (!permissions) {
    return null
  }

  if (!permissions.granted) {
    return null
  }

  return (
    <Portal hostName="OuterContentHost">
      <Svg style={{ position: 'absolute', zIndex: 2 }} width={width} height={height}>
        {codeBounds && (
        <Path d={getPath(codeBounds)} fill="red" />
        )}
      </Svg>

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
