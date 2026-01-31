# Flow

### Audience

This page is for **judges** and **contributors**.

### Success criteria

1. Demo the end-to-end flow in **under 60 seconds**.
2. Explain the architecture in judge Q\&A without hand-waving.
3. Make the product flow obvious on first use.
4. Show clear Base alignment: onchain payments + Farcaster integration.

### What to show in the demo

Keep the demo tight. Show the “happy path”.

1. Connect a wallet.
2. Pick a topic or trend (from Farcaster).
3. Browse hook previews (free).
4. Reveal a full caption (**-1 credit**).
5. Generate an image or video (**-1 credit**).
6. Deep link to posting.

### Monetization model (hackathon build)

HookLab uses a **credit** model. There’s **no subscription**.

* New wallets start with **5 free credits**.
* Credits are spent when you **reveal** or **generate** an output.
* Users buy more credits via an **onchain payment** on Base.

See [Credits & Payments](../mini-app-guide/credits-and-payments.md) for the exact rules.

{% hint style="info" %}
When answering questions, stick to what’s implemented in this build. If it’s not wired end-to-end, don’t claim it.
{% endhint %}

### Technical claims

#### We can claim

* Onchain credit purchases on Base (via OnchainKit).
* Credits enforced offchain (stored in Supabase).
* Farcaster trend data via Neynar.
* AI generation (prompt-based) via Gemini and Eigen AI.
* Blind selection: previews are free, reveals cost credits.

#### We can’t claim

* Subscription billing or “premium unlimited” plans.
* Onchain credit accounting.
* Onchain quota / usage storage.
* Production-grade scaling guarantees.
* Advanced AI reasoning beyond prompting.

### Contributor guidelines

Focus on:

* Demo reliability and speed.
* Clear boundaries between onchain and offchain.
* Honest, defensible claims.

Avoid:

* Complex infra (indexers, heavy pipelines).
* Overengineering before the demo works.

### Resources

* [Foundry Book](https://book.getfoundry.sh/)
* [Coinbase OnchainKit](https://onchainkit.xyz/)
* [Neynar API Docs](https://docs.neynar.com/)
* [Base Documentation](https://docs.base.org/)
* [Farcaster Frames](https://docs.farcaster.xyz/learn/what-is-farcaster/frames)
