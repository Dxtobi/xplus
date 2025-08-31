<script>
  import { page } from "$app/stores";

  const {
    title = "XPlus+", // The main title of the page
    description = `The ultimate platform connecting creators who need engagement with users
      who want to earn. Real tasks, real rewards, real growth real content engagement from real users not bots`, // A brief description of the page content
    image = "/logo.png", // The URL of the image for social sharing (og:image, twitter:image)
    noIndex = true, // If true, tells search engines not to index this page
    canonical = "https://xplus-rosy.vercel.app/", // The canonical URL for the page
    siteName = "DXtech", // Your site's name, can be overridden
    ogType = "website", // Open Graph type (e.g., 'article', 'website')
    twitterCard = "summary_large_image", // Twitter card type
    twitterSite = "@xplusgigs", // Your site's Twitter handle
    jsonLd = null, // A JavaScript object for structured data
  } = $props();

  // Reactive state to build the final URLs and titles
  const siteUrl = $derived($page.url.origin);
  const finalUrl = $derived(canonical || `${siteUrl}${$page.url.pathname}`);
  const finalImage = $derived(
    image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : ""
  );
  const finalTitle = $derived(title ? `${title} | ${siteName}` : siteName);

  // Safely stringify the JSON-LD object for injection
  const jsonLdString = $derived(() => {
    if (!jsonLd) return null;
    try {
      return JSON.stringify(jsonLd, null, 2);
    } catch (e) {
      console.error("Failed to stringify JSON-LD data:", e);
      return null;
    }
  });
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>{finalTitle}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
  {#if noIndex}
    <meta name="robots" content="noindex, nofollow" />
  {:else}
    <meta name="robots" content="index, follow" />
  {/if}
  <link rel="canonical" href={finalUrl} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={ogType} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:url" content={finalUrl} />
  <meta property="og:title" content={finalTitle} />
  {#if description}
    <meta property="og:description" content={description} />
  {/if}
  {#if finalImage}
    <meta property="og:image" content={finalImage} />
  {/if}

  <!-- Twitter -->
  <meta name="twitter:card" content={twitterCard} />
  {#if twitterSite}
    <meta name="twitter:site" content={twitterSite} />
  {/if}
  <meta name="twitter:url" content={finalUrl} />
  <meta name="twitter:title" content={finalTitle} />
  {#if description}
    <meta name="twitter:description" content={description} />
  {/if}
  {#if finalImage}
    <meta name="twitter:image" content={finalImage} />
  {/if}

  <!-- JSON-LD Structured Data -->
  {#if jsonLdString}
    <script type="application/ld+json">
			{@html jsonLdString}
    </script>
  {/if}
</svelte:head>
