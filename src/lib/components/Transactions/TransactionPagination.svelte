<script>
  let { onPageChange, pagination } = $props();
  
  function goToPage(page) {
    if (page >= 1 && page <= pagination.totalPages) {
      onPageChange({ page });
    }
  }

  function getVisiblePages() {
    const current = pagination.currentPage;
    const total = pagination.totalPages;
    const delta = 2;
    
    let pages = [];
    
    // Always show first page
    if (current - delta > 1) {
      pages.push(1);
      if (current - delta > 2) {
        pages.push('...');
      }
    }
    
    // Show pages around current
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
      pages.push(i);
    }
    
    // Always show last page
    if (current + delta < total) {
      if (current + delta < total - 1) {
        pages.push('...');
      }
      pages.push(total);
    }
    
    return pages;
  }
</script>

{#if pagination.totalPages > 1}
  <div class="bg-card p-4 rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <p class="text-sm text-muted-foreground">
        Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalTransactions)} of {pagination.totalTransactions} transactions
      </p>
    </div>
    
    <div class="flex items-center justify-center gap-2">
      <!-- Previous button -->
      <button 
        onclick={() => goToPage(pagination.currentPage - 1)}
        disabled={!pagination.hasPrev}
        class="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <iconify-icon icon="solar:alt-arrow-left-outline" width="16" height="16"></iconify-icon>
        <span class="hidden sm:inline">Previous</span>
      </button>

      <!-- Page numbers -->
      <div class="flex items-center gap-1">
        {#each getVisiblePages() as page}
          {#if page === '...'}
            <span class="px-3 py-2 text-muted-foreground">...</span>
          {:else}
            <button 
              onclick={() => goToPage(page)}
              class="w-10 h-10 rounded-md flex items-center justify-center transition-colors {page === pagination.currentPage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}"
            >
              {page}
            </button>
          {/if}
        {/each}
      </div>

      <!-- Next button -->
      <button 
        onclick={() => goToPage(pagination.currentPage + 1)}
        disabled={!pagination.hasNext}
        class="flex items-center gap-2 px-3 py-2 rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="hidden sm:inline">Next</span>
        <iconify-icon icon="solar:alt-arrow-right-outline" width="16" height="16"></iconify-icon>
      </button>
    </div>
  </div>
{/if}
