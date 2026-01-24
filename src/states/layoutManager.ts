import {
	computed,
	markRaw,
	shallowReactive,
	shallowRef,
	type Component,
	type ShallowRef,
} from 'vue'
import { Win } from '@/states/win'
import { Column } from '@/states/column'
import { Workspace } from '@/states/workspace'
import type { SizeInfo } from '@/type'

export class LayoutManager {
	DEFAULT_COLUMN_WIDTH = 50
	private readonly _forceWin = computed(() => this.currentWorkspace.forceWin)
	private readonly _forceColumn = computed(() => this.currentWorkspace.forceColumn)
	private readonly _currentWorkspace: ShallowRef<Workspace>
	workspaceList: Workspace[] = shallowReactive<Workspace[]>([])
	private readonly _sizeInfo: SizeInfo = shallowReactive({
		width: 0,
		height: 0,
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: 0,
		paddingRight: 0,
	})
	constructor(maxWorkspaceNum: number = 10) {
		if (maxWorkspaceNum < 1) throw new Error('maxWorkspaceNum must be at least 1')
		for (let i = 0; i < maxWorkspaceNum; i++) {
			this.workspaceList.push(new Workspace(this, i))
		}
		this._currentWorkspace = shallowRef(this.workspaceList[0]!)
		return markRaw(this)
	}

	/**
	 * the currently active workspace
	 */
	get currentWorkspace(): Workspace {
		return this._currentWorkspace.value
	}
	/**
	 * the currently focused column, undefined if none
	 */
	get forceColumn(): Column | undefined {
		return this._forceColumn.value
	}
	/**
	 * the currently focused win, undefined if none
	 */
	get forceWin(): Win | undefined {
		return this._forceWin.value
	}

	get sizeInfo(): SizeInfo {
		return this._sizeInfo
	}

	private readonly _winList = computed(() => {
		const out: Win[] = []
		for (const ws of this.workspaceList) {
			for (const col of ws.columnList) {
				out.push(...col.winList)
			}
		}
		return out
	})
	get winList(): Win[] {
		return this._winList.value
	}

	/**
	 * calculate and update size and position info for all windows
	 */
	calcSizeInfo(): void {
		const currentId = this.currentWorkspace.selfIndex
		for (const ws of this.workspaceList) {
			ws.baseY = (ws.selfIndex - currentId) * 100
			let totalWidth = 0
			for (const col of ws.columnList) {
				let totalHeight = 0
				const step = 100 / col.winList.length
				for (const win of col.winList) {
					win.updatePos({
						x: totalWidth,
						y: totalHeight,
						width: col.width,
						height: step,
					})
					totalHeight += step
				}
				totalWidth += col.width
			}
		}
	}

	//#region == Scroll Methods ==
	scrollToFitColumn(target: Column): this {
		this.currentWorkspace.scrollToFitColumn(target)
		return this
	}
	scrollToFitWin(win: Win): this {
		this.currentWorkspace.scrollToFitColumn(win.column)
		return this
	}
	scrollToForce(): this {
		this.currentWorkspace.scrollToForce()
		return this
	}
	scrollToHead(): this {
		return this.scrollTo(0)
	}
	scrollToTail(): this {
		this.currentWorkspace.scrollToTail()
		return this
	}
	scrollTo(pos: number): this {
		this.currentWorkspace.scrollTo(pos)
		return this
	}
	scrollLeft(length: number): this {
		this.currentWorkspace.scrollLeft(length)
		return this
	}
	scrollRight(length: number): this {
		this.currentWorkspace.scrollRight(length)
		return this
	}
	//#endregion

	/**
	 * create a new Win and add it to the right place at forceColumn
	 * @param win the win to add
	 * @param width the width of the new column if a new column is created
	 */
	addWin(win: Win, width?: number): Win
	/**
	 * create a new Win and add it to the right place at forceColumn
	 * @param comp the component to add
	 * @param width the width of the new column if a new column is created
	 */
	addWin(comp: Component, width?: number): Win
	addWin(arg: Win | Component, width?: number): Win {
		if (this.forceWin) {
			return this.forceWin.insertWinAtRight(arg)
		} else {
			const col = this.currentWorkspace.insertColumnAtEnd(width)
			const win = col.insertWinAtEnd(arg)
			win.setAsForceWin()
			return win
		}
	}
}
