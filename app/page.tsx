"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAccount } from "wagmi";
import styles from "./page.module.css";

const UPGRADES = [
  { id: "miner",   label: "⛏️ Miner",   baseCost: 10,   cps: 1,   description: "+1 coin/sec" },
  { id: "factory", label: "🏭 Factory", baseCost: 100,  cps: 10,  description: "+10 coins/sec" },
  { id: "robot",   label: "🤖 Robot",   baseCost: 1000, cps: 100, description: "+100 coins/sec" },
];

function upgradeCost(baseCost: number, owned: number) {
  return Math.floor(baseCost * Math.pow(1.15, owned));
}

interface GameState {
  coins: number;
  totalClicks: number;
  owned: Record<string, number>;
}

const INITIAL_STATE: GameState = { coins: 0, totalClicks: 0, owned: { miner: 0, factory: 0, robot: 0 } };

function loadState(): GameState {
  try {
    const saved = localStorage.getItem("clicker-game-state");
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_STATE;
}

export default function Home() {
  const { address } = useAccount();
  const [coins, setCoins] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [owned, setOwned] = useState<Record<string, number>>({ miner: 0, factory: 0, robot: 0 });
  const [clickEffect, setClickEffect] = useState(false);
  const stateRef = useRef({ coins, owned });

  // Load saved state on mount
  useEffect(() => {
    const s = loadState();
    setCoins(s.coins);
    setTotalClicks(s.totalClicks);
    setOwned(s.owned);
  }, []);

  // Keep ref in sync for use inside intervals
  useEffect(() => {
    stateRef.current = { coins, owned };
  }, [coins, owned]);

  // Save state whenever it changes
  useEffect(() => {
    const state: GameState = { coins, totalClicks, owned };
    localStorage.setItem("clicker-game-state", JSON.stringify(state));
  }, [coins, totalClicks, owned]);

  // Passive income tick (every 100ms = 10 ticks/sec)
  useEffect(() => {
    const interval = setInterval(() => {
      const cps = UPGRADES.reduce((sum, u) => sum + u.cps * (stateRef.current.owned[u.id] || 0), 0);
      if (cps > 0) {
        setCoins(c => c + cps / 10);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback(() => {
    setCoins(c => c + 1);
    setTotalClicks(t => t + 1);
    setClickEffect(true);
    setTimeout(() => setClickEffect(false), 100);
  }, []);

  const buyUpgrade = useCallback((id: string, baseCost: number) => {
    const currentOwned = stateRef.current.owned[id] || 0;
    const cost = upgradeCost(baseCost, currentOwned);
    if (stateRef.current.coins >= cost) {
      setCoins(c => c - cost);
      setOwned(o => ({ ...o, [id]: (o[id] || 0) + 1 }));
    }
  }, []);

  const coinsPerSec = UPGRADES.reduce((sum, u) => sum + u.cps * (owned[u.id] || 0), 0);
  const displayCoins = Math.floor(coins);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.greeting}>
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Base Clicker"}
        </p>
        <div className={styles.coinCount}>{displayCoins.toLocaleString()}</div>
        <div className={styles.cps}>
          {coinsPerSec > 0 ? `${coinsPerSec}/sec` : `${totalClicks} clicks`}
        </div>
      </div>

      <div className={styles.clickArea}>
        <button
          className={`${styles.clickButton} ${clickEffect ? styles.clicked : ""}`}
          onClick={handleClick}
          aria-label="Click to earn coins"
        >
          🔵
        </button>
      </div>

      <div className={styles.upgrades}>
        {UPGRADES.map(u => {
          const count = owned[u.id] || 0;
          const cost = upgradeCost(u.baseCost, count);
          const canAfford = coins >= cost;
          return (
            <button
              key={u.id}
              className={`${styles.upgradeBtn} ${canAfford ? styles.canAfford : ""}`}
              onClick={() => buyUpgrade(u.id, u.baseCost)}
              disabled={!canAfford}
            >
              <span className={styles.upgradeLabel}>{u.label}</span>
              <span className={styles.upgradeDesc}>{u.description}</span>
              <span className={styles.upgradeCost}>💰 {cost.toLocaleString()}</span>
              {count > 0 && <span className={styles.upgradeCount}>{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
