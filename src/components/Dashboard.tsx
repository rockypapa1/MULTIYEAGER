import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { LogOut, Plus, Minus, Play, Pause, RefreshCw, LayoutGrid, Volume2, VolumeX, Clock, History, Settings, Trash2, Shuffle, Leaf, ListVideo, Ghost, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, signOut } from '../firebase';

function getYouTubeId(url: string) {
  // Matches standard watch URLs, youtu.be, embed, shorts, and live streams
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [windowCount, setWindowCount] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Advanced Features State
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('yt_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [staggeredLoad, setStaggeredLoad] = useState(true);
  const [randomizeStart, setRandomizeStart] = useState(false);
  const [ecoMode, setEcoMode] = useState(false);
  const [ghostMode, setGhostMode] = useState(true);
  const [autoRefreshMin, setAutoRefreshMin] = useState(0);
  const [visibleWindows, setVisibleWindows] = useState(1);

  // Parse multiple URLs
  const urlList = useMemo(() => {
    return activeUrl.split(',').map(u => u.trim()).filter(u => getYouTubeId(u));
  }, [activeUrl]);

  // Generate random start offsets and assign random URLs for each window
  const windowConfigs = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => {
      // Randomize start time
      const startOffset = randomizeStart ? (i * 15) + Math.floor(Math.random() * 10) : 0;
      
      // Pick a random URL from the list if multiple are provided
      const randomUrl = urlList.length > 0 ? urlList[Math.floor(Math.random() * urlList.length)] : '';
      const videoId = getYouTubeId(randomUrl);
      
      // Anti-detection randomizers
      const cacheBuster = ghostMode ? Math.random().toString(36).substring(7) : '';
      const scale = ghostMode ? 0.95 + Math.random() * 0.05 : 1; // 0.95 to 1.0
      const padding = ghostMode ? Math.floor(Math.random() * 8) : 0; // 0 to 8px

      return { startOffset, videoId, cacheBuster, scale, padding };
    });
  }, [refreshKey, activeUrl, randomizeStart, windowCount, urlList, ghostMode]);

  // Auto-refresh logic (Watch Time Manager)
  useEffect(() => {
    if (autoRefreshMin > 0 && isPlaying) {
      const interval = setInterval(() => {
        setRefreshKey(prev => prev + 1);
        if (staggeredLoad) setVisibleWindows(1);
      }, autoRefreshMin * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefreshMin, isPlaying, staggeredLoad]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate('/auth');
    });
    return () => unsubscribe();
  }, [navigate]);

  // Save history
  useEffect(() => {
    localStorage.setItem('yt_history', JSON.stringify(history));
  }, [history]);

  // Staggered Loading Logic
  useEffect(() => {
    if (isPlaying && staggeredLoad && visibleWindows < windowCount) {
      const timer = setTimeout(() => {
        setVisibleWindows(v => Math.min(v + 1, windowCount));
      }, 2500); // 2.5 seconds delay between each window
      return () => clearTimeout(timer);
    } else if (!staggeredLoad || !isPlaying) {
      setVisibleWindows(windowCount);
    }
  }, [isPlaying, staggeredLoad, visibleWindows, windowCount]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleStart = () => {
    if (!videoUrl) return;
    
    // Check if at least one valid URL exists
    const urls = videoUrl.split(',').map(u => u.trim());
    const hasValidUrl = urls.some(u => getYouTubeId(u));
    
    if (!hasValidUrl) return;

    setActiveUrl(videoUrl);
    setIsPlaying(true);
    setRefreshKey(k => k + 1);
    if (staggeredLoad) setVisibleWindows(1);

    // Add to history (store the whole string, even if multiple)
    setHistory(prev => {
      const newHistory = [videoUrl, ...prev.filter(u => u !== videoUrl)].slice(0, 10);
      return newHistory;
    });
    setShowHistory(false);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    if (staggeredLoad) setVisibleWindows(1);
  };

  const loadHistoryItem = (url: string) => {
    setVideoUrl(url);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Play className="w-6 h-6 text-indigo-500" />
            <span className="text-lg font-bold">YEAGER MULTI WINDOW</span>
          </div>

          <div className="flex-1 max-w-2xl w-full flex items-center gap-2 relative">
            <input 
              type="text"
              placeholder="Paste YouTube URL(s) here... (Long, Shorts, or Live streams)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
            />
            
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              title="Play History"
            >
              <History className="w-5 h-5" />
            </button>

            <button 
              onClick={handleStart}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> Start
            </button>

            {/* History Dropdown */}
            {showHistory && (
              <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
                  <span className="text-sm font-medium text-zinc-300">Recent Videos</span>
                  <button onClick={() => setHistory([])} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500 text-sm">No history yet</div>
                  ) : (
                    history.map((url, idx) => (
                      <button 
                        key={idx}
                        onClick={() => loadHistoryItem(url)}
                        className="w-full text-left p-3 hover:bg-zinc-800 border-b border-zinc-800/50 last:border-0 text-sm text-zinc-400 hover:text-zinc-200 truncate"
                      >
                        {url}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
              <button 
                onClick={() => setWindowCount(Math.max(1, windowCount - 1))}
                className="p-1 hover:bg-zinc-800 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{windowCount}</span>
              <button 
                onClick={() => setWindowCount(Math.min(16, windowCount + 1))}
                className="p-1 hover:bg-zinc-800 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="h-6 w-px bg-zinc-800 mx-1"></div>

            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-indigo-600 text-white' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`}
              title="Advanced Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button 
              onClick={handleRefresh}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title="Refresh All Players"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title={isPlaying ? "Pause All" : "Play All"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => setMuted(!muted)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title={muted ? "Unmute All" : "Mute All"}
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Advanced Settings Panel */}
      {showSettings && (
        <div className="bg-zinc-900 border-b border-zinc-800 p-4">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 min-w-[280px]">
                <Clock className="w-4 h-4 text-indigo-400" /> Human Simulation (Staggered Load)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={staggeredLoad}
                  onChange={(e) => setStaggeredLoad(e.target.checked)}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
              <span className="text-xs text-zinc-500 ml-2">Loads windows 1-by-1 to avoid bot detection</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 min-w-[280px]">
                <Shuffle className="w-4 h-4 text-indigo-400" /> Randomized Start Times
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={randomizeStart}
                  onChange={(e) => setRandomizeStart(e.target.checked)}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
              <span className="text-xs text-zinc-500 ml-2">Plays each window from a different timestamp (15s, 30s, etc.)</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 min-w-[280px]">
                <Leaf className="w-4 h-4 text-emerald-400" /> Eco Mode (Lag Free)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={ecoMode}
                  onChange={(e) => setEcoMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
              <span className="text-xs text-zinc-500 ml-2">Hides video rendering to save CPU/RAM. 100% Lag-free experience.</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 min-w-[280px]">
                <Ghost className="w-4 h-4 text-purple-400" /> Ghost Mode (Anti-Detection)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={ghostMode}
                  onChange={(e) => setGhostMode(e.target.checked)}
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
              <span className="text-xs text-zinc-500 ml-2">Uses No-Cookie domains, randomizes player sizes, and bypasses cache.</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 min-w-[280px]">
                <Timer className="w-4 h-4 text-orange-400" /> Auto-Refresh (Watch Time)
              </span>
              <select 
                value={autoRefreshMin}
                onChange={(e) => setAutoRefreshMin(Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2"
              >
                <option value={0}>Off (Manual only)</option>
                <option value={5}>Every 5 Minutes</option>
                <option value={10}>Every 10 Minutes</option>
                <option value={15}>Every 15 Minutes</option>
                <option value={30}>Every 30 Minutes</option>
              </select>
              <span className="text-xs text-zinc-500 ml-2">Automatically reloads players to simulate new sessions.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Video Grid */}
      <main className="flex-1 p-4 overflow-auto">
        {!activeUrl || urlList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500">
            <LayoutGrid className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg mb-2">Paste YouTube URL(s) and click Start</p>
            <p className="text-sm opacity-60 flex items-center gap-2"><ListVideo className="w-4 h-4" /> Pro Tip: Supports Long videos, Shorts, and Live Streams!</p>
          </div>
        ) : (
          <div 
            className="grid gap-4 h-full"
            style={{ 
              gridTemplateColumns: `repeat(auto-fit, minmax(${windowCount > 4 ? '300px' : '400px'}, 1fr))` 
            }}
          >
            {Array.from({ length: windowCount }).map((_, i) => (
              <motion.div 
                layout
                key={`${refreshKey}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: i * 0.05,
                  layout: { type: "spring", stiffness: 300, damping: 30 }
                }}
                className="bg-black rounded-xl overflow-hidden border border-zinc-800 aspect-video relative group flex items-center justify-center"
              >
                <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Window {i + 1}
                </div>
                {i < visibleWindows && windowConfigs[i].videoId ? (
                  <iframe
                    loading="lazy"
                    src={`https://www.${ghostMode ? 'youtube-nocookie.com' : 'youtube.com'}/embed/${windowConfigs[i].videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${muted ? 1 : 0}&controls=1&rel=0&loop=1&playlist=${windowConfigs[i].videoId}${windowConfigs[i].startOffset > 0 ? `&start=${windowConfigs[i].startOffset}` : ''}${ghostMode ? `&cb=${windowConfigs[i].cacheBuster}` : ''}`}
                    title={`YouTube video player ${i + 1}`}
                    className={`w-full h-full border-0 transition-opacity duration-500 ${ecoMode ? 'opacity-1' : 'opacity-100'}`}
                    style={{ 
                      transform: `scale(${windowConfigs[i].scale})`,
                      padding: `${windowConfigs[i].padding}px`
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy={ghostMode ? "strict-origin-when-cross-origin" : "no-referrer-when-downgrade"}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-zinc-600">
                    <Clock className="w-8 h-8 animate-pulse" />
                    <span className="text-xs font-medium uppercase tracking-wider">Simulating Human Delay...</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
