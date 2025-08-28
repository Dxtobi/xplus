<script>
  import { quintOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";
  import { timeAgo } from "$lib/utils/formatters";
  import { actionTypes, platforms } from "$lib/utils/constants";
  import { invalidateAll } from "$app/navigation";
  import ProofUsernameModal from "$lib/components/landing/ProofUsernameModal.svelte";

  let { campaign, isVisible = false, animationDelay = 0 } = $props();

  let showProofModal = $state(false);

  let platformInfo = $derived.by(() => {
    return (
      platforms.find((p) => p.name === campaign.platform) ||
      platforms.find((p) => p.name === "Other")
    );
  });
  let actionInfo = $derived.by(() => {
    return (
      actionTypes.find((a) => a.value === campaign.actionType) || actionTypes[0]
    );
  });
  let progress = $derived.by(() => {
    return campaign.targetAmount > 0
      ? (campaign.currentClicks / campaign.targetAmount) * 100
      : 0;
  });

  // This function runs after the modal successfully submits the proof.
  function handleProofSubmitted() {
    // The API call is done inside the modal.
    // We just need to refresh the page data to remove this card from the "available" list.
    invalidateAll();
  }
</script>

{#if isVisible}
  <div
    class="bg-neutral-800/60 border border-neutral-700 rounded-2xl flex flex-col overflow-hidden hover:border-green-500/50 transition-all duration-300"
    in:fly={{ y: 20, duration: 500, delay: animationDelay, easing: quintOut }}
    out:fade
  >
    <!-- Card Header: Creator and Platform Info -->
    <div
      class="p-4 flex justify-between items-center border-b border-neutral-700/50"
    >
      <div class="flex items-center gap-3">
        <img
          src={campaign.userId.avatar}
          alt={campaign.userId.name}
          class="w-10 h-10 rounded-full border-2 border-neutral-600"
        />
        <div>
          <p class="font-semibold text-sm text-neutral-200">
            {campaign.userId.name}
          </p>
          <p class="text-xs text-neutral-400">{timeAgo(campaign.createdAt)}</p>
        </div>
      </div>
      <div
        class="flex items-center gap-2 text-sm"
        style="color: {platformInfo.color};"
      >
        <iconify-icon icon={platformInfo.icon} class="text-xl"></iconify-icon>
      </div>
    </div>

    <!-- Card Body: Main Content -->
    <div class="p-4 flex-grow flex flex-col">
      <h3
        class="font-bold text-lg text-white mb-3 flex-grow line-clamp-2 capitalize"
      >
        {campaign.title}
      </h3>

      <!-- Reward Info -->
      <div class="bg-neutral-900/50 p-3 rounded-xl mb-4 text-center">
        <p class="text-xs text-green-400 font-medium">REWARD</p>
        <p class="text-xl font-bold text-white">
          ₦{campaign.costPerAction.toLocaleString()}
          <span class="text-base font-medium text-neutral-400"
            >per {actionInfo.label.slice(0, -1)}</span
          >
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="space-y-2">
        <div class="flex justify-between text-xs text-neutral-400">
          <span>Progress</span>
          <span class="font-medium text-neutral-200"
            >{campaign.currentClicks} / {campaign.targetAmount}</span
          >
        </div>
        <div class="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
          <div
            class="h-2 rounded-full transition-all duration-500 ease-out"
            style="width: {progress}%; background-color: {platformInfo.color};"
          ></div>
        </div>
      </div>
    </div>

    <!-- Card Footer: Action Button -->
    <div class="p-4 bg-neutral-800/30">
      <button
        class="w-full flex items-center justify-center gap-2 bg-gradient-to-r text-white font-semibold px-4 py-3 rounded-lg transition-all duration-300 shadow-lg disabled:from-neutral-600 disabled:to-neutral-700 disabled:cursor-not-allowed"
        class:from-green-600={!campaign.isCompleted}
        class:to-teal-500={!campaign.isCompleted}
        class:hover:from-green-700={!campaign.isCompleted}
        class:hover:to-teal-600={!campaign.isCompleted}
        disabled={campaign.isCompleted}
        onclick={() => (showProofModal = true)}
      >
        <iconify-icon icon={actionInfo.icon} class="text-xl"></iconify-icon>
        <span>{actionInfo.label}</span>
      </button>
    </div>
  </div>
{/if}

<!-- The Modal is now controlled by the card -->
{#if showProofModal}
  <ProofUsernameModal
    {campaign}
    {platformInfo}
    on:close={() => (showProofModal = false)}
    on:submitted={handleProofSubmitted}
  />
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.75rem; /* Ensures consistent height for 2 lines of text */
  }
</style>
