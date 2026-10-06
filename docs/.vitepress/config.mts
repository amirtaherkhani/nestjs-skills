import { defineConfig } from 'vitepress';

const github = 'https://github.com/amirtaherkhani/nestjs-skills';
const siteUrl = 'https://amirtaherkhani.github.io/nestjs-skills';
const englishDescription = 'Project-aware software implementation and evidence-based NestJS architecture, object design, runtime, performance, and scaling guidance for Claude Code and Codex.';
const persianDescription = 'راهنمای فارسی برای نصب و شروع استفاده از مهارت‌های هوشمند NestJS.';
const pairedRoutes = [
  { english: '/', persian: '/fa/' },
  { english: '/guide/getting-started', persian: '/fa/guide/getting-started' }
];

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

for (const { english, persian } of pairedRoutes) {
  const links = [
    { lang: 'en', url: pageUrl(english) },
    { lang: 'fa', url: pageUrl(persian) }
  ];

  sitemapAlternates.set(normalizePath(pageUrl(english)), links);
  sitemapAlternates.set(normalizePath(pageUrl(persian)), links);
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
    ['meta', { property: 'og:image:alt', content: 'NestJS Skills red N and charcoal S logo with title and description.' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://amirtaherkhani.github.io/nestjs-skills/brand/social-cover.png' }],
    ['meta', { name: 'twitter:image:alt', content: 'NestJS Skills red N and charcoal S logo.' }]
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en-US'
    },
    fa: {
      label: 'فارسی',
      lang: 'fa-IR',
      dir: 'rtl',
      title: 'NestJS Skills',
      titleTemplate: ':title | NestJS Skills',
      description: persianDescription,
      themeConfig: {
        langMenuLabel: 'تغییر زبان',
        darkModeSwitchLabel: 'حالت نمایش',
        lightModeSwitchTitle: 'تغییر به زمینهٔ روشن',
        darkModeSwitchTitle: 'تغییر به زمینهٔ تیره',
        search: {
          provider: 'local',
          options: {
            detailedView: true,
            miniSearch: {
              searchOptions: {
                boost: { title: 4, text: 2, titles: 1 }
              }
            },
            translations: {
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
            }
          }
        },
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
    const isPersian = relativePath.startsWith('fa/');
    const title = pageData.frontmatter.title || pageData.title || (isPersian ? 'مهارت‌های NestJS' : 'NestJS Skills');
    const description = pageData.frontmatter.description ?? (isPersian ? persianDescription : englishDescription);
    const alternates = pairedRoutes.find(({ english, persian }) => route === english || route === persian);
    const head = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: canonicalUrl }],
      ['meta', { property: 'og:locale', content: isPersian ? 'fa_IR' : 'en_US' }],
      ['meta', { property: 'og:image:alt', content: isPersian ? 'نشان مهارت‌های NestJS برای توسعه و معماری نرم‌افزار.' : 'NestJS Skills red N and charcoal S logo.' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image:alt', content: isPersian ? 'نشان مهارت‌های NestJS برای توسعه و معماری نرم‌افزار.' : 'NestJS Skills red N and charcoal S logo.' }]
    ];

    if (alternates) {
      const routes = [
        { lang: 'en', route: alternates.english },
        { lang: 'fa', route: alternates.persian }
      ];
      for (const alternate of routes) {
        head.push(['link', { rel: 'alternate', hreflang: alternate.lang, href: pageUrl(alternate.route) }]);
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
          { text: 'Examples and evaluation', link: '/guide/examples-and-evaluation' }
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
