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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 z-50 overflow-y-auto">
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

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden relative my-auto max-h-[95vh]">
        <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse z-10 uppercase tracking-wide">
          Ultra Raro
        </div>

        <div className="absolute top-2 right-2 z-10">
          <div className="flex gap-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse" />
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse" style={{ animationDelay: '0.1s' }} />
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>

        <div className="bg-accent p-3 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/80"></div>
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1.5 animate-bounce">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white mb-0.5">🎉 PARABÉNS! 🎉</h1>
            <p className="text-white/90 text-sm">Você ganhou um iPhone!</p>
          </div>
        </div>

        <div className="p-3 text-center overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-3 mb-3 border-2 border-yellow-400/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/10 rounded-full blur-xl"></div>

            <div className="relative">
              <div className="mb-1.5 flex justify-center">
                <div className="relative">
                  <img
                    src="/iphone_13_PNG31.png"
                    alt="iPhone 13 Pro Max"
                    className="w-20 h-20 object-contain drop-shadow-2xl"
                  />
                  <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full animate-pulse">
                    NOVO
                  </div>
                </div>
              </div>

              <h2 className="text-sm font-bold text-white mb-0.5">iPhone 13 Pro Max</h2>
              <p className="text-gray-300 text-[11px] mb-1.5">128GB - Cor: Prata</p>

              <div className="bg-accent text-white px-2.5 py-1 rounded-full text-sm font-bold inline-block shadow-lg">
                R$ 4.899,00
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-2 mb-3">
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-yellow-600" />
              <span className="font-bold text-yellow-800 text-[11px]">Prêmio Especial</span>
            </div>
            <p className="text-yellow-700 text-[10px] font-medium">
              Apenas 0.01% dos jogadores ganham!
            </p>
          </div>

          <div className="flex justify-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5 text-xs text-gray-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200">
              <ShieldCheck className="w-2.5 h-2.5 text-green-500" />
              <span className="font-medium text-[10px]">Verificado</span>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-gray-600 bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-200">
              <Award className="w-2.5 h-2.5 text-purple-500" />
              <span className="font-medium text-[10px]">Premium</span>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-gray-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">
              <Sparkles className="w-2.5 h-2.5 text-blue-500" />
              <span className="font-medium text-[10px]">Exclusivo</span>
            </div>
          </div>

          <button
            onClick={handleClaimPrize}
            className="w-full bg-accent text-white font-bold py-2.5 rounded-2xl hover:bg-accent-hover transition-all duration-300 active:scale-95 shadow-modern"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">ADICIONAR AO SALDO</span>
            </div>
          </button>

          <p className="text-center text-[10px] text-gray-500 mt-1.5 font-medium">
            O valor será creditado instantaneamente
          </p>
        </div>
      </div>
    </div>
  );
};
