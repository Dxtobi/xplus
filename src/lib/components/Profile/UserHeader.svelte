<script>
  import Header from "./Header.svelte";

  import PaymentButton from "$lib/components/PaymentButton.svelte";
  import Withdraw from "../Transactions/Withdraw.svelte";
  let { user, profile } = $props();

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

  let showWithdrawalModel = $state(false);
  const closeModel = () => {
    showWithdrawalModel = !showWithdrawalModel;
  };
</script>

{#if showWithdrawalModel}
  <div
    class="fixed min-h-[100vh] w-full left-0 top-0 flex justify-center items-center backdrop-blur-3xl"
  >
    <div class="m-auto w-[90%]">
      <Withdraw {closeModel} />
    </div>
  </div>
{/if}
<Header {closeModel} {user} {profile} />
