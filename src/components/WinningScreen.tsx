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
  const prizeValue = 4899.00;

  useEffect(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    const confettiTimeout = setTimeout(() => setConfetti(false), 8000);

    return () => {
      clearTimeout(confettiTimeout);
    };
  }, []);

  const handleClaimPrize = () => {
    onAddToBalance(prizeValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 z-50 overflow-y-auto">
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-20">
          {Array.from({ length: 120 }).map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${
                i % 6 === 0 ? 'w-4 h-4 bg-yellow-400 animate-bounce' :
                i % 6 === 1 ? 'w-3 h-3 bg-accent animate-pulse' :
                i % 6 === 2 ? 'w-5 h-5 bg-yellow-300 animate-bounce' :
                i % 6 === 3 ? 'w-3 h-3 bg-orange-400 animate-spin' :
                i % 6 === 4 ? 'w-4 h-4 bg-yellow-500 animate-pulse' :
                'w-2 h-2 bg-orange-300 animate-bounce'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95%] sm:max-w-sm overflow-hidden relative my-2">
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

        <div className="bg-gradient-to-br from-accent via-accent to-accent-hover p-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ animationDuration: '2s' }} />

          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce border-2 border-white/50">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1 drop-shadow-lg">GRANDE PRÊMIO!</h1>
            <p className="text-white/90 text-xs font-semibold">Você ganhou um prêmio RARÍSSIMO!</p>
          </div>
        </div>

        <div className="p-4 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 mb-3 border-2 border-yellow-400/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl"></div>

            <div className="relative">
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <img
                    src="/iphone_13_PNG31.png"
                    alt="iPhone 13 Pro Max"
                    className="w-28 h-28 object-contain drop-shadow-2xl"
                  />
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    NOVO
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white mb-0.5">iPhone 13 Pro Max</h2>
              <p className="text-gray-300 text-xs mb-2">128GB - Cor: Prata</p>

              <div className="bg-accent text-white px-3 py-1.5 rounded-full text-base font-bold inline-block shadow-lg">
                R$ 4.899,00
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-2.5 mb-3">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-yellow-800 text-xs">Prêmio Especial</span>
            </div>
            <p className="text-yellow-700 text-xs font-medium leading-relaxed">
              Apenas 0.01% dos jogadores ganham este prêmio!
            </p>
          </div>

          <div className="flex justify-center gap-1.5 mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="font-medium">Verificado</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-200">
              <Award className="w-3 h-3 text-purple-500" />
              <span className="font-medium">Premium</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="font-medium">Exclusivo</span>
            </div>
          </div>

          <button
            onClick={handleClaimPrize}
            className="w-full bg-gradient-to-r from-accent via-accent to-accent-hover text-white font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-all active:scale-95 shadow-2xl relative overflow-hidden group"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

            <div className="relative flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 animate-bounce" />
              <span>ADICIONAR AO SALDO</span>
              <Trophy className="w-5 h-5 animate-bounce" />
            </div>
          </button>

          <p className="text-center text-xs text-gray-500 mt-2">
            O valor será creditado instantaneamente
          </p>
        </div>
      </div>
    </div>
  );
};
