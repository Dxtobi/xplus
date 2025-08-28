<script>
  import { onMount } from 'svelte';
  let { filter, clear, filters = {} } = $props();
  
  let showFilters = $state(false);
  let localFilters = $state({
    type: filters.type || '',
    status: filters.status || '',
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
    sortBy: filters.sortBy || 'createdAt',
    sortOrder: filters.sortOrder || 'desc'
  });

  function applyFilters() {
    filters = { ...localFilters };
    if (filter) filter(filters);
    showFilters = false;
  }

  function clearFilters() {
    localFilters = {
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    applyFilters();
    if (clear) clear();
  }
</script>

<div class="bg-card rounded-lg p-4 mb-6">
  <button 
    onclick={() => showFilters = !showFilters}
    class="flex items-center justify-between w-full text-left"
  >
    <div class="flex items-center gap-2">
      <iconify-icon icon="solar:filter-outline" width="20" height="20" style="color: var(--primary)"></iconify-icon>
      <span class="font-medium text-card-foreground">Filters</span>
    </div>
    <iconify-icon 
      icon={showFilters ? "solar:alt-arrow-up-outline" : "solar:alt-arrow-down-outline"} 
      width="20" 
      height="20" 
      style="color: var(--muted-foreground)"
    ></iconify-icon>
  </button>

  {#if showFilters}
    <div class="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Transaction Type Filter -->
        <div>
          <label for="transactionType" class="block text-sm font-medium text-muted-foreground mb-2">Transaction Type</label>
          <select id="transactionType" bind:value={localFilters.type} class="w-full p-2 bg-input border border-border rounded-md text-foreground">
            <option value="">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="campaign_payment">Campaign Payment</option>
            <option value="engagement_earning">Engagement Earning</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="refund">Refund</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label for="status" class="block text-sm font-medium text-muted-foreground mb-2">Status</label>
          <select id="status" bind:value={localFilters.status} class="w-full p-2 bg-input border border-border rounded-md text-foreground">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <!-- Start Date -->
        <div>
          <label for="startDate" class="block text-sm font-medium text-muted-foreground mb-2">Start Date</label>
          <input 
            id="startDate"
            type="date" 
            bind:value={localFilters.startDate}
            class="w-full p-2 bg-input border border-border rounded-md text-foreground"
          />
        </div>

        <!-- End Date -->
        <div>
          <label for="endDate" class="block text-sm font-medium text-muted-foreground mb-2">End Date</label>
          <input 
            id="endDate"
            type="date" 
            bind:value={localFilters.endDate}
            class="w-full p-2 bg-input border border-border rounded-md text-foreground"
          />
        </div>

        <!-- Sort By -->
        <div>
          <label for="sortBy" class="block text-sm font-medium text-muted-foreground mb-2">Sort By</label>
          <select id="sortBy" bind:value={localFilters.sortBy} class="w-full p-2 bg-input border border-border rounded-md text-foreground">
            <option value="createdAt">Date</option>
            <option value="amount">Amount</option>
            <option value="type">Type</option>
            <option value="status">Status</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div>
          <label for="sortOrder" class="block text-sm font-medium text-muted-foreground mb-2">Sort Order</label>
          <select id="sortOrder" bind:value={localFilters.sortOrder} class="w-full p-2 bg-input border border-border rounded-md text-foreground">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <button 
          onclick={applyFilters}
          class="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          Apply Filters
        </button>
        <button 
          onclick={clearFilters}
          class="px-4 py-2 border border-border rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  {/if}
</div>
