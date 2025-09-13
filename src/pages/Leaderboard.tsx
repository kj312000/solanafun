import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const TIP_JAR_ADDRESS = new PublicKey(
  "HNy6JmksrCt3PhL3VGcqZ726NC5XnoEjuCa8cfZEQytN"
);

type Leader = {
  wallet: string;
  amount: number;
};

export default function Leaderboard() {
  const { connection } = useConnection();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const sigs = await connection.getSignaturesForAddress(TIP_JAR_ADDRESS, { limit: 50 });
        const txs = await Promise.all(
          sigs.map((s) => connection.getTransaction(s.signature, { commitment: "confirmed" }))
        );

        const donations: Record<string, number> = {};

        for (const tx of txs) {
          if (!tx || !tx.meta) continue;

          const keys = tx.transaction.message.accountKeys.map((k) => k.toBase58());
          const jarIndex = keys.indexOf(TIP_JAR_ADDRESS.toBase58());
          if (jarIndex === -1) continue;

          const pre = tx.meta.preBalances[jarIndex];
          const post = tx.meta.postBalances[jarIndex];
          const delta = post - pre;

          if (delta > 0) {
            // find sender (any account with negative delta)
            const senderIndex = tx.meta.preBalances.findIndex(
              (b, i) => tx.meta && tx.meta.postBalances[i] !== undefined && tx.meta.postBalances[i] < b
            );

            const sender = senderIndex >= 0 ? keys[senderIndex] : "Unknown";
            const amountSOL = delta / LAMPORTS_PER_SOL;

            donations[sender] = (donations[sender] || 0) + amountSOL;
          }
        }

        // Convert to array & sort
        const sorted = Object.entries(donations)
          .map(([wallet, amount]) => ({ wallet, amount }))
          .sort((a, b) => b.amount - a.amount);

        setLeaders(sorted);
      } catch (err) {
        console.error("Error building leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [connection]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🏆 Top Tippers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : leaders.length === 0 ? (
        <p>No tips found yet.</p>
      ) : (
        <ul className="space-y-3">
          {leaders.map((l, i) => (
            <li key={i} className="bg-white/10 rounded-xl px-4 py-3 flex justify-between">
              <span>
                {i + 1}. {l.wallet.slice(0, 6)}...{l.wallet.slice(-6)}
              </span>
              <span className="font-mono">{l.amount.toFixed(3)} SOL</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
