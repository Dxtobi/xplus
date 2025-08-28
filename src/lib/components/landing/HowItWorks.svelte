<script>
  import { animateOnScroll } from "$lib/actions/animateOnScroll";
  import { slide } from "svelte/transition";

  let userType = $state("creator"); // 'creator' or 'earner'
</script>

<section
  id="how-it-works"
  class="py-20 md:py-28 bg-neutral-900"
  use:animateOnScroll
>
  <div class="container mx-auto px-4 md:px-6">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-white">
        Simple Steps to Success
      </h2>
      <p class="text-neutral-400 mt-2">
        Whether you're growing or earning, getting started is easy.
      </p>
    </div>

    <!-- Tab Switcher -->
    <div
      class="flex justify-center mb-8 bg-neutral-800 p-1.5 rounded-xl max-w-sm mx-auto"
    >
      <button
        on:click={() => (userType = "creator")}
        class="w-1/2 py-2.5 rounded-lg font-semibold transition-colors {userType ===
        'creator'
          ? 'bg-green-600 text-white'
          : 'text-neutral-400 hover:bg-neutral-700'}"
      >
        For Creators
      </button>
      <button
        on:click={() => (userType = "earner")}
        class="w-1/2 py-2.5 rounded-lg font-semibold transition-colors {userType ===
        'earner'
          ? 'bg-green-600 text-white'
          : 'text-neutral-400 hover:bg-neutral-700'}"
      >
        For Earners
      </button>
    </div>

    <!-- Content Area -->
    <div class="grid md:grid-cols-3 gap-8 text-center">
      {#if userType === "creator"}
        <!-- Creator Steps -->
        <div
          class="bg-neutral-800 p-6 rounded-xl border border-neutral-700"
          transition:slide|local
        >
          <iconify-icon
            icon="solar:upload-bold-duotone"
            class="text-4xl text-green-400 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-2">1. Create Campaign</h3>
          <p class="text-neutral-400">
            Submit any link (YouTube, TikTok, etc.) and set your engagement
            goals.
          </p>
        </div>
        <div
          class="bg-neutral-800 p-6 rounded-xl border border-neutral-700"
          transition:slide|local
        >
          <iconify-icon
            icon="solar:wallet-money-bold-duotone"
            class="text-4xl text-green-400 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-2">2. Fund Your Wallet</h3>
          <p class="text-neutral-400">
            Add funds securely with our Paystack integration. You only pay for
            results.
          </p>
        </div>
        <div
          class="bg-neutral-800 p-6 rounded-xl border border-neutral-700"
          transition:slide|local
        >
          <iconify-icon
            icon="solar:chart-2-bold-duotone"
            class="text-4xl text-green-400 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-2">3. Watch it Grow</h3>
          <p class="text-neutral-400">
            Receive real engagement from our community and track your progress
            live.
          </p>
        </div>
      {/if}

      {#if userType === "earner"}
        <!-- Earner Steps -->
        <div
          class="bg-neutral-800 p-6 rounded-xl border border-neutral-700"
          transition:slide|local
        >
          <iconify-icon
            icon="solar:cup-star-bold-duotone"
            class="text-4xl text-green-400 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-2">1. Browse Tasks</h3>
          <p class="text-neutral-400">
            Explore a live feed of campaigns from creators needing engagement.
          </p>
        </div>
        <div
          class="bg-neutral-800 p-6 rounded-xl border border-neutral-700"
          transition:slide|local
        >
          <iconify-icon
            icon="solar:cursor-click-bold-duotone"
            class="text-4xl text-green-400 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-2">2. Engage & Earn</h3>
          <p class="text-neutral-400">
            Complete simple tasks like liking, following, or viewing content to
            earn cash.
          </p>
        </div>
        <div
          class="bg-neutral-800 p-6 rounded-xl border border-neutral-700"
          transition:slide|local
        >
          <iconify-icon
            icon="solar:card-transfer-bold-duotone"
            class="text-4xl text-green-400 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold mb-2">3. Withdraw Funds</h3>
          <p class="text-neutral-400">
            Once you reach the threshold, withdraw your earnings directly to
            your bank account.
          </p>
        </div>
      {/if}
    </div>
  </div>
</section>
