import { StakingDashboard } from "./components/StakingDashboard";
import { StakingActions } from "./components/StakingActions";
import { WalletConnect } from "./components/WalletConnect";

function App() {
  return (
    <div
      className="relative min-h-screen bg-[#06040d] text-white overflow-hidden font-sans antialiased text-left selection:bg-purple-500/30"
      style={{ direction: "ltr" }}
    >
      {/* Ambient Neon Glow Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-fuchsia-900/10 blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <header className="relative z-10 backdrop-blur-md bg-[#06040d]/60 border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-0.5 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0d0a1b]">
              <span className="text-xl">🐾</span>
            </div>
          </div>
          <h1 className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            WAKANDA{" "}
            <span className="font-medium text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
              STAKING
            </span>
          </h1>
        </div>
        <WalletConnect />
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-6xl space-y-12 px-6 py-12">
        {/* Dashboard Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(147,51,234,1)]" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono">
              System Dashboard
            </h2>
          </div>
          <StakingDashboard />
        </section>

        {/* Staking Actions Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,1)]" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 font-mono text-center">
              Staking & Governance Actions
            </h2>
          </div>
          <div className="mx-auto max-w-xl w-full">
            <StakingActions />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
