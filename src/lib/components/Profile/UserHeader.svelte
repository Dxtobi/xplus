<script>
  import Header from './Header.svelte';

  import PaymentButton from '$lib/components/PaymentButton.svelte';
  import Withdraw from '../Transactions/Withdraw.svelte';
  let { user, profile } = $props();
  
  let isBalanceVisible = $state(true);
  
  function toggleBalance() {
    isBalanceVisible = !isBalanceVisible;
  }
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount);
  }

  let showWithdrawalModel = $state(false)
  const closeModel=()=>{
    showWithdrawalModel=!showWithdrawalModel
  }
</script>


{#if showWithdrawalModel}
  <Withdraw {closeModel}/>
{:else}
  
<Header {closeModel} {user} {profile} />
{/if}
