---
title: شروع به کار | NestJS Skills
description: روش نصب و استفاده از NestJS Skills در Claude Code و Codex.
---

<p class="doc-kicker">راهنما · ۵ دقیقه</p>

# شروع به کار

<p class="doc-lede">هفت مهارت Agent Skills را برای پیاده‌سازی آگاه از پروژه، انتشار امن در Git، تصمیم‌های معماری NestJS و بازبینی کد یا قابلیت نصب کنید.</p>

## پیش‌نیازها

- Node.js نسخهٔ ۲۰ یا جدیدتر برای اعتبارسنجی مخزن و ساخت وب‌سایت مستندات.
- Claude Code، Codex یا ابزار دیگری که از [مشخصات باز Agent Skills](https://agentskills.io/specification) پشتیبانی کند.
- یک مخزن NestJS؛ مهارت‌های این مجموعه برای کارهای NestJS طراحی شده‌اند.

## نصب

برای نصب مجموعه با ابزار خط فرمان Skills:

```bash
npx skills add amirtaherkhani/nestjs-skills
```

برای نصب یک مهارت در Claude Code و Codex، نام مهارت و شناسهٔ هر دو ابزار را مشخص کنید:

```bash
npx skills add amirtaherkhani/nestjs-skills \
  --skill nestjs-professional-software-engineering \
  --agent claude-code \
  --agent codex
```

برای دیدن نام مهارت‌های موجود بدون نصب:

```bash
npx skills add amirtaherkhani/nestjs-skills --list
```

گزینهٔ `--global` مهارت را برای کاربر نصب می‌کند. بدون آن، ابزار Skills محل نصب پروژه‌ای مناسب هر ابزار را انتخاب می‌کند.

## انتخاب مهارت

هر مهارت برای بخشی مشخص از کار است:

- `nestjs-professional-software-engineering`: پیاده‌سازی و هماهنگی تغییرهای فنی.
- `nestjs-git-commit-pr-message`: انتشار تغییرهای بررسی‌شده در Git.
- `nestjs-code-audit`: بازبینی فقط‌خواندنی کیفیت و ریسک‌های مخزن.
- `nestjs-feature-audit`: مقایسهٔ یک قابلیت با نقشهٔ راه مستند.
- `nestjs-architecture-principles`: مالکیت ماژول‌ها و مرزهای معماری.
- `nestjs-oop-design-patterns`: مسئولیت اشیا، SOLID و الگوهای طراحی.
- `nestjs-features-performance`: چرخهٔ درخواست، قراردادهای خطا، کارایی و مقیاس.

شرح کامل و مثال هر مهارت در حال حاضر به انگلیسی است. [راهنمای انتخاب مهارت](../../guide/choose-a-skill) و [فهرست قواعد](../../rules/) مسیر مناسب را نشان می‌دهند.

## فراخوانی یک مهارت

شرح مهارت‌ها برای فعال‌سازی خودکار نوشته شده است؛ بنابراین درخواست مشخصی مانند این معمولاً کافی است:

```text
Implement this feature using the clearest syntax supported by the current project, then verify it.
```

همچنین می‌توانید نام مهارت را مستقیم بنویسید:

```text
$nestjs-professional-software-engineering
```

مهارت‌های `nestjs-architecture-principles`، `nestjs-code-audit`، `nestjs-feature-audit`، `nestjs-features-performance`، `nestjs-git-commit-pr-message` و `nestjs-oop-design-patterns` هم قابل فراخوانی مستقیم هستند.

## محتوای فارسی و انگلیسی

صفحهٔ اصلی و این راهنمای شروع به کار به فارسی هستند. راهنماهای فنی تفصیلی، مفاهیم NestJS و مراجع قواعد هنوز انگلیسی‌اند؛ در صفحه‌ها پیوندی به محتوای موجود گذاشته شده است تا زبان آن روشن باشد.

از منوی زبان در نوار بالای صفحه برای جابه‌جایی میان نسخه‌های فارسی و انگلیسی استفاده کنید. در صفحه‌های دیگر انگلیسی، این منو به صفحهٔ فارسی اصلی می‌رود.

## مجوز

این پروژه تحت [مجوز MIT](https://github.com/amirtaherkhani/nestjs-skills/blob/main/LICENSE) منتشر شده است. برای مشاهدهٔ نسخه و تغییرهای آن، [مخزن گیت‌هاب](https://github.com/amirtaherkhani/nestjs-skills) را ببینید.
