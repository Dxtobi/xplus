<script lang="ts">
  import { page } from "$app/state";

  interface Props {
    // Props for current active tab and navigation handler
    activeTab?: string;
    onNavigate: any;
  }

  let { activeTab = "/", onNavigate } = $props();

  //   $effect(()=>{
  //     $inspect(page.route.id)
  //   })
  // Navigation items configuration
  const navItems = [
    {
      id: "/h",
      link: "/h",
      label: "Home",
      icon: "solar:home-2-bold-duotone",
      iconOutline: "solar:home-2-outline",
    },
    // {
    //   id: "/transactions",
    //   label: "Transactions",
    //   icon: "solar:card-bold-duotone",
    //   iconOutline: "solar:card-outline",
    //   link: "/transactions",
    // },
    {
      id: "/campaigns",
      label: "Campaigns",
      icon: "material-symbols:campaign-rounded",
      iconOutline: "material-symbols:campaign-rounded",
      link: "/campaigns",
    },
    {
      id: "/engagements",
      label: "Engage.",
      icon: "duo-icons:approved",
      iconOutline: "duo-icons:approved",
      link: "/engagements",
    },
    {
      id: "/profile",
      label: "Profile",
      icon: "solar:user-bold-duotone",
      iconOutline: "solar:user-outline",
      link: "/profile",
    },
  ];

  // Handle tab click
  function handleTabClick(tabId) {
    onNavigate(page.route.id);
  }
</script>

<!-- Navigation Footer -->
<nav
  class="fixed bottom-[-1px] left-0 right-0 bg-neutral-900/40 backdrop-blur-3xl px-2 py-1 z-50 md:border-t-0 md:bg-transparent"
>
  <div class="flex items-center justify-around max-w-md mx-auto">
    {#each navItems as item}
      <a
        href={`${item.link}`}
        onclick={() => handleTabClick(item.id)}
        class="flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1 group hover:bg-gray-50 active:scale-95"
        class:active={page.route.id === item.id}
      >
        <!-- iconify-icon -->
        <div class="relative mb-1">
          <iconify-icon
            icon={page.route.id === item.id ? item.icon : item.iconOutline}
            width="24"
            height="24"
            class="transition-all duration-200"
            style="color: {page.route.id === item.id
              ? 'var(--accent)'
              : 'var(--muted-foreground)'}"
          ></iconify-icon>

          <!-- Active indicator dot -->
          {#if page.route.id === item.id}
            <div
              class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"
            ></div>
          {/if}
        </div>

        <!-- Label -->
        <span
          class="text-xs font-medium transition-colors duration-200 truncate"
          class:text-green-500={page.route.id === item.id}
          class:text-gray-400={page.route.id !== item.id}
        >
          {item.label}
        </span>

        <!-- Active background glow -->
        <!-- {#if page.route.id === item.id}
          <div class="absolute inset-0 bg-green-50 rounded-xl -z-10 scale-110 opacity-50"></div>
        {/if} -->
      </a>
    {/each}
  </div>

  <!-- Safe area padding for iOS devices -->
  <div class="h-safe-area-inset-bottom md:hidden"></div>
</nav>

<style>
  .active {
    transform: translateY(-2px);
  }

  /* Safe area support for iOS */
  .h-safe-area-inset-bottom {
    height: env(safe-area-inset-bottom);
  }

  /* Smooth transitions */
  button {
    -webkit-tap-highlight-color: transparent;
  }

  /* Hover effects for desktop */
  @media (hover: hover) {
    button:hover:not(.active) {
      transform: translateY(-1px);
    }
  }
</style>
