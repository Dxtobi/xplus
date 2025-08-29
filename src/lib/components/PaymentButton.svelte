<script>
  import { quintOut } from "svelte/easing";
  import { toast } from "svelte-sonner";
  import { slide } from "svelte/transition";
  import { fade } from "svelte/transition";
  import { APP_PERCENTAGE_PER_DEPOSIT } from "$lib/utils/constants";

  let baseAmount = $state(null);
  let email = $state(""); // This should be dynamically set from user data
  let isLoading = $state(false);
  let isOpen = $state(false);

  let fee = $derived(
    baseAmount > 0 ? baseAmount * APP_PERCENTAGE_PER_DEPOSIT : 0
  );
  let totalAmount = $derived(baseAmount > 0 ? baseAmount + fee : 0);

  function toggleModal() {
    isOpen = !isOpen;
  }

  function closeModal() {
    isOpen = false;
  }

  async function initializePayment() {
    if (!baseAmount || baseAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    isLoading = true;

    try {
      // NOTE: Make sure this API endpoint matches your actual route
      const response = await fetch("/api/payments/initialize-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: baseAmount, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize payment.");
      }

      const data = await response.json();

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error("Could not start the payment process. Please try again.");
      }
    } catch (error) {
      console.error("Payment Initialization Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      isLoading = false;
    }
  }

  // Close modal on Escape key press
  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="relative inline-block">
  <!-- Trigger Button -->
  <button
    onclick={toggleModal}
    class="inline-flex items-center gap-2 p-2 text-green-400 font-semibold rounded-xl shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500/50"
    disabled={isLoading}
  >
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <iconify-icon icon="solar:wallet-2-bold-duotone" width="24" height="24" />
    <span class="hidden sm:inline">Add Funds</span>
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <iconify-icon
      icon="solar:alt-arrow-down-bold"
      class="w-4 h-4 transition-transform duration-200 {isOpen
        ? 'rotate-180'
        : ''}"
    />
  </button>

  <!-- Modal / Dropdown Logic -->
  {#if isOpen}
    <!-- Backdrop (covers entire screen) -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="fixed inset-0 z-40 bg-black/50"
      transition:fade={{ duration: 300 }}
      onclick={closeModal}
    ></div>

    <!-- Mobile Modal (Slides from bottom) -->
    <div
      class="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      transition:slide={{ duration: 400, easing: quintOut, y: "100%" }}
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-neutral-800 rounded-t-2xl border-t-2 border-green-500 shadow-2xl overflow-hidden pb-32"
      >
        <!-- Modal Content (shared or duplicated for consistency) -->
        {@render modalContent()}
      </div>
    </div>

    <!-- Desktop Dropdown (Slides from top) -->
    <div
      class="hidden absolute top-full mt-2 right-0 z-50 md:block"
      transition:slide={{ duration: 300, easing: quintOut }}
      role="dialog"
      aria-modal="true"
    >
      <div
        class="bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden w-96"
      >
        <!-- Modal Content -->
        {@render modalContent()}
      </div>
    </div>
  {/if}
</div>

<!-- SNIPPET for Reusable Modal Content -->
{#snippet modalContent()}
  <!-- Header -->
  <div class="bg-neutral-900/50 px-6 py-4 border-b border-neutral-700">
    <div class="flex items-center justify-between">
      <h3
        class="text-lg font-semibold text-neutral-100 flex items-center gap-3"
      >
        <iconify-icon
          icon="solar:wallet-money-bold-duotone"
          class="text-green-400"
        />
        Top Up Wallet
      </h3>
      <button
        onclick={closeModal}
        class="text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-700"
      >
        <iconify-icon icon="solar:close-circle-bold" class="text-2xl" />
      </button>
    </div>
  </div>

  <!-- Form Content -->
  <div class="p-6 space-y-5">
    <!-- Amount Input -->
    <div class="space-y-2">
      <label for="amount" class="block text-sm font-medium text-neutral-300">
        Enter Amount (NGN)
      </label>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
        >
          <span class="text-neutral-400 text-lg">₦</span>
        </div>
        <input
          type="number"
          id="amount"
          bind:value={baseAmount}
          placeholder="1000"
          min="100"
          disabled={isLoading}
          class="block w-full pl-10 pr-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg font-medium text-white disabled:bg-neutral-700 disabled:cursor-not-allowed"
        />
      </div>
    </div>

    <!-- Summary -->
    {#if baseAmount > 0}
      <div
        class="bg-neutral-900/50 rounded-xl p-4 space-y-3 border border-neutral-700"
        transition:slide={{ duration: 250 }}
      >
        <div class="flex justify-between items-center text-sm">
          <span class="text-neutral-400">Amount:</span>
          <span class="font-semibold text-neutral-200"
            >₦{baseAmount.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}</span
          >
        </div>

        <div class="flex justify-between items-center text-sm">
          <span class="text-neutral-400">Service Fee (10%):</span>
          <span class="font-semibold text-neutral-200"
            >₦{fee.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span
          >
        </div>

        <hr class="border-neutral-700" />

        <div class="flex justify-between items-center">
          <span class="font-semibold text-neutral-200">Total to Pay:</span>
          <span class="font-bold text-lg text-green-400"
            >₦{totalAmount.toLocaleString("en-NG", {
              minimumFractionDigits: 2,
            })}</span
          >
        </div>
      </div>
    {/if}

    <!-- Action Button -->
    <button
      onclick={initializePayment}
      disabled={isLoading || !baseAmount || baseAmount <= 0}
      class="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-400/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-2"
    >
      {#if isLoading}
        <iconify-icon icon="svg-spinners:180-ring-with-bg" class="text-xl" />
        Processing...
      {:else}
        <iconify-icon icon="solar:arrow-right-bold-duotone" class="text-xl" />
        Pay {totalAmount > 0 ? `₦${totalAmount.toLocaleString()}` : ""}
      {/if}
    </button>
  </div>
{/snippet}
