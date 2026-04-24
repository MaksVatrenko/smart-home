import { defineStore } from 'pinia'

export type DeviceName =
  | 'bedLight'
  | 'smartCam'
  | 'wifi'
  | 'light'
  | 'exhaustFan'
  | 'boiler'
type Room = 'bathroom' | 'bedroom'

export type DeviceState = {
  isActive: boolean
}

type DevicesStoreState = Record<Room, Record<DeviceName, DeviceState>>

export const useDevicesStore = defineStore('devices', {
  state: (): DevicesStoreState => ({
    bedroom: {
      bedLight: { isActive: false },
      smartCam: { isActive: false },
      wifi: { isActive: false },
      light: { isActive: false },
      exhaustFan: { isActive: false },
      boiler: { isActive: false }
    },
    bathroom: {
      bedLight: { isActive: false },
      smartCam: { isActive: false },
      wifi: { isActive: false },
      light: { isActive: false },
      exhaustFan: { isActive: false },
      boiler: { isActive: false }
    }
  }),

  actions: {
    toggleDevice(room: Room, deviceName: DeviceName) {
      if (this[room] && this[room][deviceName]) {
        this[room][deviceName].isActive = !this[room][deviceName].isActive
      }
    }
  }
})
