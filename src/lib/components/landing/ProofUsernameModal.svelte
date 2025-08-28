<script>
  import { quintOut } from "svelte/easing";
  import { fade, slide } from "svelte/transition";

  import { toast } from "svelte-sonner";
  import { api } from "$lib/services/ApiService.svelte";
  import { createEventDispatcher } from "svelte";

  let { campaign, platformInfo } = $props();
  const dispatch = createEventDispatcher();

  let username = $state("");
  let isLoading = $state(false);

  async function submitProof() {
    if (!username) {
      toast.error("Please enter the username you used for the task.");
      return;
    }
    isLoading = true;
    try {
      // This API method now needs to accept the username
      await api.engageWithCampaign(campaign._id, { username: username });

      dispatch("submitted"); // Notify parent that submission was successful
      dispatch("close");
    } catch (error) {
      // ApiService will show the error toast
    } finally {
      isLoading = false;
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      dispatch("close");
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Backdrop -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="fixed inset-0 z-40 bg-black/70"
  transition:fade={{ duration: 300 }}
  onclick={() => dispatch("close")}
></div>

<!-- Modal -->
<div
  class="fixed inset-0 z-50 flex items-center justify-center p-4"
  transition:fade={{ duration: 300 }}
>
  <div
    class="bg-neutral-800 rounded-2xl border border-neutral-700 w-full max-w-md"
    transition:slide={{ duration: 400, easing: quintOut, y: 50 }}
  >
    <!-- Header -->
    <div
      class="p-4 border-b border-neutral-700 flex justify-between items-center"
    >
      <h3 class="font-bold text-lg text-white">Confirm Your Engagement</h3>
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button
        onclick={() => dispatch("close")}
        class="text-neutral-400 hover:text-white"
      >
        <iconify-icon icon="solar:close-circle-bold" class="text-2xl"
        ></iconify-icon>
      </button>
    </div>

    <!-- Body -->
    <div class="p-6 space-y-4">
      <p class="text-neutral-300 text-sm">
        To verify your task, please enter the <span
          class="font-bold"
          style="color: {platformInfo.color};">{platformInfo.name}</span
        > username you used to complete the action.
      </p>
      <div>
        <label
          for="username"
          class="block text-sm font-medium text-neutral-400 mb-2"
          >Your {platformInfo.name} Username</label
        >
        <input
          type="text"
          id="username"
          bind:value={username}
          placeholder="@your_username"
          class="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 bg-neutral-900/50 flex flex-col sm:flex-row gap-3">
      <a
        href={campaign.link}
        target="_blank"
        rel="noopener noreferrer"
        class="w-full flex-1 flex items-center justify-center gap-2 bg-neutral-600 text-white font-semibold py-2.5 rounded-lg transition-colors hover:bg-neutral-500"
      >
        <iconify-icon icon="solar:link-bold"></iconify-icon>
        <span>Open Link</span>
      </a>
      <button
        onclick={submitProof}
        disabled={isLoading || !username}
        class="w-full flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {#if isLoading}
          <iconify-icon icon="svg-spinners:180-ring-with-bg"></iconify-icon>
          <span>Submitting...</span>
        {:else}
          <iconify-icon icon="solar:verified-check-bold"></iconify-icon>
          <span>Confirm & Submit</span>
        {/if}
      </button>
    </div>
  </div>
</div>
