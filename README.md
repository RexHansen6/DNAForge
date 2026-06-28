# DNAForge

DNAForge is a Base miniapp for onchain DNA sequence composition.

It lets users build and manage a personal DNA lab through contract interactions. The app supports composing sequences, mutating them, fusing them, editing them, deleting them, and resetting the lab state.

Repository: [https://github.com/RexHansen6/DNAForge.git](https://github.com/RexHansen6/DNAForge.git)

## Overview

DNAForge combines a Next.js interface with onchain interactions on Base mainnet.

The project is designed as a focused DNA composition experience where the core actions are handled through connected wallet transactions.

The interface is built with the Next.js App Router and TypeScript, while blockchain connectivity is handled with Wagmi and Viem.

## Features

- Create DNA sequences in your lab.
- Mutate existing DNA sequences.
- Fuse DNA sequences together.
- Edit created DNA entries.
- Delete individual DNA entries.
- Reset your DNA lab.
- Interact with contracts on Base mainnet.
- Use a modern TypeScript and Next.js application structure.

## Tech Stack

- Next.js App Router
- TypeScript
- Wagmi native config
- Viem
- Base mainnet

## Getting Started

Clone the repository:

```bash
git clone https://github.com/RexHansen6/DNAForge.git
cd DNAForge
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local development URL shown in your terminal.

For most Next.js projects, this is:

```bash
http://localhost:3000
