<script lang="ts">
    // Home page logic (if any needed in future)
</script>

<svelte:head>
    <title>Cinema Wallet - Digitize Your Movie Passes</title>
</svelte:head>

<div class="relative w-full flex-grow flex flex-col items-center overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full relative z-10">
        
        <!-- Hero Section -->
        <div class="text-center max-w-3xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-8">
                <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Now supporting OCR Scanning
            </div>
            
            <h1 class="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                Your Movie Tickets, <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                    Digitized & Beautiful.
                </span>
            </h1>
            
            <p class="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
                Stop losing paper receipts. Scan your physical cinema stubs and instantly convert them into gorgeous digital passes you can keep forever.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href="/scan" class="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] text-lg flex justify-center items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Scan a Receipt
                </a>
                <a href="/login" class="w-full sm:w-auto px-8 py-4 bg-gray-900 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 text-white font-semibold rounded-xl transition-all duration-200 text-lg flex justify-center items-center gap-2">
                    Create Account
                </a>
            </div>
        </div>

        <!-- Features grid -->
        <div class="mt-32 grid md:grid-cols-3 gap-8">
            <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-3xl">
                <div class="w-12 h-12 bg-blue-500/10 flex items-center justify-center rounded-2xl mb-6 text-blue-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Smart OCR Parsing</h3>
                <p class="text-gray-400 leading-relaxed">Instantly extracts the movie name, date, time, room, and seat number from your physical receipts.</p>
            </div>
            
            <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-3xl">
                <div class="w-12 h-12 bg-indigo-500/10 flex items-center justify-center rounded-2xl mb-6 text-indigo-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Beautiful Passes</h3>
                <p class="text-gray-400 leading-relaxed">Turn messy thermal paper into clean, organized digital cut-out passes with our custom UI generator.</p>
            </div>
            
            <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-3xl">
                <div class="w-12 h-12 bg-purple-500/10 flex items-center justify-center rounded-2xl mb-6 text-purple-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 class="text-xl font-bold text-white mb-3">Secure Storage</h3>
                <p class="text-gray-400 leading-relaxed">Your wallet is safely synchronized to your PocketBase account so you never lose your memories.</p>
            </div>
        </div>

    </div>
</div>