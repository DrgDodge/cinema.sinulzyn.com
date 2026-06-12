<script lang="ts">
    // Home page logic (if any needed in future)
</script>

<svelte:head>
    <title>Cinema Wallet</title>
</svelte:head>

<div class="w-full h-full flex flex-col justify-center items-center text-white px-4 md:px-8 py-8 overflow-hidden">
    <!-- Liquid Glass Card Wrapper -->
    <div class="relative w-full max-w-5xl h-full max-h-[800px] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-700 ease-out">
        
        <!-- Left Content -->
        <div class="flex-1 p-8 md:p-16 flex flex-col justify-center relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-[10px] font-semibold tracking-widest uppercase mb-6 w-fit backdrop-blur-md">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                iOS 26 Design System
            </div>
            
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                Your movie tickets, <br/>
                digitized.
            </h1>
            
            <p class="text-base md:text-lg text-white/60 mb-10 leading-relaxed max-w-md font-medium">
                Scan your physical cinema stubs and instantly convert them into clean digital passes you can keep forever.
            </p>
            
            <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a href="/scan" class="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-xl text-sm flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95">
                    Scan a Receipt
                </a>
                <a href="/login" class="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 hover:border-white/30 hover:bg-white/5 text-white/80 hover:text-white font-medium rounded-full transition-all duration-300 text-sm flex justify-center items-center hover:scale-105 active:scale-95">
                    Create Account
                </a>
            </div>
        </div>

        <!-- Right Visuals (Glass features) -->
        <div class="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-4 relative z-10 border-t md:border-t-0 md:border-l border-white/10 bg-white/[0.01]">
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-5 lg:p-6 rounded-3xl hover:bg-white/10 transition-colors duration-300 group cursor-default">
                <div class="flex items-center gap-4 mb-2">
                    <div class="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 class="text-sm font-semibold tracking-wide text-white/90">Smart OCR</h3>
                </div>
                <p class="text-white/50 text-xs leading-relaxed pl-14 hidden sm:block">Extracts movie details directly from physical receipts.</p>
            </div>
            
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-5 lg:p-6 rounded-3xl hover:bg-white/10 transition-colors duration-300 group cursor-default">
                <div class="flex items-center gap-4 mb-2">
                    <div class="w-10 h-10 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                    </div>
                    <h3 class="text-sm font-semibold tracking-wide text-white/90">Digital Passes</h3>
                </div>
                <p class="text-white/50 text-xs leading-relaxed pl-14 hidden sm:block">Turns messy thermal paper into clean, organized passes.</p>
            </div>
            
            <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-5 lg:p-6 rounded-3xl hover:bg-white/10 transition-colors duration-300 group cursor-default">
                <div class="flex items-center gap-4 mb-2">
                    <div class="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h3 class="text-sm font-semibold tracking-wide text-white/90">Secure Storage</h3>
                </div>
                <p class="text-white/50 text-xs leading-relaxed pl-14 hidden sm:block">Synchronized securely so you never lose your memories.</p>
            </div>
        </div>
    </div>
</div>