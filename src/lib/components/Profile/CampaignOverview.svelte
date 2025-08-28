<script>
  import { actionTypes } from "$lib/utils/constants";

  let { summary } = $props();
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  

</script>

<div class=" lg:px-6 pb-6">
  <h2 class="text-lg font-semibold text-card-foreground mb-4 text-left w-full">Campaign Overview</h2>
  
  <div class="space-y-4">
    <!-- Action Type Breakdown -->
    <div class="bg-card rounded-2xl p-4 border border-border">
      <h3 class="text-sm font-medium text-card-foreground mb-3">Action Types</h3>
      <div class="space-y-3">
        {#each summary.actionTypeBreakdown as action}
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-primary/10 rounded-2xl flex items-center justify-center">
                <!-- <CHANGE> Replaced SVG with Iconify icons for action types -->
                <iconify-icon icon={actionTypes.find((p) => p.value.toLowerCase() === action._id.toLowerCase()).icon} width="16" height="16" style={`color:${actionTypes.find((p) => p.value.toLowerCase() === action._id.toLowerCase()).color}`}></iconify-icon>
              </div>
              <div>
                <p class="text-sm font-medium text-card-foreground capitalize">{action._id}</p>
                <p class="text-xs text-muted-foreground">{action.count} campaigns</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-card-foreground">{formatCurrency(action.totalCost)}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Monthly Trend -->
    <div class="bg-card rounded-2xl p-4 border border-border">
      <h3 class="text-sm font-medium text-card-foreground mb-3">Monthly Performance</h3>
      {#each summary.monthlyTrend as trend}
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-card-foreground">
              {new Date(trend._id.year, trend._id.month - 1).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
            </p>
            <p class="text-xs text-muted-foreground">{trend.count} campaigns</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-primary">{formatCurrency(trend.spending)}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
