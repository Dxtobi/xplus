<script>
  import { animateOnScroll } from "$lib/actions/animateOnScroll";
</script>

<section id="features" class="py-20 md:py-28" use:animateOnScroll>
  <div class="container mx-auto px-4 md:px-6">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-white">
        Why Choose XPlus?
      </h2>
      <p class="text-neutral-400 mt-2">
        The tools you need for growth and earnings, all in one place.
      </p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Feature Card -->
      <div class="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
        <iconify-icon
          icon="solar:rocket-2-bold-duotone"
          class="text-3xl text-green-400 mb-4"
        />
        <h3 class="text-xl font-semibold mb-2">Instant Engagement</h3>
        <p class="text-neutral-400">
          Your campaigns go live instantly to a community ready to engage,
          ensuring rapid results.
        </p>
      </div>
      <!-- Feature Card -->
      <div class="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
        <iconify-icon
          icon="solar:shield-check-bold-duotone"
          class="text-3xl text-green-400 mb-4"
        />
        <h3 class="text-xl font-semibold mb-2">Secure Wallet & Payouts</h3>
        <p class="text-neutral-400">
          Powered by Paystack, your funds are secure, and withdrawals are fast
          and reliable.
        </p>
      </div>
      <!-- Feature Card -->
      <div class="bg-neutral-800/50 p-6 rounded-xl border border-neutral-700">
        <iconify-icon
          icon="solar:chart-square-bold-duotone"
          class="text-3xl text-green-400 mb-4"
        />
        <h3 class="text-xl font-semibold mb-2">Transparent Analytics</h3>
        <p class="text-neutral-400">
          Track every click, follow, and view in real-time with our beautiful
          and intuitive dashboard.
        </p>
      </div>
      <!-- Add more feature cards as needed -->
    </div>
  </div>
</section>
