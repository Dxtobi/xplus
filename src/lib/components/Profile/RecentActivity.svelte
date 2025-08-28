<script>
  let { activity } = $props();
  
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  // <CHANGE> Updated activity items to use Iconify icon names instead of SVG paths
  let activityItems = $derived([
    {
      icon: 'uis:chart',
      title: 'Active Campaigns',
      value: activity.campaigns,
      subtitle: 'campaigns running',
      color: 'text-primary'
    },
    {
      icon: 'teenyicons:dollar-outline',
      title: 'Total Spending',
      value: formatCurrency(activity.spending),
      subtitle: 'this month',
      color: 'text-secondary'
    },
    {
      icon: 'stash:heart-duotone',
      title: 'Engagements',
      value: activity.engagements,
      subtitle: 'total interactions',
      color: 'text-accent'
    }
  ]);
</script>

<div class=" lg:px-6 pb-6">
  <h2 class="text-lg font-semibold text-card-foreground mb-4">Recent Activity</h2>
  
  <div class="bg-card rounded-2xl border border-border overflow-hidden">
    <div class="divide-y divide-border">
      {#each activityItems as item, index}
        <div class="p-4 hover:bg-muted/50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-muted rounded-2xl flex items-center justify-center text-green">
              <!-- <CHANGE> Replaced SVG with Iconify icons -->
              <iconify-icon icon={item.icon} width="20" height="20" ></iconify-icon>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-card-foreground">{item.title}</p>
              <p class="text-xs text-muted-foreground">{item.subtitle}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold {item.color}">{item.value}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>