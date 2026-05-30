# DNAForge

DNAForge is a Base miniapp for onchain DNA sequence composition. Users can create, mutate, fuse, edit, delete, and reset their own DNA lab through gas-only contract interactions.

## Stack

- Next.js App Router
- TypeScript
- Wagmi native config
- Viem
- Base mainnet

## Attribution placeholders

- Offchain: `app/layout.tsx` contains a hardcoded `<meta name="base:app_id" content="" />`.
- Onchain: `lib/attribution.ts` contains `ONCHAIN_ATTRIBUTION_DATA_SUFFIX = "0x"`.

Replace both values after base.dev verification, then redeploy.
