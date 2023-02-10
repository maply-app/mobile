import React from 'react'
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native'
import { useStore } from 'effector-react'
import { Image } from 'expo-image'
import { useAssets } from 'expo-asset'
import SafeArea from '../../../../components/SafeArea'
import { $map, $theme } from '../../../../effector/ui/store'
import { AppTheme, MapStyle } from '../../../../types/theming'
import { changeMapStyle } from '../../../../effector/ui/relations'

export function Theming() {
  const theme = useStore($theme)
  const mapStyle = useStore($map).style

  const assets = useAssets(
    [
      require('../../../../assets/settings/map-light.png'),
      require('../../../../assets/settings/map-dark.png'),
      require('../../../../assets/settings/map-sputnik.png'),
    ],
  )

  const mapSchemeLight = assets?.[0]?.[0]
  const mapSchemeDark = assets?.[0]?.[1]
  const mapSputnik = assets?.[0]?.[2]

  return (
    <SafeArea style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Внешний вид</Text>

        <Text style={styles.subtitle}>Настройки карты</Text>

        {mapSchemeLight && mapSchemeDark && mapSputnik && (
          <View style={styles.mapStyles}>
            <View style={[styles.alignCenter, { opacity: mapStyle === MapStyle.Scheme ? 1 : 0.6 }]}>
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderRadius: 15,
                  borderColor: mapStyle === MapStyle.Scheme ? 'white' : 'transparent',
                }}
                onPress={() => changeMapStyle(MapStyle.Scheme)}
              >
                <Image
                  style={styles.mapPreset}
                  source={{ uri: theme === AppTheme.Dark ? mapSchemeDark.uri : mapSchemeLight.uri }}
                />
              </TouchableOpacity>

              <Text style={styles.styleTitle}>Схематическая карта</Text>
            </View>

            <View style={[styles.alignCenter, { opacity: mapStyle === MapStyle.Sputnik ? 1 : 0.6 }]}>
              <TouchableOpacity
                style={{
                  borderWidth: 2,
                  borderColor: mapStyle === MapStyle.Sputnik ? 'white' : 'transparent',
                  borderRadius: 15,
                }}
                onPress={() => changeMapStyle(MapStyle.Sputnik)}
              >
                <Image
                  style={styles.mapPreset}
                  source={{ uri: mapSputnik.uri }}
                />
              </TouchableOpacity>

              <Text style={styles.styleTitle}>Спутник</Text>
            </View>
          </View>
        )}
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  alignCenter: {
    alignItems: 'center',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  container: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },

  mapPreset: {
    borderRadius: 15,
    height: 128,
    margin: 3,
    width: 128,
  },

  mapStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  styleTitle: {
    color: 'white',
    marginTop: 12,
  },

  subtitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',

    marginBottom: 16,
  },

  title: {
    color: 'white',
    fontSize: 22,

    marginBottom: 32,
  },
})
