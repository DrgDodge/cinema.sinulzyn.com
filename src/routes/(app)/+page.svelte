<script lang="ts">
    // Home page logic (if any needed in future)
</script>

<svelte:head>
    <title>Cinema Wallet - Minimal</title>
</svelte:head>

<div class="w-full flex-grow flex flex-col items-center bg-white text-black font-sans selection:bg-black selection:text-white">
    <div class="max-w-5xl mx-auto px-6 py-24 md:py-32 w-full">
        
        <!-- Hero Section -->
        <div class="max-w-3xl">
            <p class="text-xs font-semibold tracking-widest uppercase mb-6 text-gray-500">
                Cinema Wallet
            </p>
            
            <h1 class="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                Your movie tickets, <br/>
                digitized.
            </h1>
            
            <p class="text-lg text-gray-600 mb-12 leading-relaxed max-w-xl">
                Scan your physical cinema stubs and instantly convert them into clean digital passes you can keep forever.
            </p>
            
            <div class="flex flex-col sm:flex-row items-start gap-4">
                <a href="/scan" class="px-8 py-3.5 bg-black hover:bg-gray-800 text-white font-medium rounded-full transition-colors text-sm flex justify-center items-center gap-2">
                    Scan a Receipt
                </a>
                <a href="/login" class="px-8 py-3.5 bg-transparent border border-gray-300 hover:border-black text-black font-medium rounded-full transition-colors text-sm flex justify-center items-center gap-2">
                    Create Account
                </a>
            </div>
        </div>

        <!-- Features grid -->
        <div class="mt-40 grid md:grid-cols-3 gap-12 border-t border-gray-100 pt-16">
            <div>
                <h3 class="text-sm font-semibold tracking-wide uppercase mb-3">Smart OCR</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Extracts the movie name, date, time, room, and seat number directly from physical receipts.</p>
            </div>
            
            <div>
                <h3 class="text-sm font-semibold tracking-wide uppercase mb-3">Digital Passes</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Turns messy thermal paper into clean, organized digital passes.</p>
            </div>
            
            <div>
                <h3 class="text-sm font-semibold tracking-wide uppercase mb-3">Secure Storage</h3>
                <p class="text-gray-500 text-sm leading-relaxed">Synchronized securely so you never lose your memories.</p>
            </div>
        </div>

    </div>
</div>