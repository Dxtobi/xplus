<script>
  import { animateOnScroll } from "$lib/actions/animateOnScroll";
</script>

<footer class="bg-neutral-800/50 border-t border-neutral-800">
  <div class="container mx-auto px-4 md:px-6 py-8">
    <div class="flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="text-center md:text-left">
        <a
          href="/"
          class="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent"
        >
          Xplus
        </a>
        <p class="text-neutral-400 text-sm mt-1">
          © {new Date().getFullYear()} Xplus. All rights reserved.
        </p>
      </div>
      <div class="flex items-center gap-4 text-2xl text-neutral-400">
        <a href="#" class="hover:text-green-400 transition-colors"
          ><iconify-icon icon="mdi:twitter" /></a
        >
        <a href="#" class="hover:text-green-400 transition-colors"
          ><iconify-icon icon="mdi:instagram" /></a
        >
        <a href="#" class="hover:text-green-400 transition-colors"
          ><iconify-icon icon="mdi:linkedin" /></a
        >
      </div>
    </div>
  </div>
</footer>
