import { defineConfig } from 'vitepress';

const github = 'https://github.com/amirtaherkhani/nestjs-skills';
const siteUrl = 'https://amirtaherkhani.github.io/nestjs-skills';
const englishDescription = 'NestJS Skills offers seven open-source Agent Skills for Claude Code and Codex, covering NestJS engineering, architecture, code audits, performance, and delivery.';
const persianDescription = 'راهنمای فارسی برای نصب و شروع استفاده از NestJS Skills.';
const frenchDescription = 'Documentation en français pour installer et utiliser NestJS Skills avec Claude Code et Codex.';
const chineseDescription = 'NestJS Skills 中文指南：了解如何安装并使用 Claude Code 和 Codex 的 NestJS 技能。';
const japaneseDescription = 'Claude Code と Codex で NestJS Skills をインストールして使うための日本語ガイドです。';
const localeSeo = {
  root: { hreflang: 'en', lang: 'en-US', ogLocale: 'en_US', description: englishDescription, imageAlt: 'NestJS Skills red N and charcoal S logo.' },
  fa: { hreflang: 'fa', lang: 'fa-IR', ogLocale: 'fa_IR', description: persianDescription, imageAlt: 'نشان NestJS Skills برای توسعه و معماری نرم‌افزار.' },
  fr: { hreflang: 'fr', lang: 'fr-FR', ogLocale: 'fr_FR', description: frenchDescription, imageAlt: 'Logo NestJS Skills avec un N rouge et un S anthracite.' },
  'zh-CN': { hreflang: 'zh-CN', lang: 'zh-CN', ogLocale: 'zh_CN', description: chineseDescription, imageAlt: 'NestJS Skills 标志：红色 N 和深灰色 S。' },
  ja: { hreflang: 'ja', lang: 'ja-JP', ogLocale: 'ja_JP', description: japaneseDescription, imageAlt: '赤い N とチャコール色の S を使った NestJS Skills ロゴ。' }
} as const;
const pairedRoutes = [
  {
    routes: {
      root: '/',
      fa: '/fa/',
      fr: '/fr/',
      'zh-CN': '/zh-CN/',
      ja: '/ja/'
    }
  },
  {
    routes: {
      root: '/guide/getting-started',
      fa: '/fa/guide/getting-started',
      fr: '/fr/guide/getting-started',
      'zh-CN': '/zh-CN/guide/getting-started',
      ja: '/ja/guide/getting-started'
    }
  },
  {
    routes: {
      root: '/guide/publications',
      fa: '/fa/guide/publications',
      fr: '/fr/guide/publications',
      'zh-CN': '/zh-CN/guide/publications',
      ja: '/ja/guide/publications'
    }
  }
];

function localizedSearch(translations: {
  button: { buttonText: string; buttonAriaLabel: string };
  modal: {
    displayDetails: string;
    resetButtonTitle: string;
    backButtonTitle: string;
    noResultsText: string;
    footer: {
      selectText: string;
      selectKeyAriaLabel: string;
      navigateText: string;
      navigateUpKeyAriaLabel: string;
      navigateDownKeyAriaLabel: string;
      closeText: string;
      closeKeyAriaLabel: string;
    };
  };
}) {
  return {
    provider: 'local',
    options: {
      detailedView: true,
      miniSearch: {
        searchOptions: {
          boost: { title: 4, text: 2, titles: 1 }
        }
      },
      translations
    }
  };
}

function pageRoute(relativePath: string) {
  if (/(^|\/)index\.md$/.test(relativePath)) {
    const directory = relativePath.replace(/index\.md$/, '').replace(/\/$/, '');
    return directory ? `/${directory}/` : '/';
  }

  return `/${relativePath.replace(/\.md$/, '')}`;
}

function pageUrl(route: string) {
  return `${siteUrl}${route}`;
}

function normalizePath(path: string) {
  const pathname = new URL(path, `${siteUrl}/`).pathname.replace(/\/+$/, '');
  return pathname || '/';
}

const sitemapAlternates = new Map<string, { lang: string; url: string }[]>();

for (const { routes } of pairedRoutes) {
  const links = Object.entries(routes).map(([locale, route]) => ({
    lang: localeSeo[locale as keyof typeof localeSeo].hreflang,
    url: pageUrl(route)
  }));

  for (const route of Object.values(routes)) {
    sitemapAlternates.set(normalizePath(pageUrl(route)), links);
  }
}

export default defineConfig({
  title: 'NestJS Skills',
  description: englishDescription,
  lang: 'en-US',
  base: '/nestjs-skills/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: `${siteUrl}/`,
    transformItems(items) {
      return items.map((item) => {
        const links = sitemapAlternates.get(normalizePath(item.url));
        return links ? { ...item, links } : item;
      });
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', media: '(prefers-color-scheme: light)', href: '/nestjs-skills/brand/nestjs-skills-icon-light.svg' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)', href: '/nestjs-skills/brand/nestjs-skills-icon-dark.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', media: '(prefers-color-scheme: light)', href: '/nestjs-skills/brand/nestjs-skills-icon-light-32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', media: '(prefers-color-scheme: dark)', href: '/nestjs-skills/brand/nestjs-skills-icon-dark-32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', media: '(prefers-color-scheme: light)', href: '/nestjs-skills/brand/nestjs-skills-icon-light-180.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', media: '(prefers-color-scheme: dark)', href: '/nestjs-skills/brand/nestjs-skills-icon-dark-180.png' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#FCFBF9' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#111013' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://amirtaherkhani.github.io/nestjs-skills/brand/social-cover.png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://amirtaherkhani.github.io/nestjs-skills/brand/social-cover.png' }]
  ],
  locales: {
    root: {
      label: 'English',
      lang: localeSeo.root.lang
    },
    fa: {
      label: 'فارسی',
      lang: localeSeo.fa.lang,
      dir: 'rtl',
      title: 'NestJS Skills',
      titleTemplate: ':title',
      description: persianDescription,
      themeConfig: {
        langMenuLabel: 'تغییر زبان',
        sidebarMenuLabel: 'فهرست',
        darkModeSwitchLabel: 'حالت نمایش',
        lightModeSwitchTitle: 'تغییر به زمینهٔ روشن',
        darkModeSwitchTitle: 'تغییر به زمینهٔ تیره',
        search: localizedSearch({
              button: {
                buttonText: 'جستجو',
                buttonAriaLabel: 'جستجوی مستندات'
              },
              modal: {
                displayDetails: 'نمایش جزئیات',
                resetButtonTitle: 'پاک کردن جستجو',
                backButtonTitle: 'بازگشت',
                noResultsText: 'نتیجه‌ای برای',
                footer: {
                  selectText: 'انتخاب',
                  selectKeyAriaLabel: 'انتخاب نتیجه',
                  navigateText: 'پیمایش',
                  navigateUpKeyAriaLabel: 'نتیجهٔ قبلی',
                  navigateDownKeyAriaLabel: 'نتیجهٔ بعدی',
                  closeText: 'بستن',
                  closeKeyAriaLabel: 'بستن جستجو'
                }
              }
        }),
        nav: [
          { text: 'شروع کنید', link: '/fa/guide/getting-started', activeMatch: '/fa/guide/' },
          { text: 'مفاهیم', link: '/concepts/request-lifecycle' },
          { text: 'نصب', link: '/fa/guide/getting-started#نصب' }
        ],
        sidebar: [
          {
            text: 'راهنما',
            items: [
              { text: 'شروع به کار', link: '/fa/guide/getting-started' },
              { text: 'صفحهٔ اصلی', link: '/fa/' }
            ]
          }
        ],
        outline: {
          level: [2, 3],
          label: 'در این صفحه'
        },
        lastUpdated: {
          text: 'آخرین به‌روزرسانی',
          formatOptions: { dateStyle: 'medium' }
        },
        docFooter: {
          prev: 'قبلی',
          next: 'بعدی'
        },
        footer: {
          message: 'راهنمای متن‌باز برای مهندسی سنجیدهٔ NestJS.',
          copyright: 'منتشرشده تحت مجوز MIT.'
        },
        editLink: {
          pattern: `${github}/edit/main/docs/:path`,
          text: 'ویرایش این صفحه در گیت‌هاب'
        }
      }
    },
    fr: {
      label: 'Français',
      lang: localeSeo.fr.lang,
      title: 'NestJS Skills',
      titleTemplate: ':title',
      description: frenchDescription,
      themeConfig: {
        langMenuLabel: 'Choisir la langue',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Apparence',
        lightModeSwitchTitle: 'Passer au thème clair',
        darkModeSwitchTitle: 'Passer au thème sombre',
        search: localizedSearch({
          button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher dans la documentation' },
          modal: {
            displayDetails: 'Afficher les détails',
            resetButtonTitle: 'Effacer la recherche',
            backButtonTitle: 'Retour',
            noResultsText: 'Aucun résultat pour',
            footer: {
              selectText: 'sélectionner', selectKeyAriaLabel: 'sélectionner un résultat',
              navigateText: 'naviguer', navigateUpKeyAriaLabel: 'résultat précédent',
              navigateDownKeyAriaLabel: 'résultat suivant', closeText: 'fermer', closeKeyAriaLabel: 'fermer la recherche'
            }
          }
        }),
        nav: [
          { text: 'Guide', link: '/fr/guide/getting-started', activeMatch: '/fr/guide/' },
          { text: 'Concepts', link: '/concepts/request-lifecycle' },
          { text: 'Installer', link: '/fr/guide/getting-started#installation' }
        ],
        sidebar: [{ text: 'Guide', items: [{ text: 'Premiers pas', link: '/fr/guide/getting-started' }, { text: 'Accueil', link: '/fr/' }] }],
        outline: { level: [2, 3], label: 'Sur cette page' },
        lastUpdated: { text: 'Mis à jour', formatOptions: { dateStyle: 'medium' } },
        docFooter: { prev: 'Précédent', next: 'Suivant' },
        footer: { message: 'Conseils open source pour un développement NestJS réfléchi.', copyright: 'Publié sous licence MIT.' },
        editLink: { pattern: `${github}/edit/main/docs/:path`, text: 'Modifier cette page sur GitHub' }
      }
    },
    'zh-CN': {
      label: '简体中文',
      lang: localeSeo['zh-CN'].lang,
      title: 'NestJS Skills',
      titleTemplate: ':title',
      description: chineseDescription,
      themeConfig: {
        langMenuLabel: '选择语言',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色主题',
        darkModeSwitchTitle: '切换到深色主题',
        search: localizedSearch({
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除搜索',
            backButtonTitle: '返回',
            noResultsText: '未找到相关结果：',
            footer: {
              selectText: '选择', selectKeyAriaLabel: '选择结果',
              navigateText: '浏览', navigateUpKeyAriaLabel: '上一个结果',
              navigateDownKeyAriaLabel: '下一个结果', closeText: '关闭', closeKeyAriaLabel: '关闭搜索'
            }
          }
        }),
        nav: [
          { text: '指南', link: '/zh-CN/guide/getting-started', activeMatch: '/zh-CN/guide/' },
          { text: '概念', link: '/concepts/request-lifecycle' },
          { text: '安装', link: '/zh-CN/guide/getting-started#安装' }
        ],
        sidebar: [{ text: '指南', items: [{ text: '快速开始', link: '/zh-CN/guide/getting-started' }, { text: '首页', link: '/zh-CN/' }] }],
        outline: { level: [2, 3], label: '本页内容' },
        lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'medium' } },
        docFooter: { prev: '上一页', next: '下一页' },
        footer: { message: '为严谨的 NestJS 工程实践提供开源指南。', copyright: '采用 MIT 许可证发布。' },
        editLink: { pattern: `${github}/edit/main/docs/:path`, text: '在 GitHub 上编辑此页' }
      }
    },
    ja: {
      label: '日本語',
      lang: localeSeo.ja.lang,
      title: 'NestJS Skills',
      titleTemplate: ':title',
      description: japaneseDescription,
      themeConfig: {
        langMenuLabel: '言語を選択',
        sidebarMenuLabel: 'メニュー',
        darkModeSwitchLabel: '表示設定',
        lightModeSwitchTitle: 'ライトテーマに切り替え',
        darkModeSwitchTitle: 'ダークテーマに切り替え',
        search: localizedSearch({
          button: { buttonText: '検索', buttonAriaLabel: 'ドキュメントを検索' },
          modal: {
            displayDetails: '詳細を表示',
            resetButtonTitle: '検索をクリア',
            backButtonTitle: '戻る',
            noResultsText: '次の検索結果はありません：',
            footer: {
              selectText: '選択', selectKeyAriaLabel: '検索結果を選択',
              navigateText: '移動', navigateUpKeyAriaLabel: '前の結果',
              navigateDownKeyAriaLabel: '次の結果', closeText: '閉じる', closeKeyAriaLabel: '検索を閉じる'
            }
          }
        }),
        nav: [
          { text: 'ガイド', link: '/ja/guide/getting-started', activeMatch: '/ja/guide/' },
          { text: '概念', link: '/concepts/request-lifecycle' },
          { text: 'インストール', link: '/ja/guide/getting-started#インストール' }
        ],
        sidebar: [{ text: 'ガイド', items: [{ text: 'はじめに', link: '/ja/guide/getting-started' }, { text: 'ホーム', link: '/ja/' }] }],
        outline: { level: [2, 3], label: 'このページの内容' },
        lastUpdated: { text: '更新日', formatOptions: { dateStyle: 'medium' } },
        docFooter: { prev: '前へ', next: '次へ' },
        footer: { message: '丁寧な NestJS 開発のためのオープンソースガイド。', copyright: 'MIT ライセンスで公開しています。' },
        editLink: { pattern: `${github}/edit/main/docs/:path`, text: 'GitHub でこのページを編集' }
      }
    }
  },
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },
  transformPageData(pageData) {
    const relativePath = pageData.relativePath.replace(/\\/g, '/');
    if (relativePath === '404.md') return;

    const route = pageRoute(relativePath);
    const canonicalUrl = pageUrl(route);
    const localeKey = (Object.keys(localeSeo).filter((key) => key !== 'root').sort((left, right) => right.length - left.length).find((key) => relativePath.startsWith(`${key}/`)) ?? 'root') as keyof typeof localeSeo;
    const locale = localeSeo[localeKey];
    const title = pageData.frontmatter.title || pageData.title || 'NestJS Skills';
    const description = pageData.frontmatter.description ?? locale.description;
    const alternates = pairedRoutes.find(({ routes }) => Object.values(routes).includes(route));
    const head = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:locale', content: locale.ogLocale }],
      ['meta', { property: 'og:image:alt', content: locale.imageAlt }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image:alt', content: locale.imageAlt }]
    ];

    if (alternates) {
      for (const [alternateLocale, alternateRoute] of Object.entries(alternates.routes)) {
        const lang = localeSeo[alternateLocale as keyof typeof localeSeo].hreflang;
        head.push(['link', { rel: 'alternate', hreflang: lang, href: pageUrl(alternateRoute) }]);
      }
    }

    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(...head);
  },
  themeConfig: {
    logo: {
      light: '/brand/nestjs-skills-icon-light.svg',
      dark: '/brand/nestjs-skills-icon-dark.svg',
      alt: 'NestJS Skills'
    },
    siteTitle: 'NestJS Skills',
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          searchOptions: {
            boost: { title: 4, text: 2, titles: 1 }
          }
        }
      }
    },
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
      {
        text: 'Rules',
        link: '/rules/',
        activeMatch: '/rules/|/reference/.*/references/(architecture-rules|dependency-injection|error-handling|error-taxonomy-contracts|exception-filters-transports|failure-resilience-testing|security|performance-diagnosis|testing|database-orm|api-design|microservices|devops-deployment|ci-cd-containers|kubernetes-operations|observability-sre)'
      },
      { text: 'Concepts', link: '/concepts/request-lifecycle', activeMatch: '/concepts/' },
      {
        text: 'Skills',
        items: [
          { text: 'Git Publication', link: '/reference/git-publication/' },
          { text: 'Professional Engineering', link: '/reference/professional-engineering/' },
          { text: 'Code Audit', link: '/reference/code-audit/' },
          { text: 'Feature Audit', link: '/reference/feature-audit/' },
          { text: 'Architecture & Principles', link: '/reference/architecture/' },
          { text: 'OOP & Design Patterns', link: '/reference/oop-patterns/' },
          { text: 'Features & Performance', link: '/reference/features-performance/' }
        ]
      },
      { text: 'Install', link: '/guide/getting-started#install' }
    ],
    sidebar: [
      {
        text: 'Start here',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Choose a skill', link: '/guide/choose-a-skill' },
          { text: 'Feature Audit workflow', link: '/guide/feature-audit' },
          { text: 'Examples and evaluation', link: '/guide/examples-and-evaluation' },
          { text: 'Public listings and posts', link: '/guide/publications' }
        ]
      },
      {
        text: 'Core concepts',
        collapsed: false,
        items: [
          { text: 'Request lifecycle', link: '/concepts/request-lifecycle' },
          { text: 'Interceptors', link: '/concepts/interceptors' },
          { text: 'Modules & boundaries', link: '/concepts/modules-and-boundaries' },
          { text: 'Dependency injection', link: '/concepts/dependency-injection' },
          { text: 'Events, queues & outbox', link: '/concepts/events-queues-outbox' },
          { text: 'Testing boundaries', link: '/concepts/testing-boundaries' }
        ]
      },
      {
        text: 'Rules reference',
        collapsed: false,
        items: [
          { text: '1. Architecture', link: '/reference/architecture/references/architecture-rules' },
          { text: '2. Dependency Injection', link: '/reference/architecture/references/dependency-injection' },
          { text: '3. Error Handling', link: '/reference/features-performance/references/error-handling' },
          { text: '4. Security', link: '/reference/features-performance/references/security' },
          { text: '5. Performance', link: '/reference/features-performance/references/performance-diagnosis' },
          { text: '6. Testing', link: '/reference/features-performance/references/testing' },
          { text: '7. Database & ORM', link: '/reference/architecture/references/database-orm' },
          { text: '8. API Design', link: '/reference/features-performance/references/api-design' },
          { text: '9. Microservices', link: '/reference/architecture/references/microservices' },
          { text: '10. DevOps & Deployment', link: '/reference/features-performance/references/devops-deployment' }
        ]
      },
      {
        text: 'Git Publication',
        collapsed: false,
        items: [
          { text: 'Skill instructions', link: '/reference/git-publication/' },
          { text: 'Commit messages', link: '/reference/git-publication/references/commit-messages' },
          { text: 'Pull requests & releases', link: '/reference/git-publication/references/pull-requests-and-releases' },
          { text: 'Sensitive content & remote safety', link: '/reference/git-publication/references/sensitive-content-and-remote-safety' }
        ]
      },
      {
        text: 'Professional Engineering',
        collapsed: false,
        items: [
          { text: 'Skill instructions', link: '/reference/professional-engineering/' },
          { text: 'Syntax and idioms', link: '/reference/professional-engineering/references/syntax-and-idioms' },
          { text: 'Syntactic sugar', link: '/reference/professional-engineering/references/syntactic-sugar' },
          { text: 'Implementation verification', link: '/reference/professional-engineering/references/implementation-verification' }
        ]
      },
      {
        text: 'Code Audit',
        collapsed: false,
        items: [
          { text: 'Skill instructions', link: '/reference/code-audit/' },
          { text: 'Standalone semantic review', link: '/reference/code-audit/references/semantic-review' },
          { text: 'Read-only check policy', link: '/reference/code-audit/references/check-policy' },
          { text: 'Finding ownership', link: '/reference/code-audit/references/finding-ownership' },
          { text: 'Report template', link: '/reference/code-audit/references/report-template' }
        ]
      },
      {
        text: 'Feature Audit',
        collapsed: false,
        items: [
          { text: 'Skill instructions', link: '/reference/feature-audit/' },
          { text: 'Roadmap discovery', link: '/reference/feature-audit/references/roadmap-discovery' },
          { text: 'Evidence classification', link: '/reference/feature-audit/references/evidence-classification' },
          { text: 'Report template', link: '/reference/feature-audit/references/report-template' }
        ]
      },
      {
        text: 'Architecture & Principles',
        collapsed: true,
        items: [
          { text: 'Skill instructions', link: '/reference/architecture/' },
          { text: 'Architecture rules', link: '/reference/architecture/references/architecture-rules' },
          { text: 'Architecture ladder', link: '/reference/architecture/references/architecture-ladder' },
          { text: 'Module boundaries', link: '/reference/architecture/references/module-boundaries' },
          { text: 'Dependency injection', link: '/reference/architecture/references/dependency-injection' },
          { text: 'Database & ORM', link: '/reference/architecture/references/database-orm' },
          { text: 'Microservices', link: '/reference/architecture/references/microservices' },
          { text: 'Engineering principles', link: '/reference/architecture/references/engineering-principles' },
          { text: 'Architecture review', link: '/reference/architecture/references/architecture-review' }
        ]
      },
      {
        text: 'OOP & Design Patterns',
        collapsed: true,
        items: [
          { text: 'Skill instructions', link: '/reference/oop-patterns/' },
          { text: 'OOP & SOLID', link: '/reference/oop-patterns/references/oop-solid' },
          { text: 'Object design', link: '/reference/oop-patterns/references/object-design' },
          { text: 'Pattern catalog', link: '/reference/oop-patterns/references/pattern-catalog' },
          { text: 'NestJS-native patterns', link: '/reference/oop-patterns/references/nestjs-native-patterns' },
          { text: 'Smells & refactoring', link: '/reference/oop-patterns/references/smells-refactoring' }
        ]
      },
      {
        text: 'Features & Performance',
        collapsed: true,
        items: [
          { text: 'Skill instructions', link: '/reference/features-performance/' },
          { text: 'Feature selection', link: '/reference/features-performance/references/feature-selection' },
          { text: 'API & runtime', link: '/reference/features-performance/references/api-runtime' },
          { text: 'Error handling', link: '/reference/features-performance/references/error-handling' },
          { text: 'Error taxonomy & contracts', link: '/reference/features-performance/references/error-taxonomy-contracts' },
          { text: 'Exception filters & transports', link: '/reference/features-performance/references/exception-filters-transports' },
          { text: 'Failure resilience & testing', link: '/reference/features-performance/references/failure-resilience-testing' },
          { text: 'Security', link: '/reference/features-performance/references/security' },
          { text: 'Testing', link: '/reference/features-performance/references/testing' },
          { text: 'API design', link: '/reference/features-performance/references/api-design' },
          { text: 'Performance diagnosis', link: '/reference/features-performance/references/performance-diagnosis' },
          { text: 'Scaling & reliability', link: '/reference/features-performance/references/scaling-reliability' },
          { text: 'DevOps & deployment', link: '/reference/features-performance/references/devops-deployment' },
          { text: 'CI/CD & containers', link: '/reference/features-performance/references/ci-cd-containers' },
          { text: 'Kubernetes operations', link: '/reference/features-performance/references/kubernetes-operations' },
          { text: 'Observability & SRE', link: '/reference/features-performance/references/observability-sre' },
          { text: 'Production readiness', link: '/reference/features-performance/references/production-readiness' }
        ]
      },
      {
        text: 'Project',
        items: [
          { text: 'Source policy', link: '/about/source-policy' },
          { text: 'GitHub repository', link: github }
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: 'On this page'
    },
    socialLinks: [{ icon: 'github', link: github }],
    editLink: {
      pattern: `${github}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub'
    },
    lastUpdated: {
      text: 'Updated',
      formatOptions: {
        dateStyle: 'medium'
      }
    },
    docFooter: {
      prev: 'Previous',
      next: 'Next'
    },
    footer: {
      message: 'Open-source guidance for deliberate NestJS engineering.',
      copyright: 'Released under the MIT License.'
    }
  }
});
