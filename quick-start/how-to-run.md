# How to Run

Follow these steps to get the project running in minutes.

#### 0. Install Prerequisites (Node.js & Foundry)

First, ensure you have the correct version of Node.js installed. We recommend using `nvm`:

```
# 1. Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 2. Install Node.js 18
nvm install 18
nvm use 18

# 3. Install Foundry (for Smart Contracts)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### 1. Clone & Install Dependencies

```
git clone https://github.com/danielnoveno/hackathon-hooklabai.git
cd hackathon-hooklabai

# Install Frontend Dependencies
cd frontend
npm install
cd ..
```

#### 2. Smart Contract Setup (Base Sepolia)

```
# Install dependencies
forge install

# Create .env file
cp .env.example .env

# Deploy to Testnet (requires private key with Sepolia ETH)
# Update .env with your PRIVATE_KEY first
forge script script/Deploy.s.sol --rpc-url https://sepolia.base.org --broadcast
```

_Copy the deployed contract address from the output!_

#### 3. Database & Environment Setup

1. Create a project at [Supabase](https://supabase.com/).
2. Run the SQL from `supabase-schema.sql` in the Supabase SQL Editor.
3. Configure the frontend:

```
cd frontend
cp .env.example .env.local
```

Edit `.env.local` and add your keys:

* `NEXT_PUBLIC_CONTRACT_ADDRESS`: (From Step 2)
* `NEXT_PUBLIC_SUPABASE_URL`: (From Supabase)
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (From Supabase)

#### 4. Run the Application

```
cd frontend
npm run dev
```

Open [**http://localhost:3000**](http://localhost:3000/) in your browser.

> 📘 **Detailed Guide**: For a complete deep-dive into every configuration option, see [SETUP.md](https://github.com/danielnoveno/hackathon-hooklabai/blob/main/SETUP.md).

