<script lang="ts">
    import './layout.css';
    let { children } = $props();
</script>

<div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans antialiased selection:bg-blue-500/30">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-gray-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16 items-center">
                <!-- Logo -->
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="flex items-center gap-2 group">
                        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-blue-500/25 transition-all">
                            C
                        </div>
                        <span class="font-bold text-xl tracking-tight text-white">Cinema<span class="text-blue-500">Wallet</span></span>
                    </a>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="/" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Home</a>
                    <a href="/passes" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Wallet</a>
                    <a href="/scan" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Scanner</a>
                    
                    <form method="POST" action="/logout">
                        <button type="submit" class="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">Logout</button>
                    </form>
                </div>

                <!-- Mobile menu button (Simplified for now) -->
                <div class="md:hidden flex items-center gap-4">
                    <a href="/login" class="text-sm font-medium text-white px-3 py-1.5 rounded-md bg-blue-600">Login</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col relative">
        {@render children()}
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-800 bg-gray-950 py-12 mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-2 opacity-80">
                <div class="w-6 h-6 rounded flex items-center justify-center bg-gray-800 text-xs font-bold text-gray-400">C</div>
                <span class="font-semibold text-gray-400">CinemaWallet</span>
            </div>
            <p class="text-sm text-gray-500 text-center md:text-left">
                © {new Date().getFullYear()} Cinema Wallet. All rights reserved.
            </p>
            <div class="flex gap-6">
                <a href="#" class="text-gray-500 hover:text-gray-300 transition-colors text-sm">Privacy</a>
                <a href="#" class="text-gray-500 hover:text-gray-300 transition-colors text-sm">Terms</a>
            </div>
        </div>
    </footer>
</div>