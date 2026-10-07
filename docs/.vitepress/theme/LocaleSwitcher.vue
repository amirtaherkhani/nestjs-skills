<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useData, withBase } from 'vitepress';
import { installLocaleSwitcherDismiss } from './locale-switcher-dismiss.mjs';

const { localeIndex, page } = useData();
const languages = [
  { key: 'root', label: 'English' },
  { key: 'fa', label: 'فارسی' },
  { key: 'fr', label: 'Français' },
  { key: 'zh-CN', label: '简体中文' },
  { key: 'ja', label: '日本語' }
];
const landingRoutes: Record<string, string> = {
  root: '/',
  fa: '/fa/',
  fr: '/fr/',
  'zh-CN': '/zh-CN/',
  ja: '/ja/'
};
const pageRoutes: Record<string, Record<string, string>> = {
  'index.md': landingRoutes,
  'fa/index.md': landingRoutes,
  'fr/index.md': landingRoutes,
  'zh-CN/index.md': landingRoutes,
  'ja/index.md': landingRoutes,
  'guide/getting-started.md': {
    root: '/guide/getting-started', fa: '/fa/guide/getting-started', fr: '/fr/guide/getting-started',
    'zh-CN': '/zh-CN/guide/getting-started', ja: '/ja/guide/getting-started'
  },
  'fa/guide/getting-started.md': {
    root: '/guide/getting-started', fa: '/fa/guide/getting-started', fr: '/fr/guide/getting-started',
    'zh-CN': '/zh-CN/guide/getting-started', ja: '/ja/guide/getting-started'
  },
  'fr/guide/getting-started.md': {
    root: '/guide/getting-started', fa: '/fa/guide/getting-started', fr: '/fr/guide/getting-started',
    'zh-CN': '/zh-CN/guide/getting-started', ja: '/ja/guide/getting-started'
  },
  'zh-CN/guide/getting-started.md': {
    root: '/guide/getting-started', fa: '/fa/guide/getting-started', fr: '/fr/guide/getting-started',
    'zh-CN': '/zh-CN/guide/getting-started', ja: '/ja/guide/getting-started'
  },
  'ja/guide/getting-started.md': {
    root: '/guide/getting-started', fa: '/fa/guide/getting-started', fr: '/fr/guide/getting-started',
    'zh-CN': '/zh-CN/guide/getting-started', ja: '/ja/guide/getting-started'
  },
  'guide/publications.md': {
    root: '/guide/publications', fa: '/fa/guide/publications', fr: '/fr/guide/publications',
    'zh-CN': '/zh-CN/guide/publications', ja: '/ja/guide/publications'
  },
  'fa/guide/publications.md': {
    root: '/guide/publications', fa: '/fa/guide/publications', fr: '/fr/guide/publications',
    'zh-CN': '/zh-CN/guide/publications', ja: '/ja/guide/publications'
  },
  'fr/guide/publications.md': {
    root: '/guide/publications', fa: '/fa/guide/publications', fr: '/fr/guide/publications',
    'zh-CN': '/zh-CN/guide/publications', ja: '/ja/guide/publications'
  },
  'zh-CN/guide/publications.md': {
    root: '/guide/publications', fa: '/fa/guide/publications', fr: '/fr/guide/publications',
    'zh-CN': '/zh-CN/guide/publications', ja: '/ja/guide/publications'
  },
  'ja/guide/publications.md': {
    root: '/guide/publications', fa: '/fa/guide/publications', fr: '/fr/guide/publications',
    'zh-CN': '/zh-CN/guide/publications', ja: '/ja/guide/publications'
  }
};
const languageNames: Record<string, string> = Object.fromEntries(languages.map(({ key, label }) => [key, label]));
const menuLabels: Record<string, string> = {
  root: 'Select language',
  fa: 'انتخاب زبان',
  fr: 'Choisir la langue',
  'zh-CN': '选择语言',
  ja: '言語を選択'
};
const links = computed(() => {
  const pathMap = pageRoutes[page.value.relativePath] ?? landingRoutes;
  return languages.map((language) => ({
    ...language,
    href: withBase(pathMap[language.key] ?? landingRoutes[language.key]),
    current: language.key === localeIndex.value
  }));
});
const currentLanguage = computed(() => languageNames[localeIndex.value] ?? 'English');
const accessibleLabel = computed(() => `${menuLabels[localeIndex.value] ?? menuLabels.root}: ${currentLanguage.value}`);
const root = ref<HTMLElement>();
let removeDismissListeners: (() => void) | undefined;

function syncDismissListeners(open: boolean) {
  removeDismissListeners?.();
  removeDismissListeners = undefined;
  if (open && root.value && typeof document !== 'undefined') {
    removeDismissListeners = installLocaleSwitcherDismiss(root.value, document);
  }
}

watch(links, () => {
  if (root.value?.open) root.value.open = false;
});
onBeforeUnmount(() => syncDismissListeners(false));
</script>

<template>
  <details ref="root" class="locale-switcher" @toggle="syncDismissListeners(($event.currentTarget as HTMLDetailsElement).open)">
    <summary :aria-label="accessibleLabel" :title="accessibleLabel">
      <span aria-hidden="true">文</span>
      <span>{{ currentLanguage }}</span>
      <span class="locale-switcher-chevron" aria-hidden="true">⌄</span>
    </summary>
    <div class="locale-switcher-options">
      <a
        v-for="language in links"
        :key="language.key"
        class="locale-switcher-option"
        :href="language.href"
        :aria-current="language.current ? 'page' : undefined"
      >{{ language.label }}</a>
    </div>
  </details>
</template>
