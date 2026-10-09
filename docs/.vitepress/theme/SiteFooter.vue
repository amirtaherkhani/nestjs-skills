<script setup lang="ts">
import { useData } from 'vitepress';
import { useSidebar } from 'vitepress/theme';

const { theme, frontmatter } = useData();
const { hasSidebar } = useSidebar();

// Font Awesome Free 7.3.1 by @fontawesome — https://fontawesome.com
// Icons: CC BY 4.0 — https://fontawesome.com/license/free
// Copyright 2026 Fonticons, Inc. Paths are unchanged from the brand icons.
const socialLinks = [
  {
    name: 'Hashnode',
    href: 'https://nestjs-skills.hashnode.dev',
    viewBox: '0 0 512 512',
    path: 'M35.7 171.1c-46.9 46-46.9 122.9 0 169.8L171.6 476.8c46 46.9 122.9 46.9 169.8 0L477.3 340.9c46.9-46.9 46.9-123.8 0-169.8L341.4 35.2c-46.9-46.9-123.8-46.9-169.8 0L35.7 171.1zM196 196.5a84.5 84.5 0 1 1 120 119 84.5 84.5 0 1 1 -120-119z'
  },
  {
    name: 'DEV',
    href: 'https://dev.to/amirtaherkhani',
    viewBox: '0 0 448 512',
    path: 'M120.1 208.3c-3.9-2.9-7.8-4.3-11.6-4.3l-17.4 0 0 104.5 17.4 0c3.9 0 7.8-1.4 11.6-4.3s5.8-7.3 5.8-13.1l0-69.7c0-5.8-2-10.2-5.8-13.1zM404.1 32L43.9 32C19.7 32 .1 51.6 0 75.8L0 436.2C.1 460.4 19.7 480 43.9 480l360.2 0c24.2 0 43.8-19.6 43.9-43.8l0-360.4C447.9 51.6 428.3 32 404.1 32zM154.2 291.2c0 18.8-11.6 47.3-48.4 47.3l-46.4 0 0-165.5 47.4 0c35.4 0 47.4 28.5 47.4 47.3l0 70.9zm100.7-88.7l-53.3 0 0 38.4 32.6 0 0 29.6-32.6 0 0 38.4 53.3 0 0 29.6-62.2 0c-11.2 .3-20.4-8.5-20.7-19.7l0-125.1c-.3-11.1 8.6-20.4 19.7-20.7l63.2 0 0 29.5zM358.5 317.8c-13.2 30.7-36.8 24.6-47.4 0l-38.5-144.8 32.6 0 29.7 113.7 29.6-113.7 32.6 0-38.5 144.8z'
  },
  {
    name: 'X',
    href: 'https://x.com/amirmo_th',
    viewBox: '0 0 448 512',
    path: 'M357.2 48L427.8 48 273.6 224.2 455 464 313 464 201.7 318.6 74.5 464 3.8 464 168.7 275.5-5.2 48 140.4 48 240.9 180.9 357.2 48zM332.4 421.8l39.1 0-252.4-333.8-42 0 255.3 333.8z'
  }
];
</script>

<template>
  <footer
    v-if="theme.footer && frontmatter.footer !== false"
    class="site-footer"
    :class="{ 'has-sidebar': hasSidebar }"
  >
    <ul class="social-links">
      <li v-for="social in socialLinks" :key="social.name">
        <a
          :href="social.href"
          :aria-label="social.name"
          :title="social.name"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg :viewBox="social.viewBox" aria-hidden="true" focusable="false">
            <path fill="currentColor" :d="social.path" />
          </svg>
        </a>
      </li>
    </ul>
    <p v-if="theme.footer.message">{{ theme.footer.message }}</p>
    <p v-if="theme.footer.copyright">{{ theme.footer.copyright }}</p>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding: 28px 24px 32px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
}

.social-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
}

.social-links a {
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  transition: color 160ms ease, border-color 160ms ease, background-color 160ms ease;
}

.social-links a:hover,
.social-links a:focus-visible {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.social-links a:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.social-links svg {
  width: 20px;
  height: 20px;
}

/* Follow VitePress's sidebar position, including in RTL document layouts. */
@media (min-width: 960px) {
  .site-footer.has-sidebar {
    margin-left: var(--vp-sidebar-width);
  }
}

@media (min-width: 1440px) {
  .site-footer.has-sidebar {
    margin-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
    padding-right: calc((100vw - var(--vp-layout-max-width)) / 2 + 24px);
  }
}
</style>
