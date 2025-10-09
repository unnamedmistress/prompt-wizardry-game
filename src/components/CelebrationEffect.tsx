import { useEffect, useState } from "react";
import { Sparkles, Coins, Star } from "lucide-react";

interface CelebrationEffectProps {
  type: "coins" | "stars";
  amount: number;
  onComplete?: () => void;
}

export const CelebrationEffect = ({ type, amount, onComplete }: CelebrationEffectProps) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      delay: i * 0.05,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const Icon = type === "coins" ? Coins : Star;
  const color = type === "coins" ? "text-amber-500" : "text-yellow-400";

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      {/* Main celebration icon */}
      <div className="relative">
        <div className="animate-bounce-in">
          <Icon className={`w-16 h-16 ${color} drop-shadow-lg`} />
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-bounce-in">
            +{amount}
          </div>
        </div>

        {/* Particle burst */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute top-1/2 left-1/2 animate-confetti-burst"
            style={{
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
        ))}
      </div>
    </div>
  );
};
