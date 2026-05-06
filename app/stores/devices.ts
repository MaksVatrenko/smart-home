import { defineStore } from 'pinia'

export type DeviceName =
  | 'bedLight'
  | 'smartCam'
  | 'wifi'
  | 'light'
  | 'exhaustFan'
  | 'boiler'

type BaseDeviceState = {
  isActive: boolean
}

type DimmableDeviceState = BaseDeviceState & {
  percentLight: number
}

export type BedroomDevices = {
  bedLight: DimmableDeviceState
  smartCam: BaseDeviceState
  wifi: BaseDeviceState
}

export type BathroomDevices = {
  light: DimmableDeviceState
  exhaustFan: BaseDeviceState
  boiler: BaseDeviceState
}

type DevicesStoreState = {
  bedroom: BedroomDevices
  bathroom: BathroomDevices
}

export const useDevicesStore = defineStore('devices', {
  state: (): DevicesStoreState => ({
    bedroom: {
      bedLight: { isActive: false, percentLight: 20 },
      smartCam: { isActive: false },
      wifi: { isActive: false }
    },
    bathroom: {
      light: { isActive: false, percentLight: 20 },
      exhaustFan: { isActive: false },
      boiler: { isActive: false }
    }
  }),

  actions: {
    toggleDevice<
      R extends keyof DevicesStoreState,
      D extends keyof DevicesStoreState[R]
    >(room: R, deviceName: D) {
      const roomDevices = this.$state[room] as DevicesStoreState[R]
      const device = roomDevices[deviceName] as BaseDeviceState
      device.isActive = !device.isActive
    },

    setPercentLight<
      R extends keyof DevicesStoreState,
      D extends keyof DevicesStoreState[R]
    >(room: R, deviceName: D, value: number) {
      const roomDevices = this.$state[room] as DevicesStoreState[R]
      const device = roomDevices[deviceName] as any

      if (device && typeof device === 'object' && 'percentLight' in device) {
        device.percentLight = value
      }
    }
  }
})
