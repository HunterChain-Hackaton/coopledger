'use client';

import { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RiLeafLine, RiSunLine, RiShieldCheckLine } from 'react-icons/ri';
import { Phone, ArrowRight, RefreshCw } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button, showToast } from '@/components/ui';

type Step = 'phone' | 'otp';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { theme, toggle } = useTheme();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isDry = theme === 'dry';
  const accentColor = isDry ? '#f07a2a' : '#059669';

  // Countdown for resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  async function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = phone.replace(/\s/g, '').replace(/^00/, '+');
    if (cleaned.length < 8) {
      showToast('Numéro de téléphone invalide', 'error');
      return;
    }
    setLoading(true);
    try {
      await authApi.requestOtp(cleaned);
      setStep('otp');
      setCountdown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Erreur lors de l\'envoi du SMS';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      showToast('Code OTP incomplet', 'error');
      return;
    }
    setLoading(true);
    try {
      const cleaned = phone.replace(/\s/g, '').replace(/^00/, '+');
      await login(cleaned, code);
      showToast('Connexion réussie', 'success');
      router.push('/dashboard');
    } catch {
      showToast('Code OTP incorrect ou expiré', 'error');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    const cleaned = phone.replace(/\s/g, '').replace(/^00/, '+');
    try {
      await authApi.requestOtp(cleaned);
      setCountdown(60);
      showToast('Nouveau code envoyé', 'info');
    } catch {
      showToast('Erreur lors du renvoi', 'error');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)',
      backgroundImage: isDry
        ? 'radial-gradient(ellipse at 30% 70%, rgba(240,122,42,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(180,80,20,0.06) 0%, transparent 55%)'
        : 'radial-gradient(ellipse at 30% 70%, rgba(5,150,105,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.04) 0%, transparent 55%)',
    }}>
      {/* Left panel — visual */}
      <div className="hidden lg:flex flex-col justify-between p-12" style={{ width: '42%', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 12, background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDry ? <RiSunLine size={22} color="white" /> : <RiLeafLine size={22} color="white" />}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif' }}>CoopLedger</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>BLOCKCHAIN · TOGO</div>
          </div>
        </div>

        {/* Main visual content */}
        <div>
          <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 20 }}>
            La transparence financière,{' '}
            <span style={{ color: accentColor }}>mathématiquement garantie.</span>
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
            Chaque transaction enregistrée sur la blockchain Polygon. Aucun trésorier, aucun président ne peut modifier une donnée validée.
          </p>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            {[
              { label: 'Transactions immuables', value: '34+', icon: RiShieldCheckLine },
              { label: 'Membres actifs', value: '12', icon: null },
              { label: 'Réseau Polygon Amoy', value: 'Actif', icon: null },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-4 card" style={{ borderRadius: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, flexShrink: 0, boxShadow: `0 0 8px ${accentColor}` }} />
                <span style={{ flex: 1, fontSize: 14, color: 'var(--text-secondary)' }}>{s.label}</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ODD badges */}
        <div className="flex gap-2 flex-wrap">
          {['ODD 1 · Fin de la pauvreté', 'ODD 16 · Institutions', 'ODD 17 · Partenariats'].map((o) => (
            <span key={o} className="badge badge-muted" style={{ fontSize: 11 }}>{o}</span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div style={{ width: 44, height: 44, borderRadius: 12, background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isDry ? <RiSunLine size={22} color="white" /> : <RiLeafLine size={22} color="white" />}
          </div>
          <div style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-primary)' }}>CoopLedger</div>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Theme toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggle}
              className="flex items-center gap-2"
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 14px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}
            >
              {isDry ? <RiSunLine size={14} /> : <RiLeafLine size={14} />}
              {isDry ? 'Saison sèche' : 'Saison des pluies'}
            </button>
          </div>

          <div className="animate-fadeIn">
            {step === 'phone' ? (
              <>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontFamily: 'Sora, sans-serif' }}>
                  Connexion
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
                  Entrez votre numéro de téléphone pour recevoir votre code OTP par SMS.
                </p>

                <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="input-label">Numéro de téléphone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        className="input"
                        style={{ paddingLeft: 42 }}
                        placeholder="+228 90 00 00 00"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" loading={loading} icon={<ArrowRight size={18} />} style={{ width: '100%' }}>
                    Recevoir le code SMS
                  </Button>
                </form>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setStep('phone'); setOtp(['','','','','','']); }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14, marginBottom: 16, fontFamily: 'Sora, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  ← Retour
                </button>

                <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  Code OTP
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 32 }}>
                  Code à 6 chiffres envoyé au{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{phone}</strong>
                </p>

                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        className="otp-input"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      />
                    ))}
                  </div>

                  <Button type="submit" size="lg" loading={loading} style={{ width: '100%' }}>
                    Vérifier et se connecter
                  </Button>
                </form>

                <div className="text-center mt-6">
                  {countdown > 0 ? (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Renvoyer dans {countdown}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="flex items-center gap-2 mx-auto"
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 14 }}
                    >
                      <RefreshCw size={14} /> Renvoyer le code
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 40 }}>
            MIABE Hackathon 2026 · Hunter Chain TG-35 · Projet T-02
          </p>
        </div>
      </div>
    </div>
  );
}
