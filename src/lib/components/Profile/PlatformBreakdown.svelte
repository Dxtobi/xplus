<script>
  import { platforms } from "$lib/utils/constants";

  let { platformsFromParentComponent } = $props();

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // <CHANGE> Updated function to return Iconify icon names instead of SVG paths
  function getPlatformIcon(platform) {
    switch (platform.toLowerCase()) {
      case "youtube":
        return "solar:videocamera-outline";
      case "website":
        return "solar:global-outline";
      default:
        return "solar:check-circle-outline";
    }
  }

  let totalSpent = $derived(
    platformsFromParentComponent.reduce(
      (sum, platform) => sum + platform.totalSpent,
      0
    )
  );
</script>

<div class=" lg:px-6 pb-6">
  <h2 class="text-lg font-semibold text-card-foreground mb-4">
    Platform Breakdown
  </h2>

  <div class="bg-card rounded-2xl p-4 border border-border">
    <div class="space-y-4">
      {#each platformsFromParentComponent as platform}
        {@const percentage =
          totalSpent > 0 ? (platform.totalSpent / totalSpent) * 100 : 0}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-primary/10 rounded-2xl flex items-center justify-center"
              >
                <!-- <CHANGE> Replaced SVG with Iconify icons -->
                <iconify-icon
                  icon={platforms.find(
                    (p) => p.name.toLowerCase() === platform._id.toLowerCase()
                  ).icon}
                  width="16"
                  height="16"
                  style={`color:${platforms.find((p) => p.name.toLowerCase() === platform._id.toLowerCase()).color}`}
                ></iconify-icon>
              </div>
              <div>
                <p class="text-sm font-medium text-card-foreground">
                  {platform._id}
                </p>
                <p class="text-xs text-muted-foreground">
                  {platform.count} campaigns
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-card-foreground">
                {formatCurrency(platform.totalSpent)}
              </p>
              <p class="text-xs text-muted-foreground">
                {percentage.toFixed(1)}%
              </p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-muted rounded-full h-2">
            <div
              class="bg-primary rounded-full h-2 transition-all duration-500 ease-out"
              style="width: {percentage}%"
            ></div>
          </div>

          <div class="flex justify-between text-xs text-muted-foreground">
            <span>{platform.totalActions} actions</span>
            <span>{platform.count} campaigns</span>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
