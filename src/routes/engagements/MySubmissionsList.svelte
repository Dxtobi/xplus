<script>
  import { timeAgo } from "$lib/utils/formatters";

  let { submissions } = $props();

  const statusStyles = {
    pending: {
      icon: "solar:hourglass-line-duotone",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    approved: {
      icon: "solar:check-circle-line-duotone",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    rejected: {
      icon: "solar:close-circle-line-duotone",
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
  };
</script>

<div
  class="bg-neutral-800/60 border border-neutral-700 rounded-2xl overflow-hidden"
>
  {#if submissions.length > 0}
    {#each submissions as submission (submission._id)}
      {@const style = statusStyles[submission.status] || statusStyles.pending}
      <div
        class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-700 last:border-b-0"
      >
        <div class="flex-1">
          <p class="font-semibold text-white">{submission.campaignId.title}</p>
          <p class="text-xs text-neutral-400">
            Submitted {timeAgo(submission.createdAt)} with username:
            <span class="font-medium text-neutral-300"
              >"{submission.proofUsername}"</span
            >
          </p>
        </div>
        <div class="flex-shrink-0">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full {style.bg} {style.color}"
          >
            <iconify-icon icon={style.icon} />
            <span class="capitalize">{submission.status}</span>
          </div>
        </div>
      </div>
    {/each}
  {:else}
    <div class="text-center p-12">
      <iconify-icon
        icon="solar:document-text-bold-duotone"
        class="text-5xl mx-auto text-neutral-500 mb-2"
      />
      <h3 class="font-semibold text-white">No Submissions Yet</h3>
      <p class="text-neutral-400">
        Engage with a campaign to see your submission history here.
      </p>
    </div>
  {/if}
</div>
