<script>
  import { slide } from "svelte/transition";

  import Overview from "./Overview.svelte";
  import MySubmissionsList from "./MySubmissionsList.svelte";
  import ReviewSubmissionsList from "./ReviewSubmissionsList.svelte";
  import { api } from "$lib/services/ApiService.svelte";
  import { toast } from "svelte-sonner";
  import { page } from "$app/stores";

  // This data comes from your +page.server.js load function
  const { data } = $page;

  console.log(data);
  // The main state for controlling which view is visible
  let currentView = $state("overview"); // 'overview', 'mySubmissions', 'reviewSubmissions'

  // Local, mutable state derived from server data for optimistic UI updates
  let mySubmissions = $state(data.mySubmissions || { engagements: [] });
  let reviewSubmissions = $state(data.reviewSubmissions || { engagements: [] });

  // Derived stats for the overview panel
  const overviewStats = $derived({
    pendingReview: reviewSubmissions.total || 0,
    myPending: mySubmissions.engagements.filter((s) => s.status === "pending")
      .length,
    myApproved: mySubmissions.engagements.filter((s) => s.status === "approved")
      .length,
    myRejected: mySubmissions.engagements.filter((s) => s.status === "rejected")
      .length,
  });

  // Central function to handle review actions from the child component
  async function handleReview({ detail }) {
    const { engagementIds, status, reason } = detail;
    const originalSubmissions = [...reviewSubmissions.engagements];

    // Optimistic UI: Immediately remove the submissions from the review list
    reviewSubmissions.engagements = reviewSubmissions.engagements.filter(
      (s) => !engagementIds.includes(s._id)
    );

    try {
      // This would be a new method in your ApiService to handle bulk reviews
      await api.reviewSubmissions({ engagementIds, status, reason });
    } catch (error) {
      // On error, revert the optimistic update
      reviewSubmissions.engagements = originalSubmissions;
      // ApiService will show the error toast
    }
  }
</script>

<div class="min-h-screen bg-neutral-900 text-neutral-200 p-4 md:p-6">
  <div class="max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-white flex items-center gap-3">
        <iconify-icon
          icon="solar:inbox-archive-bold-duotone"
          class="text-green-400"
        />
        Engagements Hub
      </h1>
      <p class="text-neutral-400 mt-1">
        Manage your earnings and review submissions from one place.
      </p>
    </div>

    <!-- Tab Navigation Menu -->
    <div
      class="mb-6 flex items-center border-b border-neutral-700 justify-between"
    >
      <button
        onclick={() => (currentView = "overview")}
        class="flex items-center gap-2 py-3 font-semibold transition-colors border-b-2"
        class:text-green-400={currentView === "overview"}
        class:border-green-400={currentView === "overview"}
        class:text-neutral-400={currentView !== "overview"}
        class:border-transparent={currentView !== "overview"}
        class:hover:text-white={currentView !== "overview"}
      >
        <iconify-icon icon="solar:pie-chart-2-bold" />
        <span>Overview</span>
      </button>
      <button
        onclick={() => (currentView = "mySubmissions")}
        class="flex items-center gap-2 py-3 font-semibold transition-colors border-b-2"
        class:text-green-400={currentView === "mySubmissions"}
        class:border-green-400={currentView === "mySubmissions"}
        class:text-neutral-400={currentView !== "mySubmissions"}
        class:border-transparent={currentView !== "mySubmissions"}
        class:hover:text-white={currentView !== "mySubmissions"}
      >
        <iconify-icon icon="solar:document-text-bold" />
        <span>Submissions</span>
      </button>
      <button
        onclick={() => (currentView = "reviewSubmissions")}
        class="flex items-center gap-2 py-3 font-semibold transition-colors border-b-2 relative"
        class:text-green-400={currentView === "reviewSubmissions"}
        class:border-green-400={currentView === "reviewSubmissions"}
        class:text-neutral-400={currentView !== "reviewSubmissions"}
        class:border-transparent={currentView !== "reviewSubmissions"}
        class:hover:text-white={currentView !== "reviewSubmissions"}
      >
        <iconify-icon icon="solar:document-add-bold" />
        <span>Review</span>
      </button>
    </div>

    <!-- Conditional Content Area -->
    <div class="min-h-[50vh]">
      {#if currentView === "overview"}
        <div in:slide|local>
          <Overview stats={overviewStats} />
        </div>
      {:else if currentView === "mySubmissions"}
        <div in:slide|local>
          <MySubmissionsList submissions={mySubmissions.engagements} />
        </div>
      {:else if currentView === "reviewSubmissions"}
        <div in:slide|local>
          <ReviewSubmissionsList
            submissions={reviewSubmissions.engagements}
            on:review={handleReview}
          />
        </div>
      {/if}
    </div>
  </div>
</div>
