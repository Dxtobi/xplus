<script>
  import { onMount } from "svelte";

  import { page } from "$app/state";
  import TransactionPagination from "$lib/components/Transactions/TransactionPagination.svelte";
  import TransactionList from "$lib/components/Transactions/TransactionList.svelte";
  import TransactionStats from "$lib/components/Transactions/TransactionStats.svelte";
  import TransactionFilters from "$lib/components/Transactions/TransactionFilters.svelte";
  import { goto } from "$app/navigation";

  let transactions = $derived(page.data.transactions.transactions);
  let pagination = $derived(page.data.transactions.pagination);
  let stats = $derived(page.data.transactionStats);
  let loading = $state(false);
  let statsLoading = $state(false);

  let filters = $state({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  async function loadTransactions() {
    // loading = true;
    // try {
    //   const result = await TransactionModel.getUserTransactions(user.id, filters);
    //    transactions = result.transactions;
    //    pagination = result.pagination;
    //    stats
    // } catch (error) {
    //   console.error('Failed to load transactions:', error);
    // } finally {
    //   loading = false;
    // }
  }

  async function loadStats() {
    // statsLoading = true;
    // try {
    // } catch (error) {
    //   console.error('Failed to load stats:', error);
    // } finally {
    //   statsLoading = false;
    // }
  }

  function handleFilter(newFilters) {
    filters = { ...filters, ...newFilters, page: 1 };
    loadTransactions();
    loadStats();
  }

  function handlePageChange(pageData) {
    filters = { ...filters, page: pageData.page };
    loadTransactions();
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  onMount(() => {
    loadTransactions();
    loadStats();
  });
</script>

<div class="min-h-screen bg-background">
  <button
    class="px-4 py-1 rounded-2xl bg-neutral-800 flex items-center gap-2 my-4"
    onclick={() => history.back()}
  >
    <iconify-icon
      icon="ion:arrow-back"
      width="20"
      height="20"
      style="color: #fff"
    ></iconify-icon>
    <span>Back</span>
  </button>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div
      class="bg-card rounded-lg flex overflow-hidden"
      style="background-image:url('/bg.png'); background-size: cover; background-position: center; background-attachment: fixed;"
    >
      <div
        class="flex p-4 w-full flex-1 h-full items-start justify-between py-4 gap-4 flex-col backdrop-blur-sm"
      >
        <div>
          <h1 class=" font-bold text-card-foreground">Transaction History</h1>
          <p class="  text-neutral-200">Track your financial activity</p>
        </div>
        <div class="">
          <p class="text-sm text-green-800">Current Balance</p>
          <p class="text-3xl font-bold">
            {formatCurrency(page.data.user.balance)}
          </p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <TransactionFilters bind:filters filter={handleFilter} />

    <!-- Stats -->
    {#if !statsLoading}
      <TransactionStats {stats} />
    {:else}
      <div class="bg-card p-2 rounded-lg animate-pulse">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each Array(4) as _}
            <div class="space-y-2">
              <div class="w-20 h-4 bg-muted rounded"></div>
              <div class="w-24 h-6 bg-muted rounded"></div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Transaction List -->
    <div class="bg-card p-4 rounded-lg">
      <h2
        class="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2"
      >
        <iconify-icon
          icon="solar:history-outline"
          width="20"
          height="20"
          style="color: var(--primary)"
        ></iconify-icon>
        Recent Transactions
      </h2>
      <TransactionList {transactions} {loading} />
    </div>

    <!-- Pagination -->
    <TransactionPagination {pagination} onPageChange={handlePageChange} />
  </div>
</div>
