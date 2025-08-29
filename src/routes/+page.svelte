<script>
  import Header from "$lib/components/landing/Header.svelte";
  import Hero from "$lib/components/landing/Hero.svelte";
  import HowItWorks from "$lib/components/landing/HowItWorks.svelte";
  import Features from "$lib/components/landing/Features.svelte";
  import AppShowcase from "$lib/components/landing/AppShowcase.svelte";
  import FinalCta from "$lib/components/landing/FinalCta.svelte";
  import Footer from "$lib/components/landing/Footer.svelte";
</script>

<div class="bg-neutral-900 text-white">
  <main>
    <Hero />
    <HowItWorks />
    <Features />
    <!-- <AppShowcase /> -->
    <FinalCta />
  </main>
  <Footer />
</div>
