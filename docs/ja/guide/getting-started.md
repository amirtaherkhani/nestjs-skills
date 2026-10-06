---
title: はじめに
description: Claude Code、Codex、および Agent Skills 対応ツールで NestJS スキルをインストールして使う方法を説明します。
---

<p class="doc-kicker">ガイド · 5 分</p>

# はじめに

<p class="doc-lede">プロジェクトを理解した実装、安全な Git 公開、NestJS の設計、コードや機能の監査を支援する 7 つの Agent Skills をインストールします。</p>

## 前提条件

- リポジトリの検証やドキュメントサイトのビルドを行う場合は、Node.js 20 以降。
- Claude Code、Codex、または公開されている [Agent Skills 仕様](https://agentskills.io/specification)に対応したクライアント。
- 調査対象の NestJS リポジトリ。このコレクションは NestJS の作業向けです。

## インストール

Skills CLI でコレクション全体をインストールします。

```bash
npx skills add amirtaherkhani/nestjs-skills
```

Claude Code と Codex に 1 つのスキルだけを入れる場合は、スキル ID と対象ツールを指定します。

```bash
npx skills add amirtaherkhani/nestjs-skills \
  --skill nestjs-professional-software-engineering \
  --agent claude-code \
  --agent codex
```

インストールせずに利用可能なスキルを確認するには、次を実行します。

```bash
npx skills add amirtaherkhani/nestjs-skills --list
```

`--global` を付けるとユーザー単位でインストールします。省略すると、Skills CLI が選択したエージェントに適したプロジェクト内の場所を選びます。

## スキルを選ぶ

それぞれのスキルは異なる作業を担当します。

- `nestjs-professional-software-engineering`：実装と技術作業の調整。
- `nestjs-git-commit-pr-message`：検証済み変更の Git 公開。
- `nestjs-code-audit`：リポジトリの品質とリスクを読み取り専用で確認。
- `nestjs-feature-audit`：機能を文書化されたロードマップと照合。
- `nestjs-architecture-principles`：モジュールの責務とアーキテクチャ境界。
- `nestjs-oop-design-patterns`：オブジェクトの責務、SOLID、デザインパターン。
- `nestjs-features-performance`：リクエスト処理、エラー契約、性能、拡張性。

詳しい技術ガイド、NestJS の概念、ルールのリファレンスは現在英語です。[スキルの選び方](../../guide/choose-a-skill)と[ルール一覧](../../rules/)を参照してください。

## スキルを呼び出す

スキルの説明は自動で有効になるように設計されています。たとえば、次のように依頼できます。

```text
Implement this feature using the clearest syntax supported by the current project, then verify it.
```

スキル名を明示することもできます。

```text
$nestjs-professional-software-engineering
```

## ドキュメントの言語

トップページとはじめにのガイドは日本語で利用できます。詳しい技術リファレンスは英語です。翻訳済みのページでは同じページに切り替わり、翻訳がない場合は選択した言語のトップページを開きます。

## ライセンス

このプロジェクトは [MIT ライセンス](https://github.com/amirtaherkhani/nestjs-skills/blob/main/LICENSE)で公開されています。バージョンと変更履歴は[GitHub リポジトリ](https://github.com/amirtaherkhani/nestjs-skills)をご覧ください。
