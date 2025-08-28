<script>
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { api } from "$lib/services/ApiService.svelte";
  import { actionTypes, platforms } from "$lib/utils/constants"; // Make sure these have the new icon/color data
  import { toast } from "svelte-sonner";

  const { closeForm } = $props();

  // Correctly access user data from the page store in SvelteKit
  const user = $derived($page.data.user);

  let newPost = $state({
    title: "",
    link: "",
    platform: "Other",
    targetAmount: 500, // Renamed for clarity
    actionType: "clicks",
    description: "",
  });

  // Reactive calculation for the cost
  let cost = $state(0);

  $effect(() => {
    // console.log($page.data.user.balance)
    updateCost();
  });

  const updateCost = () => {
    const action = actionTypes.find((a) => a.value === newPost.actionType);
    const costPerAction = action ? action.cost : 0;
    cost = (newPost.targetAmount || 0) * costPerAction;
  };

  // Auto-detect platform based on URL
  function detectPlatform(url) {
    if (!url || !url.startsWith("http")) return "Other";
    try {
      const domain = new URL(url).hostname.toLowerCase();
      const platform = platforms.find(
        (p) => p.domain && domain.includes(p.domain)
      );
      return platform ? platform.name : "Website";
    } catch {
      return "Other";
    }
  }

  // Handle link input change
  function handleLinkChange() {
    newPost.platform = detectPlatform(newPost.link);
  }

  // Create new campaign
  async function createCampaign(e) {
    e.preventDefault();

    if (!newPost.title || !newPost.link) return;

    if (user.balance < cost) {
      alert("Insufficient balance! Please deposit more funds.");
      return;
    }

    const campaignData = {
      ...newPost,
      cost: cost,
      platform: newPost.platform || detectPlatform(newPost.link),
    };

    const { data, error } = await api.createCampaign(campaignData);
    if (error) {
      console.error("Failed to create campaign:", error);
      toast.error(
        "There was an error creating your campaign. Please try again."
      );
    } else {
      console.log("Campaign created successfully:", data);
      await invalidateAll();
      // Reset form state
      newPost = {
        title: "",
        link: "",
        platform: "Other",
        targetAmount: 500,
        actionType: "clicks",
        description: "",
      };
      closeForm();
    }
  }
</script>

<div class="max-w-2xl mx-auto text-neutral-200">
  <div
    class="bg-neutral-800/50 backdrop-blur-sm rounded-2xl md:p-8 p-4 relative overflow-hidden border border-neutral-700"
  >
    <!-- Decorative background elements -->
    <div
      class="absolute -top-16 -right-16 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"
    ></div>
    <div
      class="absolute -bottom-16 -left-16 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"
    ></div>

    <div class="relative z-10">
      <div class="flex items-start justify-between mb-8">
        <div class="flex items-center gap-4">
          <div
            class="p-3 bg-gradient-to-br from-green-600 to-teal-500 rounded-xl shadow-lg flex justify-center items-center"
          >
            <iconify-icon
              icon="solar:target-bold"
              class="text-white"
              width="28"
              height="28"
            />
          </div>
          <div>
            <h2
              class="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent"
            >
              New Campaign
            </h2>
            <p class="text-sm text-neutral-400">
              Launch your content to reach a wider audience.
            </p>
          </div>
        </div>
        <button
          onclick={closeForm}
          class="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-full transition-all duration-200"
        >
          <iconify-icon icon="solar:close-circle-bold" width="28" height="28" />
        </button>
      </div>

      <form onsubmit={createCampaign} class="space-y-6">
        <!-- Campaign Title -->
        <div class="space-y-2">
          <label
            class="flex items-center gap-2 text-sm font-semibold text-neutral-300"
          >
            <iconify-icon
              icon="solar:document-text-bold"
              class="text-green-500"
            />
            Campaign Title
          </label>
          <input
            type="text"
            bind:value={newPost.title}
            placeholder="e.g., Check out my new video!"
            class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            required
            name="title"
          />
        </div>

        <!-- Link URL -->
        <div class="space-y-2">
          <label
            class="flex items-center gap-2 text-sm font-semibold text-neutral-300"
          >
            <iconify-icon icon="solar:link-bold" class="text-green-500" />
            Link URL
          </label>
          <input
            type="url"
            bind:value={newPost.link}
            oninput={handleLinkChange}
            placeholder="https://youtube.com/your-content"
            class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            required
            name="link"
          />
        </div>

        <!-- Platform Selection -->
        <div class="space-y-3">
          <label
            class="flex items-center gap-2 text-sm font-semibold text-neutral-300"
          >
            <iconify-icon icon="solar:global-bold" class="text-green-500" />
            Platform
          </label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
            {#each platforms as platform}
              <button
                type="button"
                onclick={() => (newPost.platform = platform.name)}
                class="flex flex-col items-center justify-center gap-2 p-3 rounded-lg text-sm transition-all duration-200 border-2"
                class:border-green-500={newPost.platform === platform.name}
                class:bg-green-700={newPost.platform === platform.name}
                class:border-neutral-700={newPost.platform !== platform.name}
                class:hover:border-neutral-600={newPost.platform !==
                  platform.name}
                style="color: {platform.color};"
              >
                <iconify-icon icon={platform.icon} width="24" height="24" />
                <span class="font-medium text-neutral-200">{platform.name}</span
                >
              </button>
            {/each}
          </div>
        </div>

        <!-- Action Type Selection -->
        <div class="space-y-3">
          <label
            class="flex items-center gap-2 text-sm font-semibold text-neutral-300"
          >
            <iconify-icon icon="solar:bolt-bold" class="text-green-500" />
            Action Type
          </label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            {#each actionTypes as action}
              <button
                type="button"
                onclick={() => (newPost.actionType = action.value)}
                class="flex items-center justify-center gap-2 p-3 rounded-lg text-sm transition-all duration-200 border-2"
                class:border-green-500={newPost.actionType === action.value}
                class:bg-green-600={newPost.actionType === action.value}
                class:border-neutral-700={newPost.actionType !== action.value}
                class:hover:border-neutral-600={newPost.actionType !==
                  action.value}
              >
                <iconify-icon
                  icon={action.icon}
                  width="20"
                  height="20"
                  style="color: {action.color};"
                />
                <span class="font-medium text-neutral-200">{action.label}</span>
              </button>
            {/each}
          </div>
        </div>

        <!-- Target Amount & Cost -->
        <div class="space-y-2">
          <label
            for="targetAmount"
            class="flex items-center gap-2 text-sm font-semibold text-neutral-300"
          >
            <iconify-icon
              icon={actionTypes.find((a) => a.value === newPost.actionType)
                ?.icon || "solar:cursor-bold"}
              class="text-green-500"
            />
            Target {actionTypes.find((a) => a.value === newPost.actionType)
              ?.label || "Clicks"}
          </label>
          <input
            id="targetAmount"
            type="number"
            bind:value={newPost.targetAmount}
            min="9"
            step="1"
            class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            required
            name="amount"
            onblur={() => {
              if (newPost.targetAmount < 9) newPost.targetAmount = 9;
            }}
            oninput={() => {
              if (newPost.targetAmount < 9) newPost.targetAmount = 9;
              updateCost();
            }}
            onchange={() => {
              if (newPost.targetAmount < 9) newPost.targetAmount = 9;
              updateCost();
            }}
          />

          <div
            class="mt-4 p-4 bg-neutral-800 border border-neutral-700 rounded-xl"
          >
            <div class="flex justify-between items-center mb-2">
              <div class="flex items-center gap-2">
                <iconify-icon
                  icon="solar:wallet-money-bold-duotone"
                  class="text-green-400"
                />
                <span class="text-sm font-medium text-neutral-300"
                  >Estimated Cost:</span
                >
              </div>
              <span class="font-bold text-lg text-green-400"
                >₦{cost.toLocaleString()}</span
              >
            </div>
            <div
              class="flex items-center justify-between text-xs text-neutral-400"
            >
              <span
                >Rate: ₦{actionTypes.find((a) => a.value === newPost.actionType)
                  ?.cost || 0} per {newPost.actionType.slice(0, -1)}</span
              >
              <span
                >{newPost.targetAmount.toLocaleString()} × ₦{actionTypes.find(
                  (a) => a.value === newPost.actionType
                )?.cost || 0}</span
              >
            </div>
          </div>
        </div>

        <!-- Footer Section -->
        <div
          class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-700"
        >
          <div
            class="flex items-center gap-2 text-sm text-neutral-300 bg-neutral-800 px-4 py-2 rounded-lg border border-neutral-700"
          >
            <iconify-icon icon="solar:wallet-bold" class="text-green-500" />
            <span
              >Balance: <span class="font-semibold text-green-400"
                >₦{user?.balance?.toLocaleString() || 0}</span
              ></span
            >
          </div>

          <button
            type="submit"
            disabled={cost > user.balance}
            class="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-teal-600 transition-all duration-200 disabled:from-neutral-600 disabled:to-neutral-700 disabled:cursor-not-allowed disabled:text-neutral-400 shadow-lg hover:shadow-green-500/20 transform hover:scale-105 disabled:transform-none"
          >
            {#if cost > user.balance}
              <iconify-icon
                icon="solar:card-2-bold-duotone"
                width="20"
                height="20"
              />
              <span>Insufficient Balance</span>
            {:else}
              <iconify-icon
                icon="solar:rocket-2-bold-duotone"
                width="20"
                height="20"
              />
              <span>Launch Campaign</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  /* Dark theme scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #262626; /* neutral-800 */
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #525252; /* neutral-600 */
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #737373; /* neutral-500 */
  }
</style>
