import React, { useEffect, useState } from 'react';
import { Trophy, ShieldCheck, Sparkles, Award, Zap, Star } from 'lucide-react';
import { User } from '../types';

interface WinningScreenProps {
  user: User;
  onClose: () => void;
  onAddToBalance: (amount: number) => void;
}

export const WinningScreen: React.FC<WinningScreenProps> = ({ user, onClose, onAddToBalance }) => {
  const [confetti, setConfetti] = useState(true);
  const [showCelebration, setShowCelebration] = useState(true);
  const prizeValue = 4899.00;

  useEffect(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    const confettiTimeout = setTimeout(() => setConfetti(false), 6000);
    const celebrationTimeout = setTimeout(() => setShowCelebration(false), 3000);

    return () => {
      clearTimeout(confettiTimeout);
      clearTimeout(celebrationTimeout);
    };
  }, []);

  const handleClaimPrize = () => {
    onAddToBalance(prizeValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 z-50">
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-bounce ${
                i % 5 === 0 ? 'w-3 h-3 bg-yellow-400' :
                i % 5 === 1 ? 'w-2 h-2 bg-accent' :
                i % 5 === 2 ? 'w-4 h-4 bg-yellow-300' :
                i % 5 === 3 ? 'w-2 h-2 bg-orange-400' : 'w-3 h-3 bg-yellow-500'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      )}

      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="text-7xl mb-3">🎉</div>
            <div className="text-5xl font-bold text-white drop-shadow-2xl animate-pulse">
              PARABÉNS!
            </div>
            <div className="text-xl text-yellow-300 mt-2 animate-pulse font-bold">
              PRÊMIO ULTRA RARO!
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative">
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse z-10">
          ULTRA RARO
        </div>

        <div className="absolute top-2 right-2 z-10">
          <div className="flex gap-0.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent via-accent to-accent-hover p-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDuration: '2s' }} />

          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce border-2 border-white/50">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">GRANDE PRÊMIO!</h1>
            <p className="text-white/90 text-sm font-semibold">Você ganhou um prêmio RARÍSSIMO!</p>
          </div>
        </div>

        <div className="p-5 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 mb-4 border-2 border-yellow-400/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>

            <div className="relative">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <img
                    src="/iphone_13_PNG31.png"
                    alt="iPhone 13 Pro Max"
                    className="w-32 h-32 object-contain drop-shadow-2xl"
                  />
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    NOVO
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">iPhone 13 Pro Max</h2>
              <p className="text-gray-300 text-sm mb-3">128GB - Cor: Prata</p>

              <div className="bg-accent text-white px-4 py-2 rounded-full text-lg font-bold inline-block shadow-lg">
                R$ 4.899,00
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-800 text-sm">Prêmio Especial</span>
            </div>
            <p className="text-yellow-700 text-xs font-medium leading-relaxed">
              Apenas 0.01% dos jogadores ganham este prêmio! Você é um dos sortudos!
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span className="font-medium">Verificado</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
              <Award className="w-3.5 h-3.5 text-purple-500" />
              <span className="font-medium">Premium</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-medium">Exclusivo</span>
            </div>
          </div>

          <button
            onClick={handleClaimPrize}
            className="w-full bg-gradient-to-r from-accent via-accent to-accent-hover text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-all active:scale-95 shadow-2xl relative overflow-hidden group"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

            <div className="relative flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 animate-bounce" />
              <span>ADICIONAR AO SALDO</span>
              <Trophy className="w-5 h-5 animate-bounce" />
            </div>
          </button>

          <p className="text-center text-xs text-gray-500 mt-3">
            O valor será creditado instantaneamente
          </p>
        </div>
      </div>
    </div>
  );
};
