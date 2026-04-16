import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30">
      {/* Background Gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="flex items-center gap-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform">
            <img src={viteLogo} className="w-24 h-24 drop-shadow-[0_0_2rem_rgba(100,108,255,0.4)]" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform">
            <img src={reactLogo} className="w-24 h-24 drop-shadow-[0_0_2rem_rgba(97,218,251,0.4)] animate-[spin_20s_linear_infinite]" alt="React logo" />
          </a>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          BlockForge Frontend
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          The premium foundation for your next decentralized masterpiece.
          Built with <span className="text-purple-400 font-medium">React</span>, <span className="text-blue-400 font-medium">TypeScript</span>, and <span className="text-sky-400 font-medium">Tailwind CSS v4</span>.
        </p>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="group relative px-8 py-4 bg-white text-slate-950 font-semibold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            Count is {count}
          </button>
          
          <code className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-sm text-slate-500 font-mono">
            edit src/App.tsx to begin
          </code>
        </div>
      </main>

      <footer className="relative z-10 py-10 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} BlockForge. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
