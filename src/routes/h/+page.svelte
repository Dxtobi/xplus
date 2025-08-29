<script>
  import { onMount } from "svelte";

  import CampaignCard from "./CampaignCard.svelte"; // The new, detailed card component
  import { platforms, actionTypes } from "$lib/utils/constants"; // Your icon/color constants
  import { page } from "$app/state";
  import CreateCampaign from "../campaigns/CreateCampaign.svelte";

  let campaigns = $derived(page.data.availableCampaigns.campaigns);

  let isVisible = $state(false);
  onMount(() => {
    const timer = setTimeout(() => (isVisible = true), 100);
    return () => clearTimeout(timer);
  });

  // This function would handle the API call when a user engages
  function handleEngagement(event) {
    const campaign = event.detail;

    // Example: Call api.engageWithCampaign(campaign._id);
    // You can add optimistic UI updates here.
  }

  $effect(() => {
    campaigns = page.data.availableCampaigns.campaigns;
  });

  let currentView = $state("home");
  const closeForm = () => {
    currentView = "home";
  };
</script>

{#if currentView === "home"}
  <div class="min-h-screen bg-neutral-900 text-neutral-200 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-white flex items-center gap-3">
          <!-- svelte-ignore element_invalid_self_closing_tag -->
          <iconify-icon
            icon="solar:cup-star-bold-duotone"
            class="text-green-400"
          />
          Engage & Earn
        </h1>
        <p class="text-neutral-400 mt-1">
          Complete tasks to earn rewards from the community.
        </p>
      </div>

      <!-- Campaigns Grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {#each campaigns as campaign, index (campaign._id)}
          <CampaignCard
            {campaign}
            {platforms}
            {actionTypes}
            {isVisible}
            animationDelay={index * 100}
            on:engage={handleEngagement}
          />
        {/each}
      </div>
    </div>
  </div>

  <div class="sm:hidden fixed bottom-20 right-4 z-50 flex-col flex">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button
      onclick={() => (currentView = "create")}
      class="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors cursor-pointer shadow-lg flex items-center gap-2 justify-center"
      title="New Campaign"
    >
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <iconify-icon icon="solar:add-square-bold" width="24" height="24" />
    </button>
    <p>Create</p>
  </div>
{:else}
  <CreateCampaign {closeForm} />
{/if}
