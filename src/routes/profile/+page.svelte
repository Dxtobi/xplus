<script>
  import { page } from "$app/state";
  import CampaignOverview from "$lib/components/Profile/CampaignOverview.svelte";
  import PlatformBreakdown from "$lib/components/Profile/PlatformBreakdown.svelte";
  import RecentActivity from "$lib/components/Profile/RecentActivity.svelte";
  import StartsGrid from "$lib/components/Profile/StartsGrid.svelte";
  import UserHeader from "$lib/components/Profile/UserHeader.svelte";
  


  let userData =  $derived(page.data)


</script>



<div class="min-h-screen bg-background">
  <div class="max-w-md mx-auto lg:max-w-6xl lg:px-8">
    <!-- User Header -->
    <UserHeader user={userData.user} profile={userData.profile.user} />
    
    <!-- Stats Grid -->
    <StartsGrid campaigns={userData.profile.campaigns} engagements={userData.profile.engagements} />
    
    <!-- Campaign Overview -->
    <CampaignOverview summary={userData.campaignSummary} />
    
    <!-- Platform Breakdown -->
    <PlatformBreakdown platformsFromParentComponent={userData.profile.platformBreakdown} />
    
    <!-- Recent Activity -->
    <RecentActivity activity={userData.profile.recentActivity} />
  </div>
</div>