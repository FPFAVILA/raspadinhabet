import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { trackRegistration } from '../utils/tracking';
import {
  Gift,
  Crown,
  Clock,
  Mail,
  User as UserIcon,
  Shield,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';

interface RegistrationFormProps {
  onRegister: (user: User) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister }) => {
  const [timeLeft, setTimeLeft] = useState(900);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerUrgency = () => {
    if (timeLeft <= 180) return 'critical';
    if (timeLeft <= 300) return 'high';
    if (timeLeft <= 600) return 'medium';
    return 'low';
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value.trim().length < 3) {
          newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
        } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
          newErrors.name = 'Nome deve conter apenas letras';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Email inválido';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value.trim()) {
          newErrors.password = 'Senha é obrigatória';
        } else if (value.length < 6) {
          newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = { name: true, email: true, password: true };
    setTouched(allTouched);

    validateField('name', formData.name);
    validateField('email', formData.email);
    validateField('password', formData.password);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const user: User = {
      id: `user_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      registeredAt: new Date()
    };

    setShowSuccess(true);

    trackRegistration({
      name: user.name,
      email: user.email
    });

    setTimeout(() => {
      onRegister(user);
    }, 2500);

    setIsSubmitting(false);
  };

  const timerUrgency = getTimerUrgency();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-br from-accent via-accent to-accent-hover rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl border-2 border-yellow-400 animate-scale-in">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-yellow-400/30 rounded-full blur-3xl animate-pulse" />
            </div>

            <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-2xl">
              Parabéns!
            </h2>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="w-6 h-6 text-yellow-300 animate-bounce" />
                <span className="text-white font-bold text-lg">Seu Bônus:</span>
              </div>
              <div className="text-5xl font-bold text-white drop-shadow-2xl mb-1">
                R$ 14,70
              </div>
              <div className="text-white/90 font-semibold">
                + 3 Raspadinhas Grátis
              </div>
            </div>

            <p className="text-white/90 text-sm mb-4">
              Seu cadastro foi concluído com sucesso!
            </p>

            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}

      <div className={`w-full max-w-md relative transition-opacity duration-500 ${showSuccess ? 'opacity-0' : 'opacity-100'}`}>
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
          <div className="relative bg-gradient-to-br from-accent via-accent to-accent-hover p-6 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-3 shadow-2xl border-2 border-white/30">
                <Crown className="w-8 h-8 text-yellow-300 drop-shadow-2xl animate-pulse" />
              </div>

              <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-2xl">
                Ganhe até <span className="text-yellow-300">R$ 5.000</span>
              </h1>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/30 shadow-2xl mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-white font-bold text-sm uppercase tracking-wide">Bônus de Cadastro</span>
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
                </div>

                <div className="text-4xl font-bold text-white mb-2 drop-shadow-2xl">
                  R$ 14,70
                </div>

                <div className="flex items-center justify-center gap-2 text-white/90 font-semibold">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span>3 Raspadinhas Grátis</span>
                </div>
              </div>

              <div className={`rounded-xl p-3 border-2 ${
                timerUrgency === 'critical' ? 'bg-red-500/20 border-red-400 animate-pulse' :
                timerUrgency === 'high' ? 'bg-orange-500/20 border-orange-400' :
                'bg-white/10 border-white/30'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <Clock className={`w-5 h-5 text-white ${timerUrgency === 'critical' ? 'animate-bounce' : ''}`} />
                  <span className="text-white font-bold text-sm">
                    {timerUrgency === 'critical' ? 'ÚLTIMOS MINUTOS!' : 'Oferta expira em:'}
                  </span>
                  <span className="font-mono font-bold text-white text-lg bg-white/20 px-3 py-1 rounded-lg">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                  <UserIcon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 transition-colors ${
                    focusedField === 'name' ? 'text-accent' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => handleFieldBlur('name')}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-800 rounded-xl border-2 transition-all text-white placeholder-gray-400 focus:outline-none ${
                      errors.name && touched.name
                        ? 'border-red-500 bg-red-500/10'
                        : focusedField === 'name'
                        ? 'border-accent bg-gray-800 shadow-lg shadow-accent/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                  />
                  {formData.name && !errors.name && touched.name && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                  )}
                </div>
                {errors.name && touched.name && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

              <div>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 transition-colors ${
                    focusedField === 'email' ? 'text-accent' : 'text-gray-400'
                  }`} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => handleFieldBlur('email')}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-800 rounded-xl border-2 transition-all text-white placeholder-gray-400 focus:outline-none ${
                      errors.email && touched.email
                        ? 'border-red-500 bg-red-500/10'
                        : focusedField === 'email'
                        ? 'border-accent bg-gray-800 shadow-lg shadow-accent/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    placeholder="seu@email.com"
                    inputMode="email"
                    autoComplete="email"
                  />
                  {formData.email && !errors.email && touched.email && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                  )}
                </div>
                {errors.email && touched.email && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                  <Shield className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 transition-colors ${
                    focusedField === 'password' ? 'text-accent' : 'text-gray-400'
                  }`} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => handleFieldBlur('password')}
                    className={`w-full pl-12 pr-12 py-4 bg-gray-800 rounded-xl border-2 transition-all text-white placeholder-gray-400 focus:outline-none ${
                      errors.password && touched.password
                        ? 'border-red-500 bg-red-500/10'
                        : focusedField === 'password'
                        ? 'border-accent bg-gray-800 shadow-lg shadow-accent/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    placeholder="Crie sua senha (mínimo 6 caracteres)"
                    autoComplete="new-password"
                  />
                  {formData.password && !errors.password && touched.password && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                  )}
                </div>
                {errors.password && touched.password && (
                  <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || timeLeft === 0}
                className="w-full bg-gradient-to-r from-accent via-accent to-accent-hover text-white font-bold py-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-accent/50 relative overflow-hidden group mt-6"
                style={{ touchAction: 'manipulation' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                <div className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-lg">Processando...</span>
                    </>
                  ) : timeLeft === 0 ? (
                    <span className="text-lg">Oferta Expirada</span>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 animate-pulse" />
                      <span className="text-lg drop-shadow-lg">
                        {timerUrgency === 'critical' ? 'GARANTIR AGORA!' : 'COMEÇAR A GANHAR'}
                      </span>
                      <Zap className="w-6 h-6 animate-pulse" />
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Shield className="w-4 h-4 text-accent" />
              <span>Seus dados estão protegidos e seguros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
