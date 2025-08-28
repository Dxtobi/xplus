<script>
  import CampaignComponent from "./CampaignComponent.svelte";
  import CreateCampaign from "./CreateCampaign.svelte";
  import { page } from "$app/stores";

  import { actionTypes, platforms } from "$lib/utils/constants";
  import { api } from "$lib/services/ApiService.svelte";

  const { data } = $page; // Use the store directly

  // Derivde state for campaigns - it will automatically update when page data changes.
  let campaigns = $derived(data.availableCampaigns?.campaigns || []);

  let user = $derived(data.user);
  let currentView = $state("home");

  const closeForm = () => {
    currentView = "home";
  };

  // Engage with post - now a real API call
  async function engageWithCampaign(event) {
    const post = event.detail; // Get the post object from the dispatched event

    if (post.isCompleted) return;

    // Optimistic UI update: Temporarily disable the button to prevent double-clicks
    const originalPostState = { ...post };
    post.isCompleted = true; // A temporary flag to disable the button
    campaigns = [...campaigns]; // Trigger reactivity

    try {
      // In a real app, this redirects to the actual link first
      window.open(post.link, "_blank");

      await api.engageWithCampaign(post._id);

      // On successful API call, permanently update the local state.
      // The toast notification is handled by the ApiService.
      const index = campaigns.findIndex((p) => p._id === post._id);
      if (index !== -1) {
        campaigns[index].currentClicks += 1;
        if (campaigns[index].currentClicks >= campaigns[index].targetAmount) {
          campaigns[index].isCompleted = true;
          campaigns[index].status = "completed";
        } else {
          // Re-enable button if not complete
          campaigns[index].isCompleted = false;
        }
        campaigns = [...campaigns]; // Trigger reactivity again with final state
      }
    } catch (error) {
      console.error("Engagement failed:", error);
      // Revert UI on failure
      const index = campaigns.findIndex((p) => p._id === post._id);
      if (index !== -1) {
        campaigns[index] = originalPostState;
        campaigns = [...campaigns];
      }
    }
  }

  $effect(() => {
    $inspect(data.submissionData);
  });
</script>

<main class="min-h-screen">
  <div class="max-w-7xl mx-auto px-2 lg:px-8 py-8">
    {#if !user}
      <!-- Landing Page (Your existing code is fine here) -->
    {:else if currentView === "home"}
      <!-- Dashboard -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 relative"
        >
          <h2 class="text-2xl font-bold mb-4 sm:mb-0 flex gap-3 items-center">
            <!-- svelte-ignore element_invalid_self_closing_tag -->
            <iconify-icon
              icon="solar:chart-square-bold-duotone"
              class="text-green-500"
              width="34"
              height="34"
            />
            <span>Active Campaigns</span>
          </h2>

          <!-- Mobile: Fixed position button -->
          <div class="sm:hidden fixed bottom-20 right-4 z-50">
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button
              onclick={() => (currentView = "create")}
              class="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors cursor-pointer shadow-lg flex items-center gap-2 justify-center"
              title="New Campaign"
            >
              <!-- svelte-ignore element_invalid_self_closing_tag -->
              <iconify-icon
                icon="solar:add-square-bold"
                width="24"
                height="24"
              />
            </button>
          </div>
        </div>

        <!-- Campaign grid -->
        {#if campaigns.length > 0}
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each campaigns as post (post._id)}
              <CampaignComponent
                {post}
                {platforms}
                {actionTypes}
                on:engage={engageWithCampaign}
              />
            {/each}
          </div>
        {:else}
          <div class="text-center py-20 bg-neutral-800/50 rounded-xl">
            <!-- svelte-ignore element_invalid_self_closing_tag -->
            <iconify-icon
              icon="solar:vinyl-record-bold-duotone"
              class="text-5xl text-neutral-500 mx-auto mb-4"
            />
            <h3 class="text-xl font-semibold text-neutral-200">
              No Campaigns Yet
            </h3>
            <p class="text-neutral-400 mt-2">
              Create a new campaign to get started!
            </p>
          </div>
        {/if}
      </div>
    {:else if currentView === "create"}
      <!-- Create Post Form -->
      <CreateCampaign {closeForm} />
    {/if}
  </div>
</main>
