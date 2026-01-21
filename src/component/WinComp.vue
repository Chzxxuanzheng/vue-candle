<template>
	<div :style="win.posStyle as any" class="vue-candle-win" :class="{ force: win.isForce }">
		<component :is="win.content" />
	</div>
</template>

<script setup lang="ts">
import type { Win } from '@/states/win'
import { provide } from 'vue'

const { win } = defineProps<{
	win: Win
}>()

provide('vue-candle-win', win)
</script>
