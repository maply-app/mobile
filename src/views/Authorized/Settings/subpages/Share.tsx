import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { PortalHost } from '@gorhom/portal'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TabsView } from '../../../../components/TabsView'
import { ShareCredentials } from './Share/ShareCredentials'
import { ShareScan } from './Share/ShareScan'

export function Share() {
  const { top } = useSafeAreaInsets()
  const { headers, screens } = useMemo(() => ({
    headers: [
      <View key="scanner" style={styles.title}>
        <Icon name="qr-code-scanner" color="white" size={18} />
        <Text style={styles.titleText}>QR-сканнер</Text>
      </View>,
      <View key="credentials" style={styles.title}>
        <Icon name="qr-code" color="white" size={18} />
        <Text style={styles.titleText}>QR-код профиля</Text>
      </View>,
    ],

    screens: [
      <ShareScan key="scan" />,
      <ShareCredentials key="credentials" />,
    ],
  }), [])

  return (
    <View style={{ flex: 1 }}>
      <PortalHost name="OuterContentHost" />
      <View style={styles.headersPortalContainer}>
        <PortalHost name="HeadersHost" />
      </View>

      <View style={styles.container}>
        <TabsView
          headers={headers}
          screens={screens}
          headerPortalHostName="HeadersHost"
          headerContainerStyle={[styles.headers, { marginTop: top }]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    marginTop: 12,
  },

  headers: {
    alignItems: 'center',
    alignSelf: 'center',

    justifyContent: 'center',
    padding: 12,
  },

  headersPortalContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 20,
  },

  title: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
  },

  titleText: {
    color: 'white',
    marginLeft: 4,
  },
})
