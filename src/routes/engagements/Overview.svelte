<script>
  let { stats } = $props();
</script>

<div>
  <h2 class="text-xl font-semibold mb-4">Your Activity at a Glance</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Stat Card -->
    <div class="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
      <div class="flex items-center gap-3 text-yellow-400">
        <iconify-icon icon="solar:hourglass-bold-duotone" class="text-2xl" />
        <p class="font-semibold">Submissions Pending</p>
      </div>
      <p class="text-4xl font-bold mt-2 text-white">{stats.myPending}</p>
    </div>
    <!-- Stat Card -->
    <div class="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
      <div class="flex items-center gap-3 text-green-400">
        <iconify-icon icon="solar:check-circle-bold-duotone" class="text-2xl" />
        <p class="font-semibold">Submissions Approved</p>
      </div>
      <p class="text-4xl font-bold mt-2 text-white">{stats.myApproved}</p>
    </div>
    <!-- Stat Card -->
    <div class="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
      <div class="flex items-center gap-3 text-red-400">
        <iconify-icon icon="solar:close-circle-bold-duotone" class="text-2xl" />
        <p class="font-semibold">Submissions Rejected</p>
      </div>
      <p class="text-4xl font-bold mt-2 text-white">{stats.myRejected}</p>
    </div>
    <!-- Stat Card -->
    <div class="bg-neutral-800 p-4 rounded-xl border border-neutral-700">
      <div class="flex items-center gap-3 text-teal-400">
        <iconify-icon
          icon="solar:checklist-minimalistic-bold-duotone"
          class="text-2xl"
        />
        <p class="font-semibold">Awaiting Your Review</p>
      </div>
      <p class="text-4xl font-bold mt-2 text-white">{stats.pendingReview}</p>
    </div>
  </div>
</div>
