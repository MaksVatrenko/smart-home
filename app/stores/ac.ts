import { defineStore } from 'pinia'

export type ACMode = 'cool' | 'heat' | 'wind' | 'auto'

export type ACState = {
  isActive: boolean
  fanIsActive: boolean
  coolerIsActive: boolean
  temperature: number
  mode: ACMode
}
type Room = 'bathroom' | 'bedroom'
type State = Record<Room, ACState>

const initialACState = (temp = 18): ACState => ({
  isActive: false,
  fanIsActive: false,
  coolerIsActive: false,
  temperature: temp,
  mode: 'cool'
})

export const useACStore = defineStore('ac', {
  state: (): State => ({
    bathroom: initialACState(18),
    bedroom: initialACState(18)
  }),

  actions: {
    setACField<K extends keyof ACState>(
      room: Room,
      field: K,
      value: ACState[K]
    ) {
      this[room][field] = value
    },

    toggleAC(room: Room) {
      this[room].isActive = !this[room].isActive
    },

    setMode(room: Room, mode: ACMode) {
      this[room].mode = mode
    }
  }
})
