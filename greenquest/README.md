# 🌱 GreenQuest: A GameFi Platform for Environmental Action

GreenQuest is a Web3 GameFi platform built on the Stacks blockchain that **rewards real-world environmental actions** with on-chain benefits. By completing eco-missions like tree planting or recycling, users earn tokens, dynamic NFTs, and governance rights — all while helping the planet.

---

## 🧠 Key Features

- **Real-World Missions**: Complete verified environmental tasks.
- **Game Mechanics**: Level up avatars, unlock quests, and earn evolving NFTs.
- **On-Chain Rewards**: Earn $GREEN tokens, NFTs, and staking yields.
- **Community Governance**: Vote on real-world sustainability projects to fund.
- **Built on Bitcoin via Stacks & Clarity**

---

## 📦 Smart Contract Overview (Clarity)

| Contract Name              | Purpose                                                             |
|---------------------------|----------------------------------------------------------------------|
| `avatar.clar`             | User profiles, XP system, avatar traits                              |
| `quests.clar`             | Issue/track real-world missions with metadata                        |
| `oracle-verifier.clar`    | Interface with oracles to verify off-chain actions                   |
| `rewards.clar`            | Handles token/NFT distribution upon mission completion               |
| `nft-inventory.clar`      | Mint and manage dynamic NFTs (gear, badges, etc.)                    |
| `token.clar`              | $GREEN fungible token (SIP-010 compliant)                            |
| `marketplace.clar`        | Buy/sell NFTs and in-game items                                     |
| `staking.clar`            | Stake $GREEN to earn yield and access tiered content                 |
| `dao.clar`                | DAO logic: voting, proposals, and funding eco-projects              |
| `donation-matching.clar`  | Optional: match token donations to verified NGOs                     |

---

## 🚀 Getting Started

### Prerequisites

- [Clarity CLI](https://docs.stacks.co/docs/clarity-cli)
- [Clarinet](https://github.com/hirosystems/clarinet) (for local development)
- Node.js + npm (for frontend, if applicable)

### Clone the Repo

```bash
git clone https://github.com/your-org/greenquest.git
cd greenquest
