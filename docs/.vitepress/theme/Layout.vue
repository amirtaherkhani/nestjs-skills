<script setup lang="ts">
import { watchEffect } from 'vue';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import LocaleSwitcher from './LocaleSwitcher.vue';
import { syncDocumentLocale } from './sync-document-locale.mjs';

const { lang, dir } = useData();

if (typeof document !== 'undefined') {
  watchEffect(() => {
    syncDocumentLocale(document.documentElement, { lang: lang.value, dir: dir.value });
  });
}
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-before>
      <LocaleSwitcher class="locale-switcher-desktop" />
    </template>
    <template #nav-screen-content-before>
      <LocaleSwitcher class="locale-switcher-mobile" />
    </template>
  </DefaultTheme.Layout>
</template>
