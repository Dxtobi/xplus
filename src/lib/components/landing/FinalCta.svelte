<script>
  import { animateOnScroll } from "$lib/actions/animateOnScroll";

  function signInWithGoogle() {
    window.location.href = "/auth/google";
  }
</script>

<section class="py-20 md:py-28" use:animateOnScroll>
  <div class="container mx-auto px-4 md:px-6 text-center">
    <h2 class="text-3xl md:text-4xl font-bold text-white">
      Ready to Get Started?
    </h2>
    <p class="text-neutral-400 mt-2">
      Join thousands of creators and earners today.
    </p>
    <div class="mt-8">
      <button
        on:click={signInWithGoogle}
        class="flex w-fit mx-auto items-center gap-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300"
      >
        <iconify-icon icon="flat-color-icons:google" class="text-2xl" />
        <span>Sign Up Free</span>
      </button>
    </div>
  </div>
</section>
