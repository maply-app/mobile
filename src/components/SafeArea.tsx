import React from 'react'
import SafeAreaView from 'react-native-safe-area-view'
import { StyleSheet, ViewProps } from 'react-native'
import { themes } from '../const/theme'

export type ForceInsetValue = 'always' | 'never';
export type ForceInsetProp = {
  top?: ForceInsetValue;
  bottom?: ForceInsetValue;
  left?: ForceInsetValue;
  right?: ForceInsetValue;
  horizontal?: ForceInsetValue;
  vertical?: ForceInsetValue;
};

interface Props extends ViewProps {
  forceInset?: ForceInsetProp;
}

function SafeArea({ style, ...otherProps }: Props) {
  return <SafeAreaView {...otherProps} style={[styles.view, style]} />
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: themes.dark.backgroundColor,
  },
})

export default SafeArea
