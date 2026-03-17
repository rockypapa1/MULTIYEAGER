import { motion } from 'motion/react';
import { Play, Zap, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Play className="w-8 h-8 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight">YEAGER MULTI WINDOW</span>
        </div>
        <Link 
          to="/auth" 
          className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors font-medium"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
              Premium Multi-Viewer for Fast Monetization
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-zinc-400 mb-10"
          >
            Boost your YouTube watch time with our lag-free, high-quality multi-window player. 
            Non-drop views, secure, and designed for professional creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/auth" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all transform hover:scale-105 font-bold text-lg shadow-[0_0_30px_rgba(79,70,229,0.3)]"
            >
              <Play className="w-5 h-5" />
              Start Boosting Now
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Zap, title: "Lag-Free Performance", desc: "Optimized for smooth playback across multiple tabs simultaneously." },
            { icon: Shield, title: "Non-Drop Watchtime", desc: "Real watch time accumulation to help you reach monetization faster." },
            { icon: TrendingUp, title: "Multi-Window Support", desc: "Play up to 16 videos at once with our premium dashboard." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm"
            >
              <feature.icon className="w-10 h-10 text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
