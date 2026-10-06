<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';

const { localeIndex, page } = useData();
const pairedRoutes: Record<string, string> = {
  'index.md': '/fa/',
  'fa/index.md': '/',
  'guide/getting-started.md': '/fa/guide/getting-started',
  'fa/guide/getting-started.md': '/guide/getting-started'
};

const targetRoute = computed(() => pairedRoutes[page.value.relativePath] ?? (localeIndex.value === 'root' ? '/fa/' : '/'));
const targetLanguage = computed(() => localeIndex.value === 'root' ? 'فارسی' : 'English');
const accessibleLabel = computed(() => localeIndex.value === 'root' ? 'Switch to Persian documentation' : 'Switch to English documentation');
</script>

<template>
  <a class="locale-switcher" :href="withBase(targetRoute)" :aria-label="accessibleLabel">
    <span aria-hidden="true">文</span>
    <span>{{ targetLanguage }}</span>
  </a>
</template>
