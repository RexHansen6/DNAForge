"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Atom,
  CheckCircle2,
  Dna,
  FlaskConical,
  GitFork,
  Loader2,
  Pencil,
  Power,
  RefreshCcw,
  Sparkles,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { base } from "wagmi/chains";
import { config } from "@/lib/wagmi";
import {
  DNAFORGE_ABI,
  DNAFORGE_ADDRESS,
  type DNARecord,
} from "@/lib/contract";
import { ONCHAIN_ATTRIBUTION_DATA_SUFFIX } from "@/lib/attribution";
import { Providers } from "@/app/providers";

const seeds = ["ACGT-AURA", "HELIX-01", "BASE-GENE", "NOVA-CELL"];
const species = ["Forgeborn", "Blue Helix", "Orbit Strain", "Base Cell"];
const mutationTags = ["spark", "pulse", "nova", "rift", "alpha"];

function randomItem(values: string[]) {
  return values[Math.floor(Math.random() * values.length)];
}

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Page() {
  return (
    <Providers>
      <DNAForgeApp />
    </Providers>
  );
}

function DNAForgeApp() {
  const [tab, setTab] = useState<"lab" | "genome">("lab");
  const [sequence, setSequence] = useState(randomItem(seeds));
  const [speciesName, setSpeciesName] = useState(randomItem(species));
  const [selectedId, setSelectedId] = useState("0");
  const [secondId, setSecondId] = useState("1");
  const [editSequence, setEditSequence] = useState("ACGT-AURA");
  const [editSpecies, setEditSpecies] = useState("Forgeborn");
  const [txLabel, setTxLabel] = useState("");
  const [autoConnectTried, setAutoConnectTried] = useState(false);
  const [walletPickerOpen, setWalletPickerOpen] = useState(false);

  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();
  const receipt = useWaitForTransactionReceipt({ hash, config });

  const dnaCount = useReadContract({
    address: DNAFORGE_ADDRESS,
    abi: DNAFORGE_ABI,
    functionName: "dnaCount",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address), refetchInterval: 8000 },
  });

  const interactionCount = useReadContract({
    address: DNAFORGE_ADDRESS,
    abi: DNAFORGE_ABI,
    functionName: "interactionCount",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address), refetchInterval: 8000 },
  });

  const selectedDNA = useReadContract({
    address: DNAFORGE_ADDRESS,
    abi: DNAFORGE_ABI,
    functionName: "getDNA",
    args: address ? [address, BigInt(Number(selectedId) || 0)] : undefined,
    query: { enabled: Boolean(address), refetchInterval: 8000 },
  });

  const count = Number(dnaCount.data ?? 0n);
  const interactions = Number(interactionCount.data ?? 0n);
  const dna = useMemo<DNARecord | null>(() => {
    if (!selectedDNA.data) return null;
    const [id, seq, dnaSpecies, generation, mutationCount, createdAt, exists] =
      selectedDNA.data;
    return {
      id,
      sequence: seq,
      species: dnaSpecies,
      generation,
      mutationCount,
      createdAt,
      exists,
    };
  }, [selectedDNA.data]);

  useEffect(() => {
    if (!receipt.isSuccess) return;
    dnaCount.refetch();
    interactionCount.refetch();
    selectedDNA.refetch();
  }, [receipt.isSuccess]);

  useEffect(() => {
    if (autoConnectTried || isConnected) return;
    const isBaseApp =
      typeof navigator !== "undefined" && /base/i.test(navigator.userAgent);
    const skipped =
      typeof window !== "undefined" &&
      window.localStorage.getItem("dnaforge:autoConnectSkipped") === "1";
    const injected = connectors.find((connector) => connector.id === "injected");
    if (isBaseApp && injected && !skipped) {
      setAutoConnectTried(true);
      connect({ connector: injected, chainId: base.id });
    }
  }, [autoConnectTried, connect, connectors, isConnected]);

  const busy = isWriting || receipt.isLoading;
  const injectedConnector = connectors.find((item) => item.id === "injected");
  const coinbaseConnector = connectors.find(
    (item) => item.id === "coinbaseWalletSDK",
  );
  const connectWallet = (connectorId: "injected" | "coinbaseWalletSDK") => {
    const connector =
      connectorId === "injected" ? injectedConnector : coinbaseConnector;
    if (!connector) return;
    setWalletPickerOpen(false);
    connect({ connector, chainId: base.id });
  };

  const onWrite = (
    label: string,
    functionName:
      | "createDNA"
      | "editDNA"
      | "fuseDNA"
      | "mutateDNA"
      | "deleteDNA"
      | "resetLab",
    args: readonly unknown[],
  ) => {
    setTxLabel(label);
    writeContract({
      address: DNAFORGE_ADDRESS,
      abi: DNAFORGE_ABI,
      functionName,
      args,
      chainId: base.id,
      dataSuffix: ONCHAIN_ATTRIBUTION_DATA_SUFFIX,
    } as Parameters<typeof writeContract>[0]);
  };

  const primaryAction = () => {
    onWrite("Creating DNA", "createDNA", [sequence, speciesName]);
  };

  const connectedWrongChain = isConnected && chainId !== base.id;

  return (
    <main className="shell">
      <section className="hero">
        <div className="heroCopy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Gas-only onchain lab
          </div>
          <h1>DNAForge</h1>
          <p>
            Compose, mutate, and fuse unlimited DNA sequences in your own Base
            gene vault.
          </p>
        </div>
        <HelixArt />
      </section>

      <section className="walletPanel">
        <div>
          <span className="label">Wallet</span>
          <strong>{isConnected ? shortAddress(address) : "Not connected"}</strong>
        </div>
        {isConnected ? (
          <button
            className="iconButton"
            aria-label="Disconnect wallet"
            title="Disconnect wallet"
            onClick={() => {
              window.localStorage.setItem("dnaforge:autoConnectSkipped", "1");
              disconnect();
            }}
          >
            <Power size={18} />
          </button>
        ) : null}
      </section>

      {!isConnected ? (
        <section className="connectPanel">
          <button
            className="primaryButton"
            disabled={isConnecting}
            onClick={() => setWalletPickerOpen(true)}
          >
            {isConnecting ? <Loader2 className="spin" size={19} /> : <Wallet size={19} />}
            Connect Wallet
          </button>
          <p className="microcopy">Supports Coinbase Wallet, MetaMask, OKX, and injected wallets.</p>
        </section>
      ) : null}

      {walletPickerOpen ? (
        <div className="modalBackdrop" role="presentation" onClick={() => setWalletPickerOpen(false)}>
          <section
            className="walletPicker"
            role="dialog"
            aria-modal="true"
            aria-label="Choose wallet"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modalHeader">
              <div>
                <span className="label">Choose wallet</span>
                <strong>Connect to DNAForge</strong>
              </div>
              <button
                className="iconButton"
                aria-label="Close wallet picker"
                title="Close"
                onClick={() => setWalletPickerOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <button
              className="walletChoice"
              disabled={isConnecting || !coinbaseConnector}
              onClick={() => connectWallet("coinbaseWalletSDK")}
            >
              <span className="walletMark coinbase">C</span>
              <span>
                <strong>Coinbase Wallet</strong>
                <small>Best for Base App and Coinbase Wallet users.</small>
              </span>
              <CheckCircle2 size={18} />
            </button>
            <button
              className="walletChoice"
              disabled={isConnecting || !injectedConnector}
              onClick={() => connectWallet("injected")}
            >
              <span className="walletMark injected">W</span>
              <span>
                <strong>Browser Wallet</strong>
                <small>Use MetaMask, OKX, or another injected wallet.</small>
              </span>
              <CheckCircle2 size={18} />
            </button>
          </section>
        </div>
      ) : null}

      {connectedWrongChain ? (
        <section className="alert">Switch your wallet to Base to write DNA.</section>
      ) : null}

      {tab === "lab" ? (
        <LabView
          sequence={sequence}
          setSequence={setSequence}
          speciesName={speciesName}
          setSpeciesName={setSpeciesName}
          count={count}
          interactions={interactions}
          busy={busy}
          txLabel={txLabel}
          isConnected={isConnected}
          onPrimaryAction={primaryAction}
        />
      ) : (
        <GenomeView
          count={count}
          interactions={interactions}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          secondId={secondId}
          setSecondId={setSecondId}
          editSequence={editSequence}
          setEditSequence={setEditSequence}
          editSpecies={editSpecies}
          setEditSpecies={setEditSpecies}
          dna={dna}
          busy={busy}
          txLabel={txLabel}
          onWrite={onWrite}
        />
      )}

      <nav className="bottomNav" aria-label="Main navigation">
        <button
          className={tab === "lab" ? "active" : ""}
          onClick={() => setTab("lab")}
        >
          <FlaskConical size={18} />
          Lab
        </button>
        <button
          className={tab === "genome" ? "active" : ""}
          onClick={() => setTab("genome")}
        >
          <Dna size={18} />
          Genome
        </button>
      </nav>
    </main>
  );
}

function LabView({
  sequence,
  setSequence,
  speciesName,
  setSpeciesName,
  count,
  interactions,
  busy,
  txLabel,
  isConnected,
  onPrimaryAction,
}: {
  sequence: string;
  setSequence: (value: string) => void;
  speciesName: string;
  setSpeciesName: (value: string) => void;
  count: number;
  interactions: number;
  busy: boolean;
  txLabel: string;
  isConnected: boolean;
  onPrimaryAction: () => void;
}) {
  return (
    <section className="card stack">
      <div className="rewardGrid">
        <Metric icon={<Dna size={19} />} label="DNA forged" value={count} />
        <Metric icon={<Activity size={19} />} label="Lab actions" value={interactions} />
      </div>
      <div className="forgeBox">
        <label>
          Sequence
          <input value={sequence} onChange={(event) => setSequence(event.target.value)} />
        </label>
        <label>
          Species
          <input value={speciesName} onChange={(event) => setSpeciesName(event.target.value)} />
        </label>
      </div>
      <button
        className="primaryButton large"
        disabled={!isConnected || busy || !sequence.trim()}
        onClick={onPrimaryAction}
      >
        {busy ? <Loader2 className="spin" size={20} /> : <Sparkles size={20} />}
        {busy ? txLabel : "Forge DNA"}
      </button>
      <p className="microcopy">Your first transaction creates a new onchain DNA record instantly.</p>
    </section>
  );
}

function GenomeView({
  count,
  interactions,
  selectedId,
  setSelectedId,
  secondId,
  setSecondId,
  editSequence,
  setEditSequence,
  editSpecies,
  setEditSpecies,
  dna,
  busy,
  txLabel,
  onWrite,
}: {
  count: number;
  interactions: number;
  selectedId: string;
  setSelectedId: (value: string) => void;
  secondId: string;
  setSecondId: (value: string) => void;
  editSequence: string;
  setEditSequence: (value: string) => void;
  editSpecies: string;
  setEditSpecies: (value: string) => void;
  dna: DNARecord | null;
  busy: boolean;
  txLabel: string;
  onWrite: (label: string, functionName: any, args: readonly unknown[]) => void;
}) {
  const id = BigInt(Number(selectedId) || 0);
  const second = BigInt(Number(secondId) || 0);

  return (
    <section className="card stack">
      <div className="rewardGrid">
        <Metric icon={<Atom size={19} />} label="Gene vault" value={count} />
        <Metric icon={<Sparkles size={19} />} label="Rewards seen" value={interactions} />
      </div>
      <div className="forgeBox two">
        <label>
          DNA ID
          <input value={selectedId} inputMode="numeric" onChange={(event) => setSelectedId(event.target.value)} />
        </label>
        <label>
          Fuse with
          <input value={secondId} inputMode="numeric" onChange={(event) => setSecondId(event.target.value)} />
        </label>
      </div>
      <div className="dnaReadout">
        <span className={dna?.exists ? "status live" : "status"}>{dna?.exists ? "Live sequence" : "No sequence"}</span>
        <strong>{dna?.exists ? dna.sequence : "Forge DNA to populate this slot"}</strong>
        <small>
          {dna?.exists
            ? `${dna.species} · Gen ${dna.generation.toString()} · ${dna.mutationCount.toString()} mutations`
            : "Your lab starts empty and has no daily limits."}
        </small>
      </div>
      <div className="forgeBox">
        <label>
          New sequence
          <input value={editSequence} onChange={(event) => setEditSequence(event.target.value)} />
        </label>
        <label>
          New species
          <input value={editSpecies} onChange={(event) => setEditSpecies(event.target.value)} />
        </label>
      </div>
      <div className="actionGrid">
        <button disabled={busy || count < 1} onClick={() => onWrite("Mutating DNA", "mutateDNA", [id, randomItem(mutationTags)])}>
          <Sparkles size={18} />
          Mutate
        </button>
        <button disabled={busy || count < 2} onClick={() => onWrite("Fusing DNA", "fuseDNA", [id, second])}>
          <GitFork size={18} />
          Fuse
        </button>
        <button disabled={busy || count < 1 || !editSequence.trim()} onClick={() => onWrite("Editing DNA", "editDNA", [id, editSequence, editSpecies])}>
          <Pencil size={18} />
          Edit
        </button>
        <button disabled={busy || count < 1} onClick={() => onWrite("Deleting DNA", "deleteDNA", [id])}>
          <Trash2 size={18} />
          Delete
        </button>
      </div>
      <button className="secondaryButton" disabled={busy || count < 1} onClick={() => onWrite("Resetting lab", "resetLab", [])}>
        {busy ? <Loader2 className="spin" size={18} /> : <RefreshCcw size={18} />}
        {busy ? txLabel : "Reset Lab"}
      </button>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function HelixArt() {
  const rungs = Array.from({ length: 10 }, (_, index) => index);
  return (
    <div className="helixWrap" aria-hidden="true">
      <div className="orbit one" />
      <div className="orbit two" />
      <div className="helix">
        {rungs.map((item) => (
          <i key={item} style={{ "--i": item } as React.CSSProperties}>
            <b />
          </i>
        ))}
      </div>
      <X className="star s1" size={18} />
      <X className="star s2" size={15} />
      <X className="star s3" size={20} />
    </div>
  );
}
