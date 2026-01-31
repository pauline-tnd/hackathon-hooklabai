# Usage Flow

We aim for a sub-60 second path from wallet connect to a post. We optimize for the “happy path” first.

### Happy path (what users do)

1. Connect a wallet.
2. Pick a topic or trend (from Farcaster).
3. Generate hook options (free).
4. Browse hook previews (free).
5. Reveal a full caption (**-1 credit**).
6. Generate an image or video (**-1 credit**).
7. Deep link to posting.

New wallets start with **5 free credits**. Credits are enforced offchain (Supabase). Onchain payments are only used to buy credits.

See [Credits & Payments](../mini-app-guide/credits-and-payments.md) for the exact spend rules.

### Testing

#### Smart contract tests

{% hint style="info" %}
Run from the repo root.
{% endhint %}

```
forge test -vvv
```

#### Manual testing checklist

* [ ] Wallet connection via OnchainKit works.
* [ ] Topic selection shows real-time Farcaster trends (via Neynar).
* [ ] Hook generation shows **previews only** during selection.
* [ ] Browsing previews does **not** spend credits.
* [ ] Revealing a full caption deducts **1 credit** in Supabase.
* [ ] Generating an image deducts **1 credit**.
* [ ] Generating a video deducts **1 credit**.
* [ ] When credits hit **0**, the app prompts to buy more credits.
* [ ] Onchain credit purchase increases the user’s credit balance.
* [ ] Failed or rejected payments do **not** deduct credits.
* [ ] Warpcast deep link opens the compose flow correctly.
