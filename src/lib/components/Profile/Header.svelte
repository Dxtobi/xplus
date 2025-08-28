<script>
  import PaymentButton from "$lib/components/PaymentButton.svelte";
  import Withdraw from "../Transactions/Withdraw.svelte";
  import { fly, slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  let { user, profile, closeModel } = $props();

  let isBalanceVisible = $state(true);

  function toggleBalance() {
    isBalanceVisible = !isBalanceVisible;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  }
</script>

<div
  class="bg-card border-b border-border px-4 py-6 lg:px-6 rounded-2xl"
  in:fly={{ delay: 500, duration: 50, x: 200, y: 0 }}
  out:fly={{ delay: 50, duration: 500, x: -200, y: 0 }}
>
  <div class="flex justify-between flex-col">
    <div class="flex items-center gap-4 justify-between w-full">
      <div class="flex items-center gap-4">
        <div class="relative">
          <img
            src={user.avatar ||
              "/placeholder.svg?height=48&width=48&query=user avatar"}
            alt="Profile"
            class="w-12 h-12 rounded-full border-2 border-primary/20"
          />
          <div
            class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"
          ></div>
        </div>
        <div>
          <h1 class="text-lg font-semibold text-card-foreground">
            {profile.name || user.username}
          </h1>
          <p class="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>
      <PaymentButton />
    </div>

    <div class=" mt-10">
      <div class="flex items-end gap-4 justify-between">
        <div class="flex flex-col">
          <p class="text-xs text-muted-foreground">Balance</p>
          <p class="text-3xl font-bold text-primary">
            {isBalanceVisible ? formatCurrency(user.balance) : "••••••••••••"}
          </p>
        </div>
        <button
          onclick={toggleBalance}
          class="p-1 hover:bg-muted rounded-md transition-colors"
          aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
        >
          <!-- Replaced SVG with Iconify icons for eye visibility toggle -->
          {#if isBalanceVisible}
            <iconify-icon
              icon="solar:eye-outline"
              width="28"
              height="28"
              style="color: hsl(var(--muted-foreground))"
            ></iconify-icon>
          {:else}
            <iconify-icon
              icon="solar:eye-closed-outline"
              width="28"
              height="28"
              style="color: hsl(var(--muted-foreground))"
            ></iconify-icon>
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>
<div class="flex md:justify-center-safe gap-4 justify-between my-4">
  <button
    onclick={closeModel}
    class={` px-6 py-2 bg-neutral-800 rounded-2xl my-2 flex gap-3 justify-around items-center`}
  >
    <span>Withdraw</span>
    <iconify-icon
      icon="uil:money-withdraw"
      width="24"
      height="24"
      style="color: #fff"
    ></iconify-icon>
  </button>

  <a
    href="/transactions"
    class={` px-6 py-2 bg-neutral-800 rounded-2xl my-2 flex gap-3 justify-around items-center`}
  >
    <span>Transactions</span>
    <iconify-icon
      icon="solar:transfer-horizontal-line-duotone"
      width="24"
      height="24"
      style="color: #fff"
    ></iconify-icon>
  </a>
</div>
