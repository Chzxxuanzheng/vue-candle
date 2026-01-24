<template>
	<div class="test-main">
		test-{{ id }}
		<button @click="win.setAsForceWin()">Set Focused</button>
		<button @click="win.insertWinAtAbove(self).setAsForceWin().scrollFit()">Insert Above</button>
		<button @click="win.insertWinAtBelow(self).setAsForceWin().scrollFit()">Insert Below</button>
		<button @click="win.insertWinAtLeft(self).setAsForceWin().scrollFit()">Insert Left</button>
		<button @click="win.insertWinAtRight(self).setAsForceWin().scrollFit()">Insert Right</button>
		<button @click="win.destroy()">quit</button>
		<button @click="win.column.width = 25">25% width</button>
		<button @click="win.column.width = 50">50% width</button>
		<button @click="win.column.width = 75">75% width</button>
		<button @click="win.column.width = 100">100% width</button>
		<button @click="win.getAboveWin()?.setAsForceWin()">Force Above</button>
		<button @click="win.getBelowWin()?.setAsForceWin()">Force Below</button>
		<button @click="win.getLeftWin()?.setAsForceWin()">Force Left</button>
		<button @click="win.getRightWin()?.setAsForceWin()">Force Right</button>
		<button @click="win.workspace.scrollLeft(25)">Left Scroll</button>
		<button @click="win.workspace.scrollRight(25)">Right Scroll</button>
		<button @click="win.workspace.scrollToHead()">Scroll To Head</button>
		<button @click="win.workspace.scrollToTail()">Scroll To Tail</button>
		<button @click="win.workspace.scrollToForce()">Back To Force</button>
		<button @click="win.lm.switchToWorkspace(0)">To 1 Workspace</button>
		<button @click="win.lm.switchToWorkspace(1)">To 2 Workspace</button>
	</div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { useWinState } from '@/utils'
const id = crypto.randomUUID().slice(0, 4)
const win = useWinState()
const self = getCurrentInstance()!.type
</script>

<style>
.test-main {
	color: white;
	border: 4px solid red;
	width: calc(100% - 8px);
	height: calc(100% - 8px);
}
.force .test-main {
	border-color: yellow;
}
</style>
