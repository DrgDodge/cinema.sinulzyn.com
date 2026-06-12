<script lang="ts">
    let { data } = $props();
    let ticket = $derived(data.ticket);
    
    let copyText = $state("Share Link");

    function copyLink() {
        navigator.clipboard.writeText(window.location.href);
        copyText = "Copied! ✅";
        setTimeout(() => { copyText = "Share Link"; }, 2000);
    }
</script>

<svelte:head>
    <title>{ticket.movie} - Cinema Pass</title>
</svelte:head>

<div class="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
    <div class="w-full max-w-sm relative animate-in fade-in zoom-in-95 duration-700 ease-out">
        <!-- Digital Pass View -->
        <div class="bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] relative drop-shadow-2xl">
            
            <!-- Ticket Cutouts -->
            <div class="absolute top-[42%] -left-4 w-8 h-8 bg-black rounded-full border-r border-white/10 z-10 shadow-inner"></div>
            <div class="absolute top-[42%] -right-4 w-8 h-8 bg-black rounded-full border-l border-white/10 z-10 shadow-inner"></div>

            <!-- Upper Section -->
            <div class="p-8 pb-10 text-center relative bg-white/[0.02]">
                <h2 class="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-4">Cinema Pass</h2>
                <h3 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 leading-tight">{ticket.movie}</h3>
            </div>

            <!-- Divider -->
            <div class="relative w-full h-0 border-t-2 border-dashed border-white/20"></div>

            <!-- Lower Section -->
            <div class="p-8 pt-8 bg-black/20">
                <div class="grid grid-cols-2 gap-y-6 gap-x-6">
                    <div>
                        <p class="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-semibold">Date</p>
                        <p class="font-medium text-white/90 text-sm">{ticket.date}</p>
                    </div>
                    <div>
                        <p class="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-semibold">Time</p>
                        <p class="font-medium text-white/90 text-sm">{ticket.time}</p>
                    </div>
                    <div>
                        <p class="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-semibold">Room</p>
                        <p class="font-bold text-white text-2xl">{ticket.room}</p>
                    </div>
                    <div class="flex gap-4">
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-semibold">Row</p>
                            <p class="font-bold text-white text-2xl">{ticket.row}</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-white/40 mb-1 font-semibold">Seat</p>
                            <p class="font-bold text-white text-2xl">{ticket.seat}</p>
                        </div>
                    </div>
                </div>

                <!-- Functional QR Code -->
                <div class="w-full flex flex-col items-center mt-10">
                    <div class="bg-white/90 p-3 rounded-2xl shadow-inner border border-white/20 backdrop-blur-md">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrData)}`} 
                            alt="Ticket QR Code" 
                            class="w-24 h-24 mix-blend-multiply opacity-90"
                        />
                    </div>
                    <p class="text-[10px] font-mono tracking-[0.2em] text-white/30 mt-4 uppercase font-bold">
                        {ticket.qrText}
                    </p>
                </div>
            </div>
        </div>
        
        <div class="flex gap-4 mt-8">
            <button 
                onclick={copyLink} 
                class="flex-1 bg-white hover:bg-gray-200 text-black font-semibold py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 text-sm hover:scale-105 active:scale-95"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                {copyText}
            </button>
            <a 
                href="/scan" 
                class="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-4 rounded-2xl transition-all duration-300 text-center flex items-center justify-center gap-2 text-sm hover:scale-105 active:scale-95"
            >
                Back to Scanner
            </a>
        </div>
    </div>
</div>