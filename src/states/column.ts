import { markRaw, shallowReactive, shallowRef, type Component, type ShallowRef } from 'vue'
import { Win } from '@/states/win'
import type { LayoutManager } from '@/states/layoutManager'
import type { Workspace } from '@/states/workspace'

export class Column {
	readonly lm: LayoutManager
	private readonly _workspace: ShallowRef<Workspace>
	private readonly _winList: Win[] = shallowReactive<Win[]>([])
	private readonly _width: ShallowRef<number>

	constructor(width: number, workspace: Workspace, lm: LayoutManager) {
		this._width = shallowRef(width)
		this.lm = lm
		this._workspace = shallowRef(workspace)
		return markRaw(this)
	}

	get winList(): Win[] {
		return this._winList
	}

	get workspace(): Workspace {
		return this._workspace.value
	}

	get width(): number {
		return this._width.value
	}

	set width(val: number) {
		this._width.value = val
	}

	/**
	 * get the index of self in workspace.columnList
	 * @returns
	 */
	private getSelfIndex(): number {
		const idx = this.workspace.columnList.indexOf(this)
		if (idx === -1) throw new Error('Column not found in its workspace')
		return idx
	}

	//#region == Win Methods ==
	/**
	 * insert a new win at specified index
	 * @param index
	 * @param comp
	 */
	insertWinAt(index: number, comp: Component): Win
	/**
	 * insert a new win at specified index
	 * @param index
	 * @param win
	 */
	insertWinAt(index: number, win: Win): Win
	insertWinAt(index: number, arg: Win | Component): Win {
		const win: Win = arg instanceof Win ? arg : new Win(arg, this, this.lm)
		if (index < 0 || index > this._winList.length) {
			throw new Error('Index out of bounds')
		}
		this._winList.splice(index, 0, win)
		return win
	}
	/**
	 * insert a new win at the start
	 * @param win
	 */
	insertWinAtStart(win: Win): Win
	/**
	 * insert a new win at the start
	 * @param comp
	 */
	insertWinAtStart(comp: Component): Win
	insertWinAtStart(arg: Win | Component): Win {
		return this.insertWinAt(0, arg)
	}
	/**
	 * insert a new win at the end
	 * @param win
	 */
	insertWinAtEnd(win: Win): Win
	/**
	 * insert a new win at the end
	 * @param comp
	 */
	insertWinAtEnd(comp: Component): Win
	insertWinAtEnd(arg: Win | Component): Win {
		return this.insertWinAt(this._winList.length, arg)
	}
	//#endregion

	//#region == Column Methods ==
	/**
	 * get the column to the right of self in workspace.columnList
	 * @returns
	 */
	getRightColumn(): Column | undefined {
		const idx = this.getSelfIndex()
		return this.workspace.columnList[idx + 1]
	}
	/**
	 * get the column to the left of self in workspace.columnList
	 * @returns
	 */
	getLeftColumn(): Column | undefined {
		const idx = this.getSelfIndex()
		return this.workspace.columnList[idx - 1]
	}
	/**
	 * insert a new column to the right of self
	 * @returns
	 */
	insertColumnAtRight(width?: number): Column {
		const idx = this.getSelfIndex()
		return this.workspace.insertColumnAt(idx + 1, width)
	}
	/**
	 * insert a new column to the left of self
	 * @returns
	 */
	insertColumnAtLeft(width?: number): Column {
		const idx = this.getSelfIndex()
		return this.workspace.insertColumnAt(idx, width)
	}
	/**
	 * switch position with the column to the left
	 * @returns
	 */
	switchWithLeft(): void {
		const leftCol = this.getLeftColumn()
		if (!leftCol) return
		const idx = this.getSelfIndex()
		this.workspace.columnList.splice(idx - 1, 2, this, leftCol)
	}
	/**
	 * switch position with the column to the right
	 * @returns
	 */
	switchWithRight(): void {
		const rightCol = this.getRightColumn()
		if (!rightCol) return
		const idx = this.getSelfIndex()
		this.workspace.columnList.splice(idx, 2, rightCol, this)
	}
	//#endregion

	//#region == destroy ==
	/**
	 * destroy self
	 */
	destroy(): void {
		if (this.winList.length > 0) throw new Error('Cannot destroy a column that still has windows')
		this.workspace.columnList.splice(this.getSelfIndex(), 1)
	}
	/**
	 * destroy self with recursion. All windows inside will be destroyed too
	 */
	rDestroy(): void {
		while (this._winList.length > 0) {
			this._winList[0]!.destroy()
		}
	}
	//#endregion
}
