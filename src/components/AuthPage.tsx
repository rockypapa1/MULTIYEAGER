import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Mail, Lock, Chrome, Shield, Zap, Clock, Ghost, MonitorPlay } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. If you don\'t have an account, please click "Sign Up" below first.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please switch to "Login".');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection or disable ad-blockers/Brave shields.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection or disable ad-blockers/Brave shields.');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center z-10">
        {/* Left side: Features */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col gap-8 pr-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                <Play className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">YEAGER MULTI WINDOW</h1>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed">
              The ultimate tool for creators. Boost your watch time safely with our advanced anti-detection features.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Ghost className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Ghost Mode (Anti-Detection)</h3>
                <p className="text-zinc-500 text-sm">Bypasses YouTube's bot detection using no-cookie domains, dynamic player scaling, and cache busting.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Eco Mode (Lag-Free)</h3>
                <p className="text-zinc-500 text-sm">Run up to 16 videos simultaneously without crashing your browser. Hides rendering to save CPU and RAM.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                <Clock className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Auto-Refresh & Watch Time</h3>
                <p className="text-zinc-500 text-sm">Automatically reloads players at set intervals to simulate fresh sessions and prevent view drops.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                <MonitorPlay className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Universal Support</h3>
                <p className="text-zinc-500 text-sm">Works flawlessly with Long-form videos, YouTube Shorts, and Live Streams simultaneously.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side: Auth Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 relative shadow-2xl"
        >
          <div className="flex md:hidden justify-center mb-8">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
              <Play className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-zinc-400 text-center mb-8">
            {isLogin ? 'Login to continue boosting' : 'Sign up to start your journey'}
          </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <button 
          onClick={handleGoogleAuth}
          className="mt-6 w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium flex items-center justify-center gap-2 transition-colors border border-zinc-700"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>

          <p className="mt-8 text-center text-zinc-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
