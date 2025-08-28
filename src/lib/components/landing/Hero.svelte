<script>
  import { animateOnScroll } from "$lib/actions/animateOnScroll";

  function signInWithGoogle() {
    console.log("Signing in with Google...");
  }
</script>

<section
  class="relative container mx-auto px-4 md:px-6 py-24 md:py-32 text-center overflow-hidden"
>
  <!-- Decorative background glows -->
  <div
    class="absolute -top-20 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"
  ></div>
  <div
    class="absolute -bottom-20 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse animation-delay-400"
  ></div>

  <div class="relative z-10" use:animateOnScroll>
    <h1
      class="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent"
    >
      Amplify Your Reach.
      <br />
      <span
        class="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent"
      >
        Monetize Your Influence.
      </span>
    </h1>
    <p class="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-neutral-300">
      The ultimate platform connecting creators who need engagement with users
      who want to earn. Real tasks, real rewards, real growth.
    </p>
    <div class="mt-10">
      <button
        on:click={signInWithGoogle}
        class="flex w-fit mx-auto items-center gap-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-green-500/20"
      >
        <iconify-icon icon="flat-color-icons:google" class="text-2xl" />
        <span>Get Started for Free</span>
      </button>
    </div>
  </div>
</section>
