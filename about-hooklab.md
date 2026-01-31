# About HookLab

### 🚀 Core Features

#### 1. Blind Hook Selection

* AI generates multiple high-potential hooks based on social data.
* User sees **only hooks** (first sentence, ≤120 chars) to maintain focus.
* No body content visible until the selection is finalized.
* Selecting a specific hook **consumes 1 quota credit**.
* Full content detail is revealed **only after selection** is confirmed.

#### 2. Trend-Jacking

* Fetches high-engagement Farcaster posts directly from the Base channel.
* Calculates hook strength using the formula: `(likes + recasts + replies) / follower_count`.
* AI leverages successful structures and patterns without copying content.
* Delivers crypto-native and timely output tailored for the ecosystem.

#### 3. Quota & Payment

* **Free credits**: Receive limited credits for exploration (default: 5).
* **Credit purchase**: Users can buy credits to generate content.
* Backend reads the smart contract state to enforce quota rules accurately.

***

### 📁 Project Structure

```
hackathon-hooklabai/
├── src/                          # Smart contracts (Foundry)
│   └── HookLabSubscription.sol
├── script/
│   └── Deploy.s.sol
├── test/
│   └── HookLabSubscription.t.sol
├── frontend/                     # Next.js application
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── api/                  # Backend API routes
│   │   │   ├── quota/
│   │   │   ├── hooks/generate/
│   │   │   ├── content/generate/
│   │   │   └── premium/verify/
│   │   └── components/
│   │       ├── WalletConnect.tsx
│   │       ├── TopicSelector.tsx
│   │       ├── HookSelector.tsx
│   │       ├── ContentReveal.tsx
│   │       └── SubscribeButton.tsx
│   └── lib/
│       ├── supabase.ts
│       ├── neynar.ts
│       ├── ai.ts
│       └── contract.ts
└── README.md
```

***

### 🛠️ Tech Stack

| Layer              | Technology              | Role                                                 |
| ------------------ | ----------------------- | ---------------------------------------------------- |
| **Blockchain**     | **Base L2**             | Scalable, low-fee infrastructure for creator economy |
| **Smart Contract** | Foundry / Solidity      | Secure subscription & status verification            |
| **Frontend**       | Next.js (App Router)    | Mobile-first, high-performance creator UI            |
| **Onchain Tools**  | **Coinbase OnchainKit** | Seamless Smart Wallet & Paymaster integration        |
| **Backend**        | Next.js API Routes      | The central orchestrator for data & AI               |
| **Social Data**    | **Neynar API**          | Real-time indexing of Farcaster/Base trends          |
| **AI Engine**      | Eigen AI + Gemini       | Advanced LLM for viral content generation            |
| **Database**       | Supabase                | Efficient off-chain quota & user management          |

\
<br>
