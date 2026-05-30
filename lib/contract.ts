import type { Address } from "viem";

export const DNAFORGE_ADDRESS =
  "0x991D5d0b0F956ccaB7FB53b8B4A649C220A6A7dD" as Address;

export type DNARecord = {
  id: bigint;
  sequence: string;
  species: string;
  generation: bigint;
  mutationCount: bigint;
  createdAt: bigint;
  exists: boolean;
};

export const DNAFORGE_ABI = [
  {
    type: "function",
    name: "createDNA",
    stateMutability: "nonpayable",
    inputs: [
      { name: "sequence", type: "string" },
      { name: "species", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "editDNA",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dnaId", type: "uint256" },
      { name: "newSequence", type: "string" },
      { name: "newSpecies", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "fuseDNA",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dnaA", type: "uint256" },
      { name: "dnaB", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "mutateDNA",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dnaId", type: "uint256" },
      { name: "mutationTag", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "deleteDNA",
    stateMutability: "nonpayable",
    inputs: [{ name: "dnaId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "resetLab",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "getDNA",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "dnaId", type: "uint256" },
    ],
    outputs: [
      { name: "id", type: "uint256" },
      { name: "sequence", type: "string" },
      { name: "species", type: "string" },
      { name: "generation", type: "uint256" },
      { name: "mutationCount", type: "uint256" },
      { name: "createdAt", type: "uint256" },
      { name: "exists", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "dnaCount",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "interactionCount",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "DNACreated",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "dnaId", type: "uint256", indexed: true },
      { name: "sequence", type: "string", indexed: false },
    ],
  },
] as const;
