---
description: What is HookLab AI?
---

# Introduction

HookLab AI is a Farcaster-native mini app for creators on Base. It helps you draft posts that perform. It does this with data-driven hooks and fast publishing.

### One-Liner

**HookLab AI** helps creators go viral on Base. It generates hooks, captions, and media for posting.

### Who it’s for

Creators who want a faster path from idea to post. Especially creators onboarding into Base for the first time.

### What it does

* Generates multiple **hook previews** from real trend signals.
* Reveals a full **caption** after you pick one hook.
* Lets you create a matching **image** or **video** from that caption.
* Sends you straight into the Base posting flow.

### How it works (high level)

1. Open the mini app inside the Base app.
2. Connect your Base wallet.
3. Browse hook previews for free.
4. Pick one hook to reveal the full caption.
5. Optionally generate one image or one video.
6. Copy or post directly.

{% hint style="info" %}
Want the full product flow? Start with [Getting Started (Base Mini App)](mini-app-guide/getting-started-base-mini-app.md).
{% endhint %}

### 🏗️ Architecture Overview

#### Three-Layer Separation

The system is split into three layers. Each layer has a clear job.

{% columns %}
{% column %}
**🌐 Frontend (mini app)**

* Mobile-first UI (Next.js)
* Wallet connection (OnchainKit)
* Hook previews + hook selection
* Caption reveal + media buttons
* Post deep-link to Base
{% endcolumn %}

{% column %}
**⚙️ Backend (services)**

* API routes (Next.js)
* Trend data (Neynar)
* AI orchestration (Eigen + Gemini)
* Credits + quota tracking (Supabase)
* Contract reads for premium state
{% endcolumn %}

{% column %}
**⛓️ Blockchain (Base L2)**

* Contract state for premium access
* Events for audits / indexing
* Payment primitives (if enabled)
{% endcolumn %}
{% endcolumns %}

**Data flow:** Frontend ↔ Backend ↔ Blockchain

<details>

<summary>Detailed architecture diagram (for builders)</summary>

```mermaid
graph TD
    subgraph Frontend[Frontend]
        direction TB
        A[Mobile-First UI (Next.js + OnchainKit)] --> B[Smart Wallet Connection]
        B --> C[Farcaster Topic Selection]
        C --> D[Blind Hook Selection]
        D --> E[Warpcast / Base Deep Link]
    end

    subgraph Backend[Backend]
        direction TB
        F[Backend Services (Next.js API Routes)] --> G[(Supabase: User Quota)]
        J[Neynar API: Farcaster Trends] --> K[AI Orchestration: Eigen + Gemini]
        H[Premium Verification] --> I[Read Smart Contract State]
    end

    subgraph Blockchain[Blockchain]
        direction TB
        L[Base L2: HookLabSubscription.sol]
        L --> L1[subscribeMonthly() - x402 Payment]
        L --> L2[isPremium() - View Function]
        L --> L3[Subscribed Event Emission]
    end

    Frontend <==> Backend
    Backend <==> Blockchain
```

</details>
