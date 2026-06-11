<script lang="ts">
    let { data } = $props();
    const ticket = data.ticket;
    
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

<div class="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 font-sans py-12">
    <div class="w-full max-w-sm relative animate-in fade-in slide-in-from-bottom-8 duration-500">
        <!-- Digital Pass View -->
        <div class="bg-gradient-to-b from-indigo-950 to-gray-900 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.15)] border border-gray-800 relative">
            
            <!-- Ticket Cutouts -->
            <div class="absolute top-[42%] -left-4 w-8 h-8 bg-gray-950 rounded-full border-r border-gray-800 z-10"></div>
            <div class="absolute top-[42%] -right-4 w-8 h-8 bg-gray-950 rounded-full border-l border-gray-800 z-10"></div>

            <!-- Upper Section -->
            <div class="p-8 pb-10 text-center relative">
                <h2 class="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold mb-4">Cinema Pass</h2>
                <h3 class="text-3xl font-bold text-white leading-tight">{ticket.movie}</h3>
            </div>

            <!-- Divider -->
            <div class="relative w-full h-0 border-t-2 border-dashed border-gray-700"></div>

            <!-- Lower Section -->
            <div class="p-8 pt-8">
                <div class="grid grid-cols-2 gap-y-6 gap-x-6">
                    <div>
                        <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Date</p>
                        <p class="font-medium text-gray-100">{ticket.date}</p>
                    </div>
                    <div>
                        <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time</p>
                        <p class="font-medium text-gray-100">{ticket.time}</p>
                    </div>
                    <div>
                        <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Room</p>
                        <p class="font-bold text-white text-2xl">{ticket.room}</p>
                    </div>
                    <div class="flex gap-4">
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Row</p>
                            <p class="font-bold text-white text-2xl">{ticket.row}</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Seat</p>
                            <p class="font-bold text-white text-2xl">{ticket.seat}</p>
                        </div>
                    </div>
                </div>

                <!-- Functional QR Code -->
                <div class="w-full flex flex-col items-center mt-10">
                    <div class="bg-white p-3 rounded-2xl shadow-inner">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrData)}`} 
                            alt="Ticket QR Code" 
                            class="w-28 h-28 mix-blend-multiply"
                        />
                    </div>
                    <p class="text-[11px] font-mono tracking-[0.2em] text-gray-500 mt-4 uppercase">
                        {ticket.qrText}
                    </p>
                </div>
            </div>
        </div>
        
        <div class="flex gap-4 mt-8">
            <button 
                onclick={copyLink} 
                class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                {copyText}
            </button>
            <a 
                href="/scan" 
                class="flex-1 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white font-medium py-4 rounded-xl transition-colors shadow-lg text-center flex items-center justify-center gap-2"
            >
                Back to Scanner
            </a>
        </div>
    </div>
</div>