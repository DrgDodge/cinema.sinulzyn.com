<script lang="ts">
    let { data } = $props();
    
    let group = $derived(data.group);
    let tickets = $derived(data.tickets);
</script>

<svelte:head>
    <title>{group.name} - Shared Pass Group</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Clean Read-Only Header -->
    <header class="p-8 border-b border-gray-800 flex flex-col items-center bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <h1 class="text-2xl font-bold tracking-tight">{group.name}</h1>
        <div class="flex items-center gap-2 mt-2">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <p class="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Shared Cinema Group</p>
        </div>
    </header>

    <!-- Main Horizontal Swipe Section -->
    <main class="flex-grow flex items-center justify-center overflow-hidden py-10">
        {#if tickets.length === 0}
            <div class="text-center p-10">
                <p class="text-sm text-gray-500">This shared group has no tickets.</p>
            </div>
        {:else}
            <!-- Horizontal Scroll Container -->
            <div class="w-full h-full overflow-x-auto snap-x snap-mandatory flex items-center gap-6 px-10 no-scrollbar pb-10">
                {#each tickets as ticket}
                    <div class="snap-center shrink-0 w-full max-w-[320px] sm:max-w-sm">
                        <!-- Read-Only Digital Pass -->
                        <div class="bg-gradient-to-b from-indigo-950 to-gray-900 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.15)] border border-gray-800 relative drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]">
                            
                            <div class="absolute top-[42%] -left-4 w-8 h-8 bg-gray-950 rounded-full border-r border-gray-800 z-10"></div>
                            <div class="absolute top-[42%] -right-4 w-8 h-8 bg-gray-950 rounded-full border-l border-gray-800 z-10"></div>

                            <div class="p-8 pb-10 text-center relative">
                                <h2 class="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold mb-4">Cinema Pass</h2>
                                <h3 class="text-3xl font-bold text-white leading-tight">{ticket.movie}</h3>
                            </div>

                            <div class="relative w-full h-0 border-t-2 border-dashed border-gray-700"></div>

                            <div class="p-8 pt-8">
                                <div class="grid grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                        <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Date</p>
                                        <p class="font-medium text-sm text-gray-100">{ticket.date}</p>
                                    </div>
                                    <div>
                                        <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time</p>
                                        <p class="font-medium text-sm text-gray-100">{ticket.time}</p>
                                    </div>
                                    <div>
                                        <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Room</p>
                                        <p class="font-bold text-white text-xl">{ticket.room}</p>
                                    </div>
                                    <div class="flex gap-4">
                                        <div>
                                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Row</p>
                                            <p class="font-bold text-white text-xl">{ticket.row}</p>
                                        </div>
                                        <div>
                                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Seat</p>
                                            <p class="font-bold text-white text-xl">{ticket.seat}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="w-full flex flex-col items-center mt-10">
                                    <div class="bg-white p-3 rounded-2xl shadow-inner">
                                        <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrData)}`} 
                                            alt="Ticket QR Code" 
                                            class="w-24 h-28 mix-blend-multiply"
                                        />
                                    </div>
                                    <p class="text-[10px] font-mono tracking-[0.2em] text-gray-500 mt-4 uppercase">
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
            <div class="flex justify-center gap-1.5 mb-10">
                {#each tickets as _, i}
                    <div class="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                {/each}
            </div>
        {/if}
    </main>

    <!-- Branding Footer -->
    <footer class="p-8 text-center opacity-30">
        <p class="text-[10px] uppercase tracking-[0.4em] font-bold">Cinema Wallet</p>
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