<template>
	<div class="vue-candle-lm">
		<WinComp v-for="win in lm.winList" :key="win.key" :win="win" />
	</div>
</template>

<script setup lang="ts">
import type { LayoutManager } from '@/states/layoutManager'
import { watchEffect } from 'vue'
import WinComp from './WinComp.vue'

const { lm } = defineProps<{
	lm: LayoutManager
}>()

watchEffect(() => {
	lm.calcSizeInfo()
})
</script>
