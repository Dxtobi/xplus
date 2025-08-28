    <script>
  let { stats } = $props();
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  function getTypeIcon(type) {
    switch (type) {
      case 'deposit': return 'ri:luggage-deposit-line';
      case 'campaign_payment': return 'solar:card-send-outline';
      case 'engagement_earning': return 'solar:star-outline';
      case 'withdrawal': return 'solar:card-transfer-outline';
      case 'refund': return 'solar:refresh-outline';
      default: return 'solar:wallet-money-outline';
    }
  }

  function getTypeColor(type) {
    switch (type) {
      case 'deposit': return 'var(--chart-2)';
      case 'campaign_payment': return 'var(--accent)';
      case 'engagement_earning': return 'var(--chart-2)';
      case 'withdrawal': return 'var(--destructive)';
      case 'refund': return 'var(--chart-4)';
      default: return 'var(--muted-foreground)';
    }
  }


 
</script>

<div class="space-y-6">
  <!-- Summary Cards -->
  {#if stats.summary && stats.summary[0]}
    {@const summary = stats.summary[0]}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-card p-4 rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <iconify-icon icon="solar:wallet-money-outline" width="20" height="20" style="color: var(--primary)"></iconify-icon>
          <span class="text-sm text-muted-foreground">Total</span>
        </div>
        <p class="text-lg font-semibold text-card-foreground">{formatCurrency(summary.totalAmount)}</p>
      </div>

      <div class="bg-card p-4 rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <iconify-icon icon="ri:luggage-deposit-line" width="20" height="20" style="color: var(--chart-2)"></iconify-icon>
          <span class="text-sm text-muted-foreground">Deposits</span>
        </div>
        <p class="text-lg font-semibold text-card-foreground">{formatCurrency(summary.deposits)}</p>
      </div>

      <div class="bg-card p-4 rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <iconify-icon icon="solar:card-send-outline" width="20" height="20" style="color: var(--accent)"></iconify-icon>
          <span class="text-sm text-muted-foreground">Payments</span>
        </div>
        <p class="text-lg font-semibold text-card-foreground">{formatCurrency(summary.campaignPayments)}</p>
      </div>

      <div class="bg-card p-4 rounded-lg">
        <div class="flex items-center gap-2 mb-2">
          <iconify-icon icon="solar:star-outline" width="20" height="20" style="color: var(--chart-2)"></iconify-icon>
          <span class="text-sm text-muted-foreground">Earnings</span>
        </div>
        <p class="text-lg font-semibold text-card-foreground">{formatCurrency(summary.earnings)}</p>
      </div>
    </div>
  {/if}

  <!-- Type Breakdown -->
  {#if stats.typeBreakdown && stats.typeBreakdown.length > 0}
    <div class="bg-card p-4 rounded-lg">
      <h3 class="font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <iconify-icon icon="solar:pie-chart-outline" width="20" height="20" style="color: var(--primary)"></iconify-icon>
        Transaction Types
      </h3>
      <div class="space-y-3">
        {#each stats.typeBreakdown as type}
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3  p-2">
              <iconify-icon 
                icon={getTypeIcon(type._id)} 
                width="18" 
                height="18" 
                style="color: {getTypeColor(type._id)}"
              ></iconify-icon>
              <div>
                <p class="font-medium text-card-foreground capitalize">{type._id.replace('_', ' ')}</p>
                <p class="text-sm text-muted-foreground">{type.count} transactions</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-card-foreground">{formatCurrency(type.totalAmount)}</p>
              <p class="text-sm text-muted-foreground">Avg: {formatCurrency(type.averageAmount)}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Status Breakdown -->
  {#if stats.statusBreakdown && stats.statusBreakdown.length > 0}
    <div class="bg-card p-4 rounded-lg">
      <h3 class="font-semibold text-card-foreground mb-4 flex items-center gap-2">
        <iconify-icon icon="solar:check-circle-outline" width="20" height="20" style="color: var(--primary)"></iconify-icon>
        Transaction Status
      </h3>
      <div class="space-y-3">
        {#each stats.statusBreakdown as status}
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full" style="background-color: {status._id === 'completed' ? 'var(--accent)' : status._id === 'pending' ? 'var(--chart-3)' : 'var(--destructive)'}"></div>
              <div>
                <p class="font-medium text-card-foreground capitalize">{status._id}</p>
                <p class="text-sm text-muted-foreground">{status.count} transactions</p>
              </div>
            </div>
            <p class="font-semibold text-card-foreground">{formatCurrency(status.totalAmount)}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
