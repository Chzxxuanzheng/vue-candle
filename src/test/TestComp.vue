<template>
	<div class="test-main">
		test-{{ id }}
		<button @click="win.setAsForceWin()">Set Focused</button>
		<button @click="win.insertWinAtAbove(self).setAsForceWin()">Insert Above</button>
		<button @click="win.insertWinAtBelow(self).setAsForceWin()">Insert Below</button>
		<button @click="win.insertWinAtLeft(self, 50).setAsForceWin()">Insert Left</button>
		<button @click="win.insertWinAtRight(self, 50).setAsForceWin()">Insert Right</button>
		<button @click="win.destroy()">quit</button>
		<button @click="win.column.width = 25">25% width</button>
		<button @click="win.column.width = 50">50% width</button>
		<button @click="win.column.width = 75">75% width</button>
		<button @click="win.column.width = 100">100% width</button>
		<button @click="win.getAboveWin()?.setAsForceWin()">Force Above</button>
		<button @click="win.getBelowWin()?.setAsForceWin()">Force Below</button>
		<button @click="win.getLeftWin()?.setAsForceWin()">Force Left</button>
		<button @click="win.getRightWin()?.setAsForceWin()">Force Right</button>
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
