<script>
  // This component is nearly identical to the one from the previous prompt.
  // The key is that it DISPATCHES events instead of handling API calls itself.
  import { createEventDispatcher } from "svelte";

  import { slide } from "svelte/transition";
  import SubmissionRow from "./SubmissionRow.svelte";

  let { submissions } = $props();
  const dispatch = createEventDispatcher();

  let selectedIds = $state(new Set());
  let isLoading = $state(false);

  const areAllSelected = $derived(
    submissions.length > 0 && selectedIds.size === submissions.length
  );

  function toggleSelectAll() {
    if (areAllSelected) {
      selectedIds = new Set();
    } else {
      selectedIds = new Set(submissions.map((s) => s._id));
    }
  }

  function toggleSelection(submissionId) {
    const newSet = new Set(selectedIds);
    if (newSet.has(submissionId)) newSet.delete(submissionId);
    else newSet.add(submissionId);
    selectedIds = newSet;
  }

  function handleBulkApprove() {
    dispatch("review", { engagementIds: [...selectedIds], status: "approved" });
    selectedIds = new Set(); // Clear selection optimistically
  }
</script>

<div>
  <!-- Bulk Action Bar -->
  {#if selectedIds.size > 0}
    <div
      class="sticky top-20 z-30 mb-4 flex items-center justify-between gap-4 bg-neutral-800 p-3 rounded-xl border border-green-500"
      transition:slide|local
    >
      <p class="font-semibold text-sm">{selectedIds.size} selected</p>
      <div class="flex items-center gap-2">
        <button
          class="px-4 py-1.5 text-sm bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20"
          >Reject</button
        >
        <button
          on:click={handleBulkApprove}
          class="px-4 py-1.5 text-sm bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >Approve</button
        >
      </div>
    </div>
  {/if}

  <!-- Submissions List/Table -->
  <div
    class="bg-neutral-800/60 border border-neutral-700 rounded-2xl overflow-hidden"
  >
    <div
      class="hidden md:flex items-center p-4 border-b border-neutral-700 text-xs text-neutral-400 font-semibold uppercase"
    >
      <label class="flex items-center"
        ><input
          type="checkbox"
          on:change={toggleSelectAll}
          checked={areAllSelected}
          class="w-4 h-4 bg-neutral-700 border-neutral-600 text-green-500 rounded focus:ring-green-500/50"
        /></label
      >
      <div class="flex-1 ml-4">Earner</div>
      <div class="flex-1">Campaign</div>
      <div class="flex-1">Proof Username</div>
      <div class="w-40 text-right">Actions</div>
    </div>

    {#each submissions as submission (submission._id)}
      <SubmissionRow
        {submission}
        isSelected={selectedIds.has(submission._id)}
        on:toggle={() => toggleSelection(submission._id)}
        on:review={(e) => dispatch("review", e.detail)}
      />
    {:else}
      <div class="text-center p-12">
        <iconify-icon
          icon="solar:check-read-bold-duotone"
          class="text-5xl mx-auto text-neutral-500 mb-2"
        />
        <h3 class="font-semibold text-white">All Caught Up!</h3>
        <p class="text-neutral-400">
          There are no pending submissions for your campaigns.
        </p>
      </div>
    {/each}
  </div>
</div>
