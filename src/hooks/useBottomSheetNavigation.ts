import { useStore } from 'effector-react'
import { $user } from '../effector/user/store'
import { $bottomSheet, $map } from '../effector/ui/store'
import { User } from '../types/user'

interface NavigationOptions {
  openBottomSheet?: boolean;
  showOnMap?: boolean;
}

export function useBottomSheetNavigation() {
  const user = useStore($user)
  const bottomSheet = useStore($bottomSheet)
  const map = useStore($map)

  return (target: User, options?: NavigationOptions) => {
    const navigationOptions = {
      openBottomSheet: true,
      showOnMap: true,
      ...options ?? {},
    }

    if (target.id === user?.id) {
      bottomSheet.navigator?.navigate('Profile')
    } else {
      bottomSheet.navigator?.navigate('User', { id: target.id })
    }

    if (target.info?.coords?.geo.coords && navigationOptions.showOnMap) {
      const { lat, lon } = target.info.coords.geo.coords

      map.camera?.setCamera({
        centerCoordinate: [lon, lat],
        zoomLevel: 14,
        animationDuration: 2000,
      })
    }

    if (navigationOptions.openBottomSheet) {
      bottomSheet.ref?.snapToIndex(2)
    }
  }
}
