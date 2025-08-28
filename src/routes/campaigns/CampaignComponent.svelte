<script>
	import { createEventDispatcher } from 'svelte';
	import { timeAgo } from '$lib/utils/formatters'; // We'll create this helper function
	export let post;
	export let platforms;
	export let actionTypes;

	const dispatch = createEventDispatcher();

	// Reactive declarations for easier access and calculation
	$: platformInfo = platforms.find((p) => p.name === post.platform) || platforms.find(p => p.name === 'Other');
	$: actionInfo = actionTypes.find((a) => a.value === post.actionType) || actionTypes[0];
	$: progress = (post.currentClicks / post.targetAmount) * 100;

	function handleEngage() {
		// Dispatch an event with the full post object to the parent
		dispatch('engage', post);
	}
</script>

<div
	class="bg-neutral-800/60 border border-neutral-700 p-4 rounded-2xl flex flex-col justify-between overflow-hidden hover:border-green-500/50 transition-all duration-300"
>
	<div>
		<!-- Header -->
		<div class="flex items-start justify-between mb-4">
			<div class="flex items-center gap-2">
				<iconify-icon icon={platformInfo.icon} class="text-2xl" style="color: {platformInfo.color};" />
				<span class="text-sm font-semibold text-neutral-300">{post.platform}</span>
			</div>
			<div
				class="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full capitalize"
				class:bg-green-200={post.status === 'active'}
				class:text-green-800={post.status === 'active'}
				class:bg-yellow-400={post.status === 'paused'}
				class:text-yellow-800={post.status === 'paused'}
				class:bg-red-200={post.status === 'completed'}
				class:text-red-800={post.status === 'completed'}
			>
				<div
					class="w-2 h-2 rounded-full"
					class:bg-green-500={post.status === 'active'}
					class:bg-yellow-500={post.status === 'paused'}
					class:bg-red-500={post.status === 'completed'}
				></div>
				{post.status}
			</div>
		</div>

		<!-- Title -->
		<h3 class="font-semibold text-neutral-100 mb-3 line-clamp-2 capitalize">{post.title}</h3>

		<!-- Progress Bar -->
		<div class="space-y-2 mb-4">
			<div class="flex justify-between text-xs text-neutral-400">
				<span>Progress</span>
				<span class="font-medium text-neutral-200"
					>{post.currentClicks.toLocaleString()} / {post.targetAmount.toLocaleString()}</span
				>
			</div>
			<div class="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
				<div
					class="h-2 rounded-full transition-all duration-500"
					style="width: {progress}%; background-color: {platformInfo.color};"
				></div>
			</div>
		</div>

		<!-- Details -->
		<div class="flex justify-between items-center text-xs text-neutral-400 border-t border-neutral-700 pt-3">
			<div class="flex items-center gap-1.5">
				<iconify-icon icon="solar:money-bag-bold-duotone" />
				<span>₦{post.costPerAction.toLocaleString()} / {actionInfo.label.slice(0, -1)}</span>
			</div>
			<div class="flex items-center gap-1.5">
				<iconify-icon icon="solar:calendar-date-bold-duotone" />
				<span>{timeAgo(post.createdAt)}</span>
			</div>
		</div>
	</div>

	<!-- Action Button -->
	<div class="mt-4">
		<button
			onclick={handleEngage}
			class="w-full flex items-center justify-center gap-2 bg-gradient-to-r text-white px-4 py-2.5 rounded-lg transition-all duration-300 disabled:from-neutral-600 disabled:to-neutral-700 disabled:cursor-not-allowed disabled:text-neutral-400 shadow-lg"
			class:from-green-600={!post.isCompleted}
			class:to-green-600={!post.isCompleted}
			class:hover:from-green-700={!post.isCompleted}
			class:hover:to-green-600={!post.isCompleted}
			disabled={post.isCompleted}
		>
			{#if post.isCompleted}
				<iconify-icon icon="solar:check-circle-bold" />
				<span>Completed</span>
			{:else}
				<iconify-icon icon={actionInfo.icon} />
				<span class="font-semibold">{actionInfo.label}</span>
			{/if}
		</button>
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		min-height: 2.5rem; /* Ensures consistent height for 2 lines */
	}
</style>