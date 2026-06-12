<script lang="ts">
    import '../layout.css';
    let { children } = $props();
</script>

<div class="h-[100dvh] w-full overflow-hidden bg-black text-gray-100 flex flex-col font-sans antialiased relative selection:bg-white/30">
    <!-- Animated Liquid Glass Background -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen animate-[spin_20s_linear_infinite]"></div>
        <div class="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] bg-fuchsia-600/20 rounded-full blur-[150px] mix-blend-screen animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
        <div class="absolute top-[20%] left-[40%] w-[50vw] h-[50vw] bg-cyan-500/20 rounded-full blur-[100px] mix-blend-screen animate-[bounce_15s_infinite]"></div>
    </div>

    <!-- Liquid Glass Navbar -->
    <nav class="relative z-50 backdrop-blur-3xl bg-white/[0.02] border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="flex items-center gap-3 group">
                        <div class="w-8 h-8 rounded-[10px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 group-hover:bg-white/20 transition-all duration-500 ease-out">
                            C
                        </div>
                        <span class="font-semibold text-lg tracking-tight text-white/90 group-hover:text-white transition-colors duration-300">CinemaWallet</span>
                    </a>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="/" class="text-sm font-medium text-white/60 hover:text-white hover:scale-105 transition-all duration-300">Home</a>
                    <a href="/passes" class="text-sm font-medium text-white/60 hover:text-white hover:scale-105 transition-all duration-300">Wallet</a>
                    <a href="/scan" class="text-sm font-medium text-white/60 hover:text-white hover:scale-105 transition-all duration-300">Scanner</a>
                    
                    <form method="POST" action="/logout">
                        <button type="submit" class="text-sm font-medium text-red-400/80 hover:text-red-400 hover:scale-105 transition-all duration-300">Logout</button>
                    </form>
                </div>

                <!-- Mobile menu button -->
                <div class="md:hidden flex items-center gap-4">
                    <a href="/login" class="text-xs font-semibold text-white/90 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 active:scale-95">Login</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content Wrapper -->
    <main class="flex-grow flex flex-col relative z-10 w-full h-full overflow-y-auto md:overflow-hidden">
        {@render children()}
    </main>

    <!-- Liquid Glass Footer -->
    <footer class="relative z-50 backdrop-blur-3xl bg-white/[0.02] border-t border-white/10 py-4 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
            <p class="text-xs text-white/40 font-medium">
                © {new Date().getFullYear()} CinemaWallet
            </p>
            <div class="flex gap-6">
                <a href="/" class="text-white/40 hover:text-white/80 transition-colors text-xs font-medium">Privacy</a>
                <a href="/" class="text-white/40 hover:text-white/80 transition-colors text-xs font-medium">Terms</a>
            </div>
        </div>
    </footer>
</div>