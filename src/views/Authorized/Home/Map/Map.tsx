import React, { useEffect, useMemo, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import MapboxGL from '@rnmapbox/maps'
import { useStore } from 'effector-react'
import { IconButton } from 'react-native-paper'
import { $friends, $user } from '../../../../effector/user/store'
import { useBottomSheetNavigation } from '../../../../hooks/useBottomSheetNavigation'
import {
  changeBounds, changeMapCameraRef, changeZoom,
} from '../../../../effector/ui/relations'
import { UserMarker } from './Marker'
import { useMapStyles } from './useMapStyles'

export function Map() {
  const user = useStore($user)!
  const friends = useStore($friends)

  const { coords } = user.info!.coords.geo
  const navigate = useBottomSheetNavigation()

  const cameraRef = useRef<MapboxGL.Camera>(null)
  const styleUrl = useMapStyles()

  const camera = useMemo(
    () => (coords ? (
      <MapboxGL.Camera
        ref={cameraRef}
        centerCoordinate={[coords.lon, coords.lat]}
        zoomLevel={14}
        animationDuration={0}
      />
    ) : null),
    [],
  )

  useEffect(() => {
    if (cameraRef.current) {
      changeMapCameraRef(cameraRef.current)
    }
  }, [cameraRef.current])

  return (
    <>
      <View style={styles.buttonsView}>
        <IconButton
          style={styles.gpsButton}
          icon="crosshairs-gps"
          mode="contained"
          size={32}
          onPress={() => navigate(user, { openBottomSheet: false })}
        />
      </View>

      <MapboxGL.MapView
        style={styles.mapView}
        scaleBarEnabled={false}
        onRegionIsChanging={(region) => {
          changeZoom(region.properties.zoomLevel)
          changeBounds(region.properties.visibleBounds)
        }}
        styleURL={styleUrl}
      >
        {camera}

        <UserMarker
          user={user}
          onPress={() => navigate(user)}
        />

        {friends.filter((friend) => !!friend.info?.coords?.geo?.coords)
          .map((friend) => (
            <UserMarker
              user={friend}
              key={friend.id}
              onPress={() => navigate(friend)}
            />
          ))}
      </MapboxGL.MapView>
    </>
  )
}

const styles = StyleSheet.create({
  buttonsView: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 48,
    top: 48,
    width: 30,
    zIndex: 2,
  },

  gpsButton: { backgroundColor: '#171717' },

  mapView: {
    flex: 1,
    zIndex: 0,
  },
})
