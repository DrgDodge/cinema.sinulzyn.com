<script lang="ts">
    let { data } = $props();
    
    let group = $derived(data.group);
    let tickets = $derived(data.tickets);
</script>

<svelte:head>
    <title>{group.name} - Shared Pass Group</title>
</svelte:head>

<div class="w-full h-full flex flex-col relative z-10 animate-in fade-in zoom-in-95 duration-700 ease-out">
    <!-- Clean Read-Only Header -->
    <header class="p-8 border-b border-white/10 flex flex-col items-center bg-white/[0.03] backdrop-blur-3xl sticky top-0 z-50">
        <h1 class="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">{group.name}</h1>
        <div class="flex items-center gap-2 mt-2">
            <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
            <p class="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">Shared Cinema Group</p>
        </div>
    </header>

    <!-- Main Horizontal Swipe Section -->
    <main class="flex-grow flex items-center justify-center overflow-hidden py-10 relative">
        {#if tickets.length === 0}
            <div class="text-center p-10 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                <p class="text-sm text-white/40 font-medium">This shared group has no tickets.</p>
            </div>
        {:else}
            <!-- Horizontal Scroll Container -->
            <div class="w-full h-full overflow-x-auto snap-x snap-mandatory flex items-center gap-6 px-10 no-scrollbar pb-10">
                {#each tickets as ticket}
                    <div class="snap-center shrink-0 w-full max-w-[320px] sm:max-w-sm">
                        <!-- Read-Only Digital Pass with Refraction -->
                        <div class="bg-white/[0.08] backdrop-blur-3xl backdrop-saturate-[1.5] backdrop-brightness-110 border border-white/20 rounded-[2.5rem] overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_8px_32px_0_rgba(0,0,0,0.5)] relative drop-shadow-2xl">
                            
                            <div class="absolute top-[42%] -left-4 w-8 h-8 bg-black rounded-full border-r border-white/20 z-10 shadow-inner"></div>
                            <div class="absolute top-[42%] -right-4 w-8 h-8 bg-black rounded-full border-l border-white/20 z-10 shadow-inner"></div>

                            <div class="p-8 pb-10 text-center relative bg-white/[0.05]">
                                <h2 class="text-[10px] uppercase tracking-[0.3em] text-white/50 font-bold mb-4">Cinema Pass</h2>
                                <h3 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 leading-tight">{ticket.movie}</h3>
                            </div>

                            <div class="relative w-full h-0 border-t-2 border-dashed border-white/20"></div>

                            <div class="p-8 pt-8 bg-black/30 backdrop-saturate-200">
                                <div class="grid grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                        <p class="text-[10px] uppercase tracking-wider text-white/50 mb-1 font-semibold">Date</p>
                                        <p class="font-medium text-sm text-white/90">{ticket.date}</p>
                                    </div>
                                    <div>
                                        <p class="text-[10px] uppercase tracking-wider text-white/50 mb-1 font-semibold">Time</p>
                                        <p class="font-medium text-sm text-white/90">{ticket.time}</p>
                                    </div>
                                    <div>
                                        <p class="text-[10px] uppercase tracking-wider text-white/50 mb-1 font-semibold">Room</p>
                                        <p class="font-bold text-white text-xl">{ticket.room}</p>
                                    </div>
                                    <div class="flex gap-4">
                                        <div>
                                            <p class="text-[10px] uppercase tracking-wider text-white/50 mb-1 font-semibold">Row</p>
                                            <p class="font-bold text-white text-xl">{ticket.row}</p>
                                        </div>
                                        <div>
                                            <p class="text-[10px] uppercase tracking-wider text-white/50 mb-1 font-semibold">Seat</p>
                                            <p class="font-bold text-white text-xl">{ticket.seat}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="w-full flex flex-col items-center mt-10">
                                    <div class="bg-white/90 p-3 rounded-2xl shadow-inner border border-white/20 backdrop-blur-md">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrData)}`} 
                                            alt="Ticket QR Code" 
                                            class="w-24 h-24 mix-blend-multiply opacity-90"
                                        />
                                    </div>
                                    <p class="text-[10px] font-mono tracking-[0.2em] text-white/40 mt-4 uppercase font-bold">
                                        {ticket.qrText}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
                <div class="shrink-0 w-1 px-5"></div>
            </div>
            <!-- Progress Dots -->
            <div class="flex justify-center gap-2 mb-10 absolute bottom-0 left-0 right-0">
                {#each tickets as _, i}
                    <div class="w-1.5 h-1.5 rounded-full bg-white/20 shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
                {/each}
            </div>
        {/if}
    </main>

    <!-- Branding Footer -->
    <footer class="p-8 text-center opacity-30 mt-auto">
        <p class="text-[10px] uppercase tracking-[0.4em] font-bold text-white/80">Cinema Wallet</p>
    </footer>
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>