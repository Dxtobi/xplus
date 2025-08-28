<script>
  import "../app.css";
  import { page } from "$app/state";
  import { goto, invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import "iconify-icon";
  import { Toaster } from "svelte-sonner";
  import { slide } from "svelte/transition";
  import { quintIn, quintOut } from "svelte/easing";
  import NavigationFooter from "$lib/components/Navs/Bottommenu.svelte";
  import Header from "$lib/components/landing/Header.svelte";

  let activeTab = $state("/");
  function handleNavigation(tabId) {
    activeTab = tabId;
  }

  let { children } = $props();
  let user = $derived(page.data.user);
  async function handleLogout() {
    showMenu = !showMenu;
    const response = await fetch("/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      goto("/login");
    }

    // $inspect(response.json())
  }

  onMount(async () => {
    invalidateAll();

    //  await handleLogout()
  });

  let showMenu = $state(false);
</script>

<Toaster richColors />
<div class="min-h-screen bg-neutral-900 text-neutral-100 py-15">
  {#if user}
    <nav
      class=" bg-green-600/50 backdrop: shadow text-neutral-50 fixed left-0 top-0 w-full backdrop-blur-3xl z-20"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <a href={user ? "/campaigns" : "/"} class="text-xl font-bold">
              <img src="/logowhite.svg" alt="logo" class="w-8" />
            </a>
          </div>

          <!-- Mobile menu button -->
          <div class="flex md:hidden">
            <button
              class="inline-flex items-center flex-col gap-2 justify-center p-2 rounded-md text-gray-50 hover:text-gray-100 hover:bg-gray-100 focus:outline-none"
              aria-label="Open main menu"
              onclick={() => (showMenu = !showMenu)}
            >
              <span
                class={`transition-all w-8 h-[3px] rounded-3xl bg-white ${showMenu ? " rotate-40 translate-y-[10px]" : ""}`}
              ></span>
              <span
                class={`transition-all w-8 h-[3px] rounded-3xl bg-white ${showMenu ? "opacity-0" : ""}`}
              ></span>
              <span
                class={`transition-all w-8 h-[3px] rounded-3xl bg-white ${showMenu ? "-rotate-40 -translate-y-[10px]" : ""}`}
              ></span>
            </button>
          </div>

          <!-- Desktop menu -->
          <div class="hidden md:flex items-center space-x-4">
            {#if user}
              <div class="flex items-center space-x-2">
                {#if user.avatar}
                  <img
                    src={user.avatar}
                    alt={user.username}
                    class="w-8 h-8 rounded-full"
                  />
                {/if}
                <span class="text-sm font-medium text-gray-100"
                  >{user.username}</span
                >
              </div>

              <a href="/campaigns">Campaigns</a>
              <a href="/profile">Profile</a>
              <button
                onclick={handleLogout}
                class="text-sm text-gray-200 hover:text-gray-600"
              >
                Logout
              </button>
            {:else}
              <a
                href="/login"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Sign In
              </a>
            {/if}
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      {#if showMenu}
        <div
          class="md:hidden px-4 pb-4"
          transition:slide={{ duration: 400, easing: quintOut, y: "100%" }}
          role="dialog"
          aria-modal="true"
        >
          <div class="flex flex-col space-y-2 justify-around min-h-[50vh]">
            {#if user}
              <div class="flex flex-col items-start space-x-2">
                {#if user.avatar}
                  <img
                    src={user.avatar}
                    alt={user.username}
                    class="w-8 h-8 rounded-full"
                  />
                {/if}
                <span class="text-xl font-medium text-gray-100 capitalize"
                  >@{user.username}</span
                >
              </div>

              <a
                href="/campaigns"
                onclick={() => (showMenu = !showMenu)}
                class="text-xl">Campaigns</a
              >
              <a
                href="/profile"
                onclick={() => (showMenu = !showMenu)}
                class="text-xl">Profile</a
              >
              <button
                onclick={handleLogout}
                class="text-xl text-gray-100 hover:text-gray-400 text-left"
              >
                Logout
              </button>
            {:else}
              <a
                onclick={() => (showMenu = !showMenu)}
                href="/login"
                class="inline-flex items-center px-4 py-2 border border-transparent text-xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Sign In
              </a>
            {/if}
          </div>
        </div>
      {/if}
    </nav>
  {:else}
    <Header />
  {/if}

  <main class=" md:p-10 p-4">
    {@render children()}
  </main>
</div>
<NavigationFooter {activeTab} onNavigate={handleNavigation} />
