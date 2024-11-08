import { addBatteryLevelListener, getBatteryLevelAsync, Subscription } from 'expo-battery'
import {
  getCurrentPositionAsync,
  LocationAccuracy, LocationObject,
  startLocationUpdatesAsync,
  stopLocationUpdatesAsync,
} from 'expo-location'
import { defineTask, isTaskDefined } from 'expo-task-manager'
import { updateInfo } from '../effector/user/events'

type LocationData = { locations: LocationObject[] }

const LOCATION_TRACKING = 'location-tracking'
const config = {
  showsBackgroundLocationIndicator: __DEV__,
  accuracy: LocationAccuracy.Highest,
  mayShowUserSettingsDialog: true,
  deferredUpdatesInterval: 30000,
  deferredUpdatesDistance: 50,
}

export class UserManager {
  public static initialized = false

  private static batterySubscription: Subscription

  private static geoUpdated = false

  private static intervalId = 0

  static initializeGeolocation() {
    if (!isTaskDefined(LOCATION_TRACKING)) {
      defineTask(LOCATION_TRACKING, async ({ data, error }) => {
        if (error || !data) {
          return
        }

        const { coords } = (<LocationData>data).locations[0]
        UserManager.geoUpdated = true

        updateInfo({
          lat: coords.latitude,
          lon: coords.longitude,
          speed: coords.speed,
          direction: coords.heading,
        })
      })
    }
  }

  static startWatch() {
    UserManager.batterySubscription = addBatteryLevelListener(({ batteryLevel }) => {
      updateInfo({
        battery: Math.trunc(batteryLevel * 100),
      })
    })

    void startLocationUpdatesAsync(LOCATION_TRACKING, config)

    getBatteryLevelAsync()
      .then((level) => updateInfo({
        battery: Math.trunc(level * 100),
      }))

    getCurrentPositionAsync()
      .then((result) => updateInfo({
        lat: result.coords.latitude,
        lon: result.coords.longitude,
        speed: (result.coords.speed ?? 0) * 3.6,
        direction: result.coords.heading,
      }))

    UserManager.intervalId = setInterval(() => {
      if (UserManager.geoUpdated) {
        UserManager.geoUpdated = false
        return
      }

      getCurrentPositionAsync(config)
        .then((result) => updateInfo({
          lat: result.coords.latitude,
          lon: result.coords.longitude,
          speed: (result.coords.speed ?? 0) * 3.6,
          direction: result.coords.heading,
        }))
    }, 3000) as unknown as number

    this.initialized = true
  }

  static stopWatch() {
    UserManager.batterySubscription.remove()
    void stopLocationUpdatesAsync(LOCATION_TRACKING)
    clearInterval(UserManager.intervalId)

    this.initialized = false
  }
}
