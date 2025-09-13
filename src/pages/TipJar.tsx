import React, { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const TIP_JAR_ADDRESS = new PublicKey(
  "HNy6JmksrCt3PhL3VGcqZ726NC5XnoEjuCa8cfZEQytN"
);

export default function Tipjar() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();

  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [jarBalance, setJarBalance] = useState<number | null>(null);
  const [amount, setAmount] = useState(0.01);
  const [pending, setPending] = useState(false);
  const [lastSig, setLastSig] = useState<string | null>(null);

  const refreshBalances = useCallback(async () => {
    if (publicKey) {
      const b = await connection.getBalance(publicKey);
      setWalletBalance(b / LAMPORTS_PER_SOL);
    }
    const jar = await connection.getBalance(TIP_JAR_ADDRESS);
    setJarBalance(jar / LAMPORTS_PER_SOL);
  }, [connection, publicKey]);

  useEffect(() => {
    refreshBalances();
  }, [refreshBalances]);

  const sendTip = useCallback(async () => {
    if (!publicKey) return alert("Connect wallet first.");
    setPending(true);
    try {
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: TIP_JAR_ADDRESS,
          lamports: Math.floor(amount * LAMPORTS_PER_SOL),
        })
      );

      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight });

      setLastSig(sig);
      await refreshBalances();
    } catch (err) {
      console.error(err);
      alert("Failed to send tip. Check console for details.");
    } finally {
      setPending(false);
    }
  }, [publicKey, sendTransaction, connection, amount, refreshBalances]);

  return (
    <div className="min-h-full flex flex-col items-center justify-start py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
        💸 Solana Tip Jar
      </h1>

      <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-colors px-4 py-2 rounded-xl shadow-lg mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-2">
        {/* Wallet card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold mb-2">Your Wallet</h2>
          <p className="break-all text-sm">
            {publicKey ? publicKey.toBase58() : "Not connected"}
          </p>
          <p className="mt-2 text-lg">
            Balance:{" "}
            <span className="font-mono">
              {walletBalance !== null ? `${walletBalance.toFixed(3)} SOL` : "—"}
            </span>
          </p>
        </div>

        {/* Tip jar card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold mb-2">Tip Creator...</h2>
          <p className="break-all text-sm">{TIP_JAR_ADDRESS.toBase58()}</p>
          <p className="mt-2 text-lg">
            Balance:{" "}
            <span className="font-mono">
              {jarBalance !== null ? `${jarBalance.toFixed(3)} SOL` : "—"}
            </span>
          </p>
        </div>
      </div>

      {/* Tip input */}
      <div className="mt-8 w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-lg font-semibold mb-4">Send a Tip</h2>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            step={0.001}
            min={0.001}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={sendTip}
            disabled={!connected || pending}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            {pending ? "Sending..." : "Send Tip"}
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          {[0.01, 0.05, 0.1].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className="px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 transition text-sm"
            >
              {amt} SOL
            </button>
          ))}
        </div>
      </div>

      {/* Last TX */}
      {lastSig && (
        <div className="mt-6 bg-white/10 rounded-xl p-4 shadow-md max-w-lg">
          <p className="text-sm">✅ Last tip sent:</p>
          <a
            href={`https://explorer.solana.com/tx/${lastSig}?cluster=testnet`}
            target="_blank"
            rel="noreferrer"
            className="text-purple-300 underline break-all"
          >
            {lastSig}
          </a>
        </div>
      )}
    </div>
  );
}
