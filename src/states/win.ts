import { computed, markRaw, reactive, shallowRef, type Component, type ShallowRef } from 'vue'
import type { Column } from '@/states/column'
import type { PosInfo } from '@/type'
import type { LayoutManager } from '@/states/layoutManager'
import type { Workspace } from './workspace'

/**
 * the state of win
 */
export class Win {
	readonly content: Component
	readonly lm: LayoutManager
	readonly key = crypto.randomUUID()
	private _column: ShallowRef<Column>
	private _workspace = computed(() => this.column.workspace)
	private _isForce = computed(() => this.lm.forceWin === this)
	private pos: PosInfo = reactive({
		width: 0,
		height: 0,
		x: 0,
		y: 0,
	})

	constructor(content: Component, column: Column, lm: LayoutManager) {
		this.content = content
		this._column = shallowRef(column)
		this.lm = lm
		return markRaw(this)
	}

	get workspace(): Workspace {
		return this._workspace.value
	}

	get column(): Column {
		return this._column.value
	}

	get isForce(): boolean {
		return this._isForce.value
	}

	/**
	 * get the index of self in workspace.columnList
	 * @returns
	 */
	private getSelfIndex(): number {
		const idx = this.column.winList.indexOf(this)
		if (idx === -1) throw new Error('Column not found in its workspace')
		return idx
	}

	//#region == win Methods ==
	/**
	 * get the win above self in column.winList
	 * @returns
	 */
	getAboveWin(): Win | undefined {
		const idx = this.getSelfIndex()
		if (idx > 0) {
			return this.column.winList[idx - 1]
		}
		return undefined
	}
	/**
	 * get the win below self in column.winList
	 * @returns
	 */
	getBelowWin(): Win | undefined {
		const idx = this.getSelfIndex()
		if (idx < this.column.winList.length - 1) {
			return this.column.winList[idx + 1]
		}
		return undefined
	}
	/**
	 * get the win in the left column at index 0
	 * @returns
	 */
	getLeftWin(): Win | undefined {
		const leftCol = this.column.getLeftColumn()
		return leftCol?.winList.at(0)
	}
	/**
	 * get the win in the right column at index 0
	 * @returns
	 */
	getRightWin(): Win | undefined {
		const rightCol = this.column.getRightColumn()
		return rightCol?.winList.at(0)
	}

	/**
	 * insert a win above self in column.winList
	 * @param win
	 */
	insertWinAtAbove(win: Win): Win
	/**
	 * insert a win above self in column.winList
	 * @param comp
	 */
	insertWinAtAbove(comp: Component): Win
	insertWinAtAbove(arg: Component | Win): Win {
		const idx = this.getSelfIndex()
		return this.column.insertWinAt(idx, arg)
	}
	/**
	 * insert a win below self in column.winList
	 * @param win
	 */
	insertWinAtBelow(win: Win): Win
	/**
	 * insert a win below self in column.winList
	 * @param comp
	 */
	insertWinAtBelow(comp: Component): Win
	insertWinAtBelow(arg: Component | Win): Win {
		const idx = this.getSelfIndex()
		return this.column.insertWinAt(idx + 1, arg)
	}
	/**
	 * insert a win to the left of self (creates a new column)
	 * @param win
	 * @param width the width of the new column
	 */
	insertWinAtLeft(win: Win, width?: number): Win
	/**
	 * insert a win to the left of self (creates a new column)
	 * @param comp
	 * @param width the width of the new column
	 */
	insertWinAtLeft(comp: Component, width?: number): Win
	insertWinAtLeft(arg: Component | Win, width?: number): Win {
		const column = this.column.insertColumnAtLeft(width)
		return column.insertWinAtEnd(arg)
	}

	/**
	 * insert a win to the right of self (creates a new column)
	 * @param win
	 * @param width the width of the new column
	 */
	insertWinAtRight(win: Win, width?: number): Win
	/**
	 * insert a win to the right of self (creates a new column)
	 * @param comp
	 * @param width the width of the new column
	 */
	insertWinAtRight(comp: Component, width?: number): Win
	insertWinAtRight(arg: Component | Win, width?: number): Win {
		const column = this.column.insertColumnAtRight(width)
		return column.insertWinAtEnd(arg)
	}

	/**
	 * destroy self
	 */
	destroy(): void {
		const setAroundForce = () => {
			if (!this.isForce) return
			// TODO choice the closet win by mouse position
			if (this.getAboveWin()?.setAsForceWin()) return
			if (this.getBelowWin()?.setAsForceWin()) return
			if (this.getLeftWin()?.setAsForceWin()) return
			if (this.getRightWin()?.setAsForceWin()) return
		}
		setAroundForce()
		this.column.winList.splice(this.getSelfIndex(), 1)
		if (this.column.winList.length === 0) {
			this.column.destroy()
		}
	}
	//#endregion

	//#region == position Methods ==
	/**
	 * update the position info
	 * @param pos
	 */
	updatePos(pos: PosInfo): void {
		this.pos.width = pos.width
		this.pos.height = pos.height
		this.pos.x = pos.x
		this.pos.y = pos.y
	}

	private _posStyle = computed(() => {
		const sizeInfo = this.lm.sizeInfo
		return {
			width: `calc((100% - ${sizeInfo.paddingLeft + sizeInfo.paddingRight}px) * ${this.pos.width} / 100)`,
			height: `calc((100% - ${sizeInfo.paddingTop + sizeInfo.paddingBottom}px) * ${this.pos.height} / 100)`,
			left: `calc(${sizeInfo.paddingLeft}px + (100% - ${sizeInfo.paddingLeft + sizeInfo.paddingRight}px) * ${this.pos.x - this.workspace.baseX} / 100)`,
			top: `calc(${sizeInfo.paddingTop}px + (100% - ${sizeInfo.paddingTop + sizeInfo.paddingBottom}px) * ${this.pos.y} / 100 + ${this.workspace.baseY}%)`,
			position: 'absolute',
		}
	})
	get posStyle() {
		return this._posStyle.value
	}
	//#endregion

	/**
	 * set the focused win and its column
	 */
	setAsForceWin(): Win {
		this.workspace.setForceWin(this)
		return this
	}

	scrollFit(): Win {
		this.workspace.scrollToFitWin(this)
		return this
	}
}
