<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import LocaleSwitcher from './LocaleSwitcher.vue';
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
