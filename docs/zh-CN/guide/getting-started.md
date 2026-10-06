---
title: 快速开始
description: 在 Claude Code、Codex 及兼容 Agent Skills 的工具中安装和使用 NestJS 技能。
---

<p class="doc-kicker">指南 · 5 分钟</p>

# 快速开始

<p class="doc-lede">安装七个 Agent Skills，用于理解项目、实现功能、安全发布 Git 更改，以及评估 NestJS 架构、代码和功能。</p>

## 前提条件

- Node.js 20 或更高版本，用于验证代码库和构建文档网站。
- Claude Code、Codex 或支持[开放的 Agent Skills 规范](https://agentskills.io/specification)的其他客户端。
- 一个需要检查的 NestJS 代码库；本技能集专为 NestJS 项目设计。

## 安装

使用 Skills 命令行工具安装整个技能集：

```bash
npx skills add amirtaherkhani/nestjs-skills
```

若要为 Claude Code 和 Codex 安装单个技能，请同时指定技能 ID 和两个工具：

```bash
npx skills add amirtaherkhani/nestjs-skills \
  --skill nestjs-professional-software-engineering \
  --agent claude-code \
  --agent codex
```

不安装、只查看可用技能：

```bash
npx skills add amirtaherkhani/nestjs-skills --list
```

使用 `--global` 可将技能安装到用户级目录。不使用该选项时，Skills CLI 会为所选工具选择预期的项目级目录。

## 选择技能

每个技能负责一类工作：

- `nestjs-professional-software-engineering`：实现功能并协调技术改动。
- `nestjs-git-commit-pr-message`：在验证后发布 Git 更改。
- `nestjs-code-audit`：只读检查代码库质量和风险。
- `nestjs-feature-audit`：依据已记录的路线图审查功能。
- `nestjs-architecture-principles`：模块所有权和架构边界。
- `nestjs-oop-design-patterns`：对象职责、SOLID 和设计模式。
- `nestjs-features-performance`：请求生命周期、错误契约、性能与扩展。

完整技术指南、NestJS 概念和规则参考目前以英文提供。可查看[技能选择指南](../../guide/choose-a-skill)和[规则列表](../../rules/)来确定合适的方向。

## 调用技能

技能说明支持自动激活，因此通常只需提出清晰的任务要求：

```text
Implement this feature using the clearest syntax supported by the current project, then verify it.
```

也可以直接指定技能名称：

```text
$nestjs-professional-software-engineering
```

## 文档语言

首页和本指南已提供简体中文版本。详细技术参考仍为英文。若页面已有翻译，语言菜单会保留当前页面；若没有，则跳转到所选语言的首页。

## 许可证

本项目采用 [MIT 许可证](https://github.com/amirtaherkhani/nestjs-skills/blob/main/LICENSE)。版本与更改记录请参阅 [GitHub 仓库](https://github.com/amirtaherkhani/nestjs-skills)。
