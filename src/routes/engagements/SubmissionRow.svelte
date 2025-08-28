<script>
  import { createEventDispatcher } from "svelte";
  import RejectionModal from "./RejectionModal.svelte"; // The modal to enter rejection reasons

  let { submission, isSelected } = $props();
  const dispatch = createEventDispatcher();

  let showRejectModal = $state(false);

  function approve() {
    // Dispatch the review event with the 'approved' status
    dispatch("review", { engagementIds: [submission._id], status: "approved" });
  }

  function reject(event) {
    const { reason } = event.detail; // Get reason from the modal's event
    // Dispatch the review event with the 'rejected' status and reason
    dispatch("review", {
      engagementIds: [submission._id],
      status: "rejected",
      reason,
    });
  }
</script>

<!-- The main row container. A light green background is applied when selected. -->
<div
  class="p-4 border-b border-neutral-700 last:border-b-0 flex flex-col md:flex-row md:items-center gap-4 md:gap-0 transition-colors {isSelected
    ? 'bg-green-500/5'
    : ''}"
>
  <!-- Checkbox for bulk actions -->
  <label class="flex-shrink-0 flex items-center self-start md:self-center">
    <input
      type="checkbox"
      class="w-4 h-4 bg-neutral-700 border-neutral-600 text-green-500 rounded focus:ring-green-500/50"
      checked={isSelected}
      onchange={() => dispatch("toggle")}
    />
  </label>

  <!-- Earner Info (User who submitted) -->
  <div class="flex-1 md:ml-4 flex items-center gap-3">
    <img
      src={submission.userId.avatar}
      alt={submission.userId.name}
      class="w-10 h-10 rounded-full"
    />
    <div>
      <p class="font-semibold text-white">{submission.userId.name}</p>
      <!-- On mobile, show the campaign title here for context -->
      <p class="text-xs text-neutral-400 md:hidden">
        {submission.campaignId.title}
      </p>
    </div>
  </div>

  <!-- Campaign Info (Hidden on mobile for space) -->
  <div class="hidden md:block flex-1">
    <p
      class="text-sm text-neutral-300 truncate"
      title={submission.campaignId.title}
    >
      {submission.campaignId.title}
    </p>
  </div>

  <!-- Proof Username -->
  <div class="flex-1">
    <div class="flex items-center gap-2">
      <!-- Link to the user's social media profile for easy verification -->
      <a
        href={submission.proofLink}
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-sm text-green-400 bg-neutral-700/50 px-3 py-1 rounded-md hover:bg-neutral-700 transition-colors"
      >
        @{submission.proofUsername}
      </a>
    </div>
  </div>

  <!-- Actions (Approve/Reject) -->
  <div class="w-full md:w-40 flex items-center justify-end gap-2">
    <button
      onclick={() => (showRejectModal = true)}
      title="Reject Submission"
      class="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
    >
      <iconify-icon icon="solar:close-circle-bold" class="text-xl" />
    </button>
    <button
      onclick={approve}
      title="Approve Submission"
      class="p-2 text-neutral-400 hover:text-green-400 hover:bg-green-500/10 rounded-full transition-colors"
    >
      <iconify-icon icon="solar:check-circle-bold" class="text-xl" />
    </button>
  </div>
</div>

<!-- The Rejection Modal is managed locally by this component -->
{#if showRejectModal}
  <RejectionModal
    on:close={() => (showRejectModal = false)}
    on:confirm={reject}
  />
{/if}
