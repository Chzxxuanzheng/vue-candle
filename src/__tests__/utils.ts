import { expect, it } from 'vitest'

export function shouldBeMarkedAsRaw(factory: () => object): boolean {
	it('should be marked as raw', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect((factory() as any).__v_skip).toBeDefined()
	})
	return true
}
