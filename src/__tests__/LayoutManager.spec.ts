import { describe, it, expect, beforeEach } from 'vitest'
import { LayoutManager } from '@/states/layoutManager'
import { Workspace } from '@/states/workspace'
import { shouldBeMarkedAsRaw } from './utils'
import { Column } from '@/states/column'
import { Win } from '@/states/win'
import TestComp from '@/test/TestComp.vue'

describe('Layout Manager', () => {
	shouldBeMarkedAsRaw(() => new LayoutManager())

	it('should initialize with default workspace number of 10', () => {
		const lm = new LayoutManager()
		expect(lm.workspaceList).toHaveLength(10)
		expect(lm.workspaceList[0]).toBeInstanceOf(Workspace)
		expect(lm.currentWorkspace).toBe(lm.workspaceList[0])
	})

	it('should initialize with specific workspace number', () => {
		const count = 5
		const lm = new LayoutManager(count)
		expect(lm.workspaceList).toHaveLength(count)
	})

	it('should throw error if maxWorkspaceNum is less than 1', () => {
		expect(() => new LayoutManager(0)).toThrow('maxWorkspaceNum must be at least 1')
		expect(() => new LayoutManager(-5)).toThrow('maxWorkspaceNum must be at least 1')
	})

	it('should add win to active workspace', () => {
		const lm = new LayoutManager()
		const win = lm.addWin(TestComp)
		expect(lm.winList).toContain(win)
		expect(lm.currentWorkspace.columnList).toHaveLength(1)
		expect(lm.currentWorkspace.columnList[0]?.winList).toContain(win)
	})

	it('should calculate size info correctly', () => {
		const lm = new LayoutManager()
		const ws = lm.currentWorkspace
		const col1 = ws.insertColumnAtEnd(50)
		const win1 = col1.insertWinAtEnd(TestComp)
		const win2 = col1.insertWinAtEnd(TestComp)

		lm.calcSizeInfo()

		// 100 / 2 = 50% height for each win in the column
		expect(win1.posStyle.height).toContain('50 / 100')
		expect(win2.posStyle.height).toContain('50 / 100')
	})

	it('should delegate scroll methods to current workspace', () => {
		const lm = new LayoutManager()
		const ws = lm.currentWorkspace
		ws.insertColumnAtEnd(150) // total 150

		lm.scrollTo(20)
		expect(ws.baseX).toBe(20)

		lm.scrollRight(10)
		expect(ws.baseX).toBe(30)

		lm.scrollLeft(5)
		expect(ws.baseX).toBe(25)

		lm.scrollToHead()
		expect(ws.baseX).toBe(0)

		lm.scrollToTail()
		expect(ws.baseX).toBe(50) // 150 - 100
	})

	it('should switch workspace by index', () => {
		const lm = new LayoutManager()
		const ws1 = lm.workspaceList[1]!
		lm.switchToWorkspace(1)
		expect(lm.currentWorkspace).toBe(ws1)
	})

	it('should switch workspace by object', () => {
		const lm = new LayoutManager()
		const ws2 = lm.workspaceList[2]!
		lm.switchToWorkspace(ws2)
		expect(lm.currentWorkspace).toBe(ws2)
	})

	it('should throw when switching to out of range index', () => {
		const lm = new LayoutManager()
		expect(() => lm.switchToWorkspace(10)).toThrow('workspace index out of range')
		expect(() => lm.switchToWorkspace(-1)).toThrow('workspace index out of range')
	})
})

describe('Workspace', () => {
	let lm: LayoutManager
	let ws: Workspace

	beforeEach(() => {
		lm = new LayoutManager()
		ws = lm.workspaceList[0]!
	})

	shouldBeMarkedAsRaw(() => new LayoutManager().workspaceList[0]!)

	it('should insert columns', () => {
		const col1 = ws.insertColumnAtEnd(30)
		const col2 = ws.insertColumnAtStart(20)
		expect(ws.columnList).toHaveLength(2)
		expect(ws.columnList[0]).toBe(col2)
		expect(ws.columnList[1]).toBe(col1)
		expect(col2.width).toBe(20)
		expect(col1.width).toBe(30)
	})

	it('should throw if index is occupied', () => {
		expect(() => new Workspace(lm, 0)).toThrow('Workspace index already occupied')
	})

	it('should manage focused window', () => {
		const col = ws.insertColumnAtEnd()
		const win = col.insertWinAtEnd(TestComp)
		ws.setForceWin(win)
		expect(ws.forceWin).toBe(win)
		expect(ws.forceColumn).toBe(col)

		ws.setForceWin(undefined)
		expect(ws.forceWin).toBeUndefined()
		expect(ws.forceColumn).toBeUndefined()
	})

	it('should handle scrolling and horizontal layout', () => {
		ws.insertColumnAtEnd(40) // 0-40
		ws.insertColumnAtEnd(40) // 40-80
		const col3 = ws.insertColumnAtEnd(40) // 80-120
		const col4 = ws.insertColumnAtEnd(40) // 120-160

		expect(ws.scrollLength).toBe(160)

		// Scroll to head
		ws.scrollToHead()
		expect(ws.baseX).toBe(0)

		// Scroll to tail
		ws.scrollToTail()
		expect(ws.baseX).toBe(60) // 160 - 100

		// Scroll to fit column 3 (80-120)
		// When baseX=0, col3 is partially visible (80-100).
		// scrollToFitColumn should move baseX to at least 120-100 = 20
		ws.scrollTo(0)
		ws.scrollToFitColumn(col3)
		expect(ws.baseX).toBe(20)

		// Scroll to fit column 4 (120-160)
		ws.scrollToFitColumn(col4)
		expect(ws.baseX).toBe(60)

		// Scroll back to column 1
		ws.scrollToFitColumn(ws.columnList[0]!)
		expect(ws.baseX).toBe(0)
	})

	it('should clamp scroll position', () => {
		ws.insertColumnAtEnd(150)
		ws.scrollTo(-50)
		expect(ws.baseX).toBe(0)
		ws.scrollTo(200)
		expect(ws.baseX).toBe(50) // 150 - 100
	})

	it('should switch to itself', () => {
		const ws1 = lm.workspaceList[1]!
		ws1.switchToSelf()
		expect(lm.currentWorkspace).toBe(ws1)
	})
})

describe('Column', () => {
	let lm: LayoutManager
	let ws: Workspace
	let col: Column

	beforeEach(() => {
		lm = new LayoutManager()
		ws = lm.workspaceList[0]!
		col = ws.insertColumnAtEnd(50)!
	})

	shouldBeMarkedAsRaw(() => new LayoutManager().workspaceList[0]!.insertColumnAtEnd(50))
	it('should insert windows', () => {
		const win1 = col.insertWinAtEnd(TestComp)
		const win2 = col.insertWinAtStart(TestComp)
		expect(col.winList).toHaveLength(2)
		expect(col.winList[0]).toBe(win2)
		expect(col.winList[1]).toBe(win1)
	})

	it('should move columns', () => {
		const col2 = ws.insertColumnAtEnd()

		expect(col2.getLeftColumn()).toBe(col)
		expect(col.getRightColumn()).toBe(col2)

		col2.switchWithLeft()
		expect(ws.columnList[0]).toBe(col2)
		expect(ws.columnList[1]).toBe(col)

		col2.switchWithRight()
		expect(ws.columnList[0]).toBe(col)
		expect(ws.columnList[1]).toBe(col2)
	})

	it('should destroy empty column', () => {
		col.destroy()
		expect(ws.columnList).not.toContain(col)
	})

	it('should throw when destroying non-empty column without recursion', () => {
		col.insertWinAtEnd(TestComp)
		expect(() => col.destroy()).toThrow('Cannot destroy a column that still has windows')
	})

	it('should destroy with recursion', () => {
		col.insertWinAtEnd(TestComp)
		col.rDestroy()
		expect(ws.columnList).not.toContain(col)
	})
})

describe('Win', () => {
	let lm: LayoutManager
	let ws: Workspace
	let col: Column
	let win: Win

	beforeEach(() => {
		lm = new LayoutManager()
		ws = lm.workspaceList[0]!
		col = ws.insertColumnAtEnd()
		win = col.insertWinAtEnd(TestComp)
	})

	shouldBeMarkedAsRaw(() => {
		const lm = new LayoutManager()
		const col = lm.workspaceList[0]!.insertColumnAtEnd()
		return new Win(TestComp, col, lm)
	})

	it('should navigate between windows', () => {
		const nextWin = col.insertWinAtEnd(TestComp)

		expect(win.getBelowWin()).toBe(nextWin)
		expect(nextWin.getAboveWin()).toBe(win)
		expect(win.getAboveWin()).toBeUndefined()
		expect(nextWin.getBelowWin()).toBeUndefined()
	})

	it('should navigate horizontally', () => {
		const colR = ws.insertColumnAtEnd()
		const winR = colR.insertWinAtEnd(TestComp)

		expect(win.getRightWin()).toBe(winR)
		expect(winR.getLeftWin()).toBe(win)
	})

	it('should insert adjacent windows', () => {
		const winBelow = win.insertWinAtBelow(TestComp)
		const winAbove = win.insertWinAtAbove(TestComp)

		expect(col.winList.indexOf(winAbove)).toBe(col.winList.indexOf(win) - 1)
		expect(col.winList.indexOf(winBelow)).toBe(col.winList.indexOf(win) + 1)
	})

	it('should insert windows in new columns', () => {
		const winLeft = win.insertWinAtLeft(TestComp)
		const winRight = win.insertWinAtRight(TestComp)

		expect(win.column.getLeftColumn()).toBe(winLeft.column)
		expect(win.column.getRightColumn()).toBe(winRight.column)
	})

	it('should destroy win and its column if it was the last win', () => {
		win.destroy()
		expect(ws.columnList).not.toContain(col)
	})

	it('should destroy win but keep column if not last win', () => {
		col.insertWinAtEnd(TestComp)
		win.destroy()
		expect(ws.columnList).toContain(col)
		expect(col.winList).not.toContain(win)
	})

	it('should handle focus', () => {
		win.setAsForceWin()
		expect(win.isForce).toBe(true)
		expect(ws.forceWin).toBe(win)
		expect(lm.forceWin).toBe(win)
	})

	it('should transfer focus on destruction', () => {
		const win2 = col.insertWinAtEnd(TestComp)
		win.setAsForceWin()
		expect(win.isForce).toBe(true)

		win.destroy()
		expect(win2.isForce).toBe(true)
		expect(ws.forceWin).toBe(win2)
	})

	it('should support fit scrolling', () => {
		ws.insertColumnAtStart(100)
		ws.insertColumnAtStart(100)
		// column sequence: [100, 100, col(from beforeEach)]
		// col position: 200-250

		win.scrollFit()
		expect(ws.baseX).toBe(150) // 250 - 100
	})
})
