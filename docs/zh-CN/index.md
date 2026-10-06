---
title: NestJS 技能集
description: 了解七个开源技能，涵盖软件工程、NestJS 架构、代码审查、功能审计与安全发布。
layout: home

hero:
  name: NestJS Skills
  text: 边界更清晰，决策更可靠。
  tagline: 七个实用技能，帮助你理解项目、设计 NestJS 架构、改进代码并安全发布；每一步都强调用证据验证结果。
  image:
    light: /brand/nestjs-skills-mark-light.svg
    dark: /brand/nestjs-skills-mark-dark.svg
    alt: NestJS Skills 标志
  actions:
    - theme: brand
      text: 快速开始
      link: /zh-CN/guide/getting-started
    - theme: alt
      text: 浏览概念
      link: /concepts/request-lifecycle
    - theme: alt
      text: 查看规则
      link: /rules/

features:
  - title: Git 发布
    details: 准确暂存所需更改、检查敏感信息，并谨慎创建提交、合并请求和版本。
    link: /reference/git-publication/
    linkText: 阅读英文指南
  - title: 软件工程
    details: 先理解项目，选择合适的语法，再以证据验证最小且完整的改动。
    link: /reference/professional-engineering/
    linkText: 阅读英文指南
  - title: 代码审计
    details: 通过只读检查和可核验的证据评估质量、架构、安全性与运行行为。
    link: /reference/code-audit/
    linkText: 阅读英文指南
  - title: 功能审计
    details: 将功能与已记录的路线图对照，找出差距、遗留路径和阻塞项。
    link: /reference/feature-audit/
    linkText: 阅读英文指南
  - title: 架构与原则
    details: 根据实际需求确定模块所有权、依赖方向和架构层级。
    link: /reference/architecture/
    linkText: 阅读英文指南
  - title: 面向对象与设计模式
    details: 理清对象职责、SOLID 原则和设计模式，避免为了模式而增加复杂度。
    link: /reference/oop-patterns/
    linkText: 阅读英文指南
  - title: 功能与性能
    details: 根据测量结果改进请求生命周期、错误契约、可观测性和扩展能力。
    link: /reference/features-performance/
    linkText: 阅读英文指南
---

## 从哪里开始？

[快速开始指南](./guide/getting-started)介绍了如何安装技能集以及如何选择技能。详细技术指南目前仍为英文；每张卡片都会直接链接到相应的英文指南。

### 一套连贯的工程方法

这些技能遵循共同原则：先检查实际代码库，保留已有契约，采用足够安全且简单的方案，并通过测试或测量验证结果。每个技能都有明确边界，需要时再交接给下一项。

处理较大的改动时，先明确系统边界，再梳理对象协作，最后选择合适的 NestJS 运行时功能和验证方式。

## 安装技能集

开放的 Agent Skills 格式可用于 Claude Code、Codex 及兼容工具：

```bash
npx skills add amirtaherkhani/nestjs-skills
```

有关单独安装某项技能和常用命令，请参阅[快速开始指南](./guide/getting-started)。
