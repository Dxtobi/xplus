<script>
  // This would trigger your Google Auth flow
  function signInWithGoogle() {
    // window.location.href = '/auth/google';
    window.location.href = "/auth/google";
  }
</script>

<header
  class="fixed w-full top-[-1px] z-50 bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-800"
>
  <nav
    class="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center"
  >
    <a
      href="/"
      class="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent"
    >
      <img src="logowhite.svg" alt="" class="w-20" />
    </a>
    <div class="hidden md:flex items-center gap-6 text-neutral-300 font-medium">
      <a href="#features" class="hover:text-green-400 transition-colors"
        >Features</a
      >
      <a href="#how-it-works" class="hover:text-green-400 transition-colors"
        >How It Works</a
      >
    </div>
    <button
      on:click={signInWithGoogle}
      class="flex items-center gap-2 bg-white text-neutral-800 font-semibold px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors transform hover:scale-105"
    >
      <iconify-icon icon="flat-color-icons:google" />
      <span>Sign In</span>
    </button>
  </nav>
</header>
