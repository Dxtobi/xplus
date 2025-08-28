<script>
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { api } from "$lib/services/ApiService.svelte"; // Your API service
  import { page } from "$app/state";
  import { fly, slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { invalidateAll } from "$app/navigation";

  const { closeModel } = $props();
  // This data would be passed down from the page
  let user = $derived(page.data.user);

  let banks = $state([]);
  let selectedBankCode = $state("");
  let accountNumber = $state("");
  let withdrawalAmount = $state(null);
  let isAddingAccount = $state(false);
  let isWithdrawing = $state(false);

  const MIN_WITHDRAWAL = 5000;
  let hasRecipient = $derived(user && user.paystackRecipientCode);

  // Fetch the list of Nigerian banks from Paystack when the component mounts
  onMount(async () => {
    try {
      const response = await fetch("https://api.paystack.co/bank");
      if (!response.ok) throw new Error("Could not fetch banks");
      const data = await response.json();
      banks = data.data;
    } catch (error) {
      toast.error("Could not load list of banks.");
    }
  });

  // Client-side validation for withdrawal amount
  let validationError = $derived.by(() => {
    if (!withdrawalAmount) return "";
    if (withdrawalAmount < MIN_WITHDRAWAL) {
      return `Minimum withdrawal is ₦${MIN_WITHDRAWAL.toLocaleString()}`;
    }
    if (withdrawalAmount > user.balance) {
      return "Amount exceeds your available balance.";
    }
    return "";
  });

  async function addBankAccount(e) {
    e.preventDefault();
    if (!selectedBankCode || !accountNumber) {
      toast.error("Please select a bank and enter your account number.");
      return;
    }

    isAddingAccount = true;
    try {
      // You need to create this API endpoint
      const result = await api.addPaystackRecipient({
        bankCode: selectedBankCode,
        accountNumber: accountNumber,
      });
      // The parent page should reload its data to get the updated user object
      // For now, we can optimistically update it here for the UI
      user.paystackRecipientCode = result.recipientCode;
      user.bankName = result.bankName;
      user.accountNumberLast4 = result.accountNumberLast4;
      toast.success("Bank account added successfully!");
    } catch (error) {
      // ApiService will show the toast for the error
    } finally {
      isAddingAccount = false;
    }
  }

  async function requestWithdrawal(e) {
    e.preventDefault();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    isWithdrawing = true;
    try {
      await api.initiateWithdrawal({ amount: withdrawalAmount });

      withdrawalAmount = null; // Reset form
    } catch (error) {
      // ApiService handles error toast
    } finally {
      await invalidateAll();
      isWithdrawing = false;
    }
  }

  let isValid = $state(true);

  $effect(() => {
    if (accountNumber.length === 0) {
      isValid = true; // Empty is ok while typing
    } else {
      isValid = /^\d{10}$/.test(accountNumber);
    }
  });

  function handleInput(e) {
    // Only allow numbers
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      accountNumber = value;
    }
  }
</script>

<div
  class="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 w-full max-w-md mx-auto"
  in:fly={{ delay: 50, duration: 500, x: 200, y: 0 }}
  out:fly={{ delay: 50, duration: 500, x: -200, y: 0 }}
>
  <div class="flex justify-between">
    <h2 class="text-xl font-bold text-white mb-4">Withdraw Earnings</h2>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button onclick={closeModel} class=""
      ><iconify-icon
        icon="lets-icons:close-ring-duotone"
        width="24"
        height="24"
        style="color: #fff"
      ></iconify-icon></button
    >
  </div>
  <!-- Show this form if user has linked a bank account -->
  {#if hasRecipient}
    <div class="space-y-5">
      <div class="bg-neutral-900/50 p-4 rounded-xl border border-neutral-700">
        <p class="text-sm text-neutral-400">Withdraw to:</p>
        <div class="flex items-start gap-3 mt-1">
          <!-- svelte-ignore element_invalid_self_closing_tag -->
          <iconify-icon
            icon="solar:banknote-2-bold-duotone"
            class="text-2xl text-green-400"
          />
          <div>
            <p class="font-semibold text-neutral-100">{user.bankName}</p>
            <p class="text-xs text-neutral-400">
              **** **** **** {user.accountNumberLast4}
            </p>
          </div>
        </div>
      </div>

      <form onsubmit={requestWithdrawal} class="space-y-4">
        <div>
          <label
            for="withdrawalAmount"
            class="block text-sm font-medium text-neutral-300 mb-2"
          >
            Amount to Withdraw (Available: ₦{user.balance.toLocaleString()})
          </label>
          <div class="relative">
            <span
              class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              >₦</span
            >
            <input
              type="number"
              id="withdrawalAmount"
              bind:value={withdrawalAmount}
              placeholder="5000"
              class="w-full pl-8 pr-4 py-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:ring-2 focus:ring-green-500"
            />
          </div>
          {#if validationError}
            <p class="text-xs text-red-400 mt-1">{validationError}</p>
          {/if}
        </div>
        <button
          type="submit"
          disabled={isWithdrawing || !!validationError || !withdrawalAmount}
          class="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if isWithdrawing}
            <iconify-icon icon="svg-spinners:180-ring-with-bg" />
            <span>Processing...</span>
          {:else}
            <iconify-icon icon="solar:transfer-horizontal-bold-duotone" />
            <span>Withdraw</span>
          {/if}
        </button>
      </form>
    </div>

    <!-- Show this form if user has NOT linked an account -->
  {:else}
    <form onsubmit={addBankAccount} class="space-y-4">
      <p class="text-sm text-neutral-400">
        Add a bank account to receive your earnings.
      </p>
      <div>
        <label
          for="bank"
          class="block text-sm font-medium text-neutral-300 mb-2"
          >Select Bank</label
        >
        <select
          id="bank"
          bind:value={selectedBankCode}
          class="w-full p-3 bg-neutral-900 border border-neutral-600 rounded-xl text-white focus:ring-2 focus:ring-green-500"
        >
          <option value="" disabled>Select your bank</option>
          {#each banks as bank}
            <option value={bank.code}>{bank.name}</option>
          {/each}
        </select>
      </div>

      <div>
        <label
          for="accountNumber"
          class="block text-sm font-medium text-neutral-300 mb-2"
          >Account Number</label
        >
        <input
          type="text"
          id="accountNumber"
          value={accountNumber}
          oninput={handleInput}
          maxlength="10"
          inputmode="numeric"
          class="w-full p-3 bg-neutral-700/50 border border-neutral-600 rounded-xl text-white focus:ring-2 focus:ring-green-500 {!isValid
            ? 'border-red-500'
            : ''}"
          placeholder="Enter 10-digit account number"
        />
        {#if !isValid && accountNumber.length > 0}
          <p class="text-red-500 text-sm mt-1">
            Please enter exactly 10 digits
          </p>
        {/if}
      </div>

      <button
        type="submit"
        disabled={isAddingAccount ||
          !selectedBankCode ||
          accountNumber.length !== 10}
        class="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if isAddingAccount}
          <iconify-icon icon="svg-spinners:180-ring-with-bg" />
          <span>Verifying & Saving...</span>
        {:else}
          <iconify-icon icon="solar:add-circle-bold-duotone" />
          <span>Save Bank Account</span>
        {/if}
      </button>
    </form>
  {/if}
</div>
