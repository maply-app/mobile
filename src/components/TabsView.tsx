import React, { useMemo, useState } from 'react'
import {
  StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native'
import { Portal } from '@gorhom/portal'

type Key = number;

interface Props {
  defaultKey?: Key;
  headers: React.ReactElement[];
  screens: React.ReactElement[];

  headerContainerStyle?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle | ViewStyle[];

  headerPortalHostName?: string;
}

export function TabsView({
  defaultKey, headerPortalHostName, headers, headerContainerStyle, containerStyle, screens,
}: Props) {
  const [currentKey, setCurrentKey] = useState<Key>(defaultKey ?? 0)

  const containerStyles = Array.isArray(containerStyle)
    ? [styles.container, ...containerStyle]
    : [styles.container, containerStyle]

  const headerStyles = useMemo(
    () => (Array.isArray(headerContainerStyle)
      ? [styles.headers, ...headerContainerStyle]
      : [styles.headers, headerContainerStyle]),
    [headerContainerStyle],
  )

  const uiHeaders = useMemo(
    () => (
      <View style={headerStyles}>
        {headers.map((header, index) => (
          <TouchableOpacity
            key={header.key}
            onPress={() => setCurrentKey(index)}
            style={[
              styles.header,
              index + 1 !== headers.length
                ? styles.marginRight
                : undefined,
            ]}
          >
            <View>{header}</View>
            <View
              style={[
                styles.activeIndicator,
                currentKey === index && styles.visible,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    ),
    [currentKey, headerStyles, headers],
  )

  return (
    <View style={containerStyles}>
      {headerPortalHostName ? (
        <Portal hostName={headerPortalHostName}>{uiHeaders}</Portal>
      ) : uiHeaders}
      {screens[currentKey]}
    </View>
  )
}

const styles = StyleSheet.create({
  activeIndicator: {
    backgroundColor: '#eebefa',
    height: 2,
    marginTop: '2%',
    opacity: 0,
    width: '100%',
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '1%',
  },

  headers: {
    display: 'flex',
    flexDirection: 'row',
  },

  marginRight: {
    marginRight: 12,
  },

  visible: {
    opacity: 1,
  },
})
