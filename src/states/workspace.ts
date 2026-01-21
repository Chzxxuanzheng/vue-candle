import { markRaw, shallowReactive, shallowRef } from 'vue'
import { Column } from '@/states/column'
import type { LayoutManager } from '@/states/layoutManager'
import type { Win } from './win'

export class Workspace {
	readonly lm: LayoutManager
	readonly selfIndex: number
	private _columnList: Column[] = shallowReactive<Column[]>([])
	private _forceWin = shallowRef<Win | undefined>(undefined)
	private _forceColumn = shallowRef<Column | undefined>(undefined)
	private _baseX = shallowRef(0)
	private _baseY = shallowRef(0)

	constructor(lm: LayoutManager, selfIndex: number) {
		this.lm = lm
		this.selfIndex = selfIndex
		if (this.lm.workspaceList[selfIndex]) throw new Error('Workspace index already occupied')
		return markRaw(this)
	}

	get columnList(): Column[] {
		return this._columnList
	}

	get forceWin(): Win | undefined {
		return this._forceWin.value
	}

	get forceColumn(): Column | undefined {
		return this._forceColumn.value
	}

	get baseX(): number {
		return this._baseX.value
	}

	get baseY(): number {
		return this._baseY.value
	}

	set baseX(val: number) {
		this._baseX.value = val
	}

	set baseY(val: number) {
		this._baseY.value = val
	}

	//#region == Column Insertion Methods ==
	/**
	 * insert a new column at specified index
	 * @param index
	 * @param width
	 * @returns
	 */
	insertColumnAt(index: number, width?: number): Column {
		if (index < 0 || index > this._columnList.length) {
			throw new Error('Index out of bounds')
		}
		width = width ?? this.lm.DEFAULT_COLUMN_WIDTH
		const newCol = new Column(width, this, this.lm)
		this._columnList.splice(index, 0, newCol)
		return newCol
	}
	/**
	 * insert a new column at the start
	 * @param width
	 * @returns
	 */
	insertColumnAtStart(width?: number): Column {
		return this.insertColumnAt(0, width)
	}
	/**
	 * insert a new column at the end
	 * @param width
	 * @returns
	 */
	insertColumnAtEnd(width?: number): Column {
		return this.insertColumnAt(this._columnList.length, width)
	}
	//#endregion

	/**
	 * set the focused win and its column
	 * @param win
	 */
	setForceWin(win: Win | undefined) {
		this._forceWin.value = win
		this._forceColumn.value = win?.column
	}
}
