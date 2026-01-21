import { inject } from 'vue'
import type { Win } from './states/win'

export function useWinState(): Win {
	return inject<Win>('vue-candle-win')!
}
