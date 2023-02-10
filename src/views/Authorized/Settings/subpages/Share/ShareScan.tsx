import React, { useCallback, useState } from 'react'
import { Portal } from '@gorhom/portal'
import { BarCodeScanningResult, Camera, Point } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useWindowDimensions } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import Svg, { Path } from 'react-native-svg'

export function ShareScan() {
  const { width, height } = useWindowDimensions()
  const [codeBounds, setCodeBounds] = useState<Point[]>()

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

    SheetManager.show('user-profile', {
      payload: {
        userName: payload[0]!,
        name: payload[1]!,
        id: payload[2],
        avatar: payload[3],
      },
    }).then(() => {})
  }

  if (codeBounds) {
    console.log(getPath(codeBounds))
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
