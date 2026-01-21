<template>
	<div class="visible-win">
		<LMComp :lm="lm" />
	</div>
</template>

<script setup lang="ts">
import LMComp from '@/component/LMComp.vue'
import { LayoutManager } from '@/states/layoutManager'
import TestComp from './TestComp.vue'
const lm = new LayoutManager()
lm.addWin(TestComp)
	.insertWinAtBelow(TestComp)
	.insertWinAtRight(TestComp, 30)
	.insertWinAtRight(TestComp, 30)
</script>

<style>
.visible-win {
	width: 90vw;
	height: 90vh;
	position: absolute;
	top: 5vh;
	left: 5vw;
	background-color: black;
	overflow: hidden;
}

.vue-candle-win {
	transition: all 0.2s ease-in-out;
}
</style>
