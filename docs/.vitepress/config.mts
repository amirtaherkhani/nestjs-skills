import { defineConfig } from 'vitepress';

const github = 'https://github.com/amirtaherkhani/nestjs-agent-skills';

export default defineConfig({
  title: 'NestJS Agent Skills',
  description: 'Evidence-based NestJS architecture, object design, framework features, performance, and scaling guidance for Claude Code and Codex.',
  lang: 'en-US',
  base: '/nestjs-agent-skills/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://amirtaherkhani.github.io/nestjs-agent-skills/'
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/nestjs-agent-skills/skill-mark.svg' }],
    ['meta', { name: 'theme-color', content: '#e0234e' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'NestJS Agent Skills' }],
    ['meta', { property: 'og:description', content: 'Three focused Agent Skills for Claude Code and Codex.' }]
  ],
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },
  themeConfig: {
    logo: '/skill-mark.svg',
    siteTitle: 'NestJS Agent Skills',
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
        activeMatch: '/rules/|/reference/.*/references/(architecture-rules|dependency-injection|error-handling|security|performance-diagnosis|testing|database-orm|api-design|microservices|devops-deployment|ci-cd-containers|kubernetes-operations|observability-sre)'
      },
      { text: 'Concepts', link: '/concepts/request-lifecycle', activeMatch: '/concepts/' },
      {
        text: 'Skills',
        items: [
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
          { text: 'Choose a skill', link: '/guide/choose-a-skill' }
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
