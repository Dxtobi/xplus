<script>
  let { transactions = [], loading = false } = $props();
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getTransactionIcon(type) {
    switch (type) {
      case 'deposit': return 'ri:luggage-deposit-line';
      case 'campaign_payment': return 'solar:card-send-outline';
      case 'engagement_earning': return 'solar:star-outline';
      case 'withdrawal': return 'solar:card-transfer-outline';
      case 'refund': return 'solar:refresh-outline';
      default: return 'solar:wallet-money-outline';
    }
  }

  function getTransactionColor(type) {
    switch (type) {
      case 'deposit': return 'var(--chart-2)';
      case 'campaign_payment': return 'var(--accent)';
      case 'engagement_earning': return 'var(--chart-2)';
      case 'withdrawal': return 'var(--destructive)';
      case 'refund': return 'var(--chart-4)';
      default: return 'var(--muted-foreground)';
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'completed': return 'var(--chart-2)';
      case 'pending': return 'var(--chart-3)';
      case 'failed': return 'var(--destructive)';
      default: return 'var(--muted-foreground)';
    }
  }

  function getAmountSign(type) {
    return ['deposit', 'engagement_earning', 'refund'].includes(type) ? '+' : '-';
  }
</script>

<div class="space-y-4">
  {#if loading}
    <!-- Loading skeleton -->
    {#each Array(5) as _}
      <div class="bg-card p-2    rounded-lg animate-pulse">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-muted rounded-full"></div>
            <div class="space-y-2">
              <div class="w-32 h-4 bg-muted rounded"></div>
              <div class="w-24 h-3 bg-muted rounded"></div>
            </div>
          </div>
          <div class="text-right space-y-2">
            <div class="w-20 h-4 bg-muted rounded ml-auto"></div>
            <div class="w-16 h-3 bg-muted rounded ml-auto"></div>
          </div>
        </div>
      </div>
    {/each}
  {:else if transactions.length === 0}
    <!-- Empty state -->
    <div class="bg-card p-2 rounded-lg text-center">
      <iconify-icon icon="solar:wallet-money-outline" width="48" height="48" style="color: var(--muted-foreground)" class="mx-auto mb-4"></iconify-icon>
      <h3 class="text-lg font-semibold text-card-foreground mb-2">No transactions found</h3>
      <p class="text-muted-foreground">Try adjusting your filters or check back later.</p>
    </div>
  {:else}
    <!-- Transaction items -->
    {#each transactions as transaction (transaction._id)}
      <div class="bg-card p-  hover:shadow-sm transition-shadow animate-in fade-in-0 slide-in-from-bottom-2 duration-300 my-2">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3 ">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background-color: {getTransactionColor(transaction.type)}20">
              <iconify-icon 
                icon={getTransactionIcon(transaction.type)} 
                width="20" 
                height="20" 
                style="color: {getTransactionColor(transaction.type)}"
              ></iconify-icon>
            </div>
            <div>
              <p class="font-medium text-card-foreground">{transaction.description}</p>
              <div class="flex items-start gap-2 mt-1 flex-col">
                <span class="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                <span class="w-1 h-1 bg-muted-foreground rounded-full"></span>
                <span class="text-sm capitalize" style="color: {getStatusColor(transaction.status)}">{transaction.status}</span>
              </div>
              {#if transaction.campaignId}
                <div class="flex items-center gap-1 mt-1">
                  <iconify-icon icon="solar:tag-outline" width="12" height="12" style="color: var(--muted-foreground)"></iconify-icon>
                  <span class="text-xs text-muted-foreground">{transaction.campaignId.title}</span>
                </div>
              {/if}
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-card-foreground">
              <span style="color: {getTransactionColor(transaction.type)}">
                {getAmountSign(transaction.type)}{formatCurrency(Math.abs(transaction.amount))}
              </span>
            </p>
            <p class="text-sm text-muted-foreground capitalize">{transaction.type.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
      <div class="py-1 w-full bg-neutral-900 rounded-2xl"></div>
    {/each}
  {/if}
</div>
