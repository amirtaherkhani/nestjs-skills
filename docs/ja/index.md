---
title: NestJS Skills
description: NestJS Skills は Claude Code と Codex 向けの 7 つのオープンソース Agent Skills をまとめたコレクションです。NestJS の開発、設計、コード監査、性能改善を支援します。
layout: home

hero:
  name: NestJS Skills
  text: 明確な境界。より良い判断。
  tagline: プロジェクトの理解、NestJS アーキテクチャの設計、コードの改善、安全な公開を支援する 7 つの実践的なスキルです。結果はテストや測定で確かめます。
  image:
    light: /brand/nestjs-skills-mark-light.svg
    dark: /brand/nestjs-skills-mark-dark.svg
    alt: NestJS Skills のロゴ
  actions:
    - theme: brand
      text: はじめに
      link: /ja/guide/getting-started
    - theme: alt
      text: 概念を見る
      link: /concepts/request-lifecycle
    - theme: alt
      text: ルールを見る
      link: /rules/

features:
  - title: Git での公開
    details: 必要な変更だけを正確にステージし、シークレットを確認してからコミット、プルリクエスト、リリースを行います。
    link: /reference/git-publication/
    linkText: 英語のガイドを読む
  - title: ソフトウェアエンジニアリング
    details: プロジェクトを理解し、適切な構文を選び、必要最小限の一貫した変更を検証します。
    link: /reference/professional-engineering/
    linkText: 英語のガイドを読む
  - title: コード監査
    details: 読み取り専用の調査と根拠に基づき、品質、アーキテクチャ、セキュリティ、実行時のリスクを確認します。
    link: /reference/code-audit/
    linkText: 英語のガイドを読む
  - title: 機能監査
    details: 機能を文書化されたロードマップと照合し、差分やブロッカーを特定します。
    link: /reference/feature-audit/
    linkText: 英語のガイドを読む
  - title: アーキテクチャと原則
    details: 実際の要件に合わせて、モジュールの責務、依存の方向、アーキテクチャの粒度を決めます。
    link: /reference/architecture/
    linkText: 英語のガイドを読む
  - title: オブジェクト指向とデザインパターン
    details: オブジェクトの責務、SOLID、パターンを整理し、不要な複雑さを避けます。
    link: /reference/oop-patterns/
    linkText: 英語のガイドを読む
  - title: 機能とパフォーマンス
    details: 実測結果をもとに、リクエストのライフサイクル、エラー契約、可観測性、拡張性を改善します。
    link: /reference/features-performance/
    linkText: 英語のガイドを読む
---

## NestJS Skills とは？

NestJS Skills は、Claude Code や Codex などのコーディングエージェント向けに 7 つの Agent Skills をまとめたオープンソースのコレクションです。NestJS のコードベースを理解し、的を絞った設計・実装を行い、コード品質と実行時の動作を確認するために使えます。

## まず何をすればよいですか？

[はじめに](./guide/getting-started)では、スキルのインストール方法と選び方を説明します。詳しい技術ガイドは現在英語です。各カードから対応する英語のガイドを直接開けます。

### 一貫したエンジニアリングの進め方

各スキルは、実際のリポジトリを確認すること、既存の契約を保つこと、必要十分で安全な設計を選ぶこと、テストや測定で結果を確かめることを共通の基準としています。責務を明確にし、必要な場合に次のスキルへ作業を引き継ぎます。

大きな変更では、まずシステム境界を整理し、次にオブジェクト間の協力関係を設計し、最後に NestJS の機能と検証方法を選びます。

## スキルをインストール

オープンな Agent Skills 形式は Claude Code、Codex、および互換ツールで利用できます。

```bash
npx skills add amirtaherkhani/nestjs-skills
```

個別のスキルや追加のコマンドについては、[はじめに](./guide/getting-started)を参照してください。
