<script>
  let { campaigns, engagements } = $props();
  
  function formatPercentage(value) {
    return `${(parseFloat(value) * 100).toFixed(1)}%`;
  }
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
</script>

<div class="py-4 lg:p-6">
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Campaigns -->
    <div class="bg-card rounded-2xl p-4 border border-border hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-2">
        <div class="w-8 h-8 bg-primary/10 rounded-2xl flex items-center justify-center">
          <iconify-icon icon="solar:chart-outline" width="16" height="16" style="color: hsl(var(--primary))"></iconify-icon>
        </div>
        <span class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
          {campaigns.active} active
        </span>
      </div>
      <p class="text-2xl font-bold text-card-foreground">{campaigns.total}</p>
      <p class="text-xs text-muted-foreground">Total Campaigns</p>
    </div>
    
    <!-- Total Spent -->
    <div class="bg-card rounded-2xl p-4 border border-border hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-2">
        <div class="w-8 h-8 bg-secondary/10 rounded-2xl flex items-center justify-center">
          <iconify-icon icon="solar:dollar-outline" width="16" height="16" style="color: hsl(var(--secondary))"></iconify-icon>
        </div>
      </div>
      <p class="text-2xl font-bold text-card-foreground">{formatCurrency(campaigns.totalSpent)}</p>
      <p class="text-xs text-muted-foreground">Total Spent</p>
    </div>
    
    <!-- Completion Rate -->
    <div class="bg-card rounded-2xl p-4 border border-border hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-2">
        <div class="w-8 h-8 bg-accent/10 rounded-2xl flex items-center justify-center">
          <iconify-icon icon="solar:check-circle-outline" width="16" height="16" style="color: hsl(var(--accent))"></iconify-icon>
        </div>
      </div>
      <p class="text-2xl font-bold text-card-foreground">{formatPercentage(campaigns.completionRate)}</p>
      <p class="text-xs text-muted-foreground">Completion Rate</p>
    </div>
    
    <!-- Total Engagements -->
    <div class="bg-card rounded-2xl p-4 border border-border hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-2">
        <div class="w-8 h-8 bg-chart-3/10 rounded-2xl flex items-center justify-center">
          <iconify-icon icon="solar:heart-outline" width="16" height="16" style="color: hsl(var(--chart-3))"></iconify-icon>
        </div>
      </div>
      <p class="text-2xl font-bold text-card-foreground">{engagements.total}</p>
      <p class="text-xs text-muted-foreground">Total Engagements</p>
    </div>
  </div>
</div>
