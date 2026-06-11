<script lang="ts">
    import { enhance } from '$app/forms';
    let { data } = $props();
    
    let group = $derived(data.group);
    let tickets = $derived(data.tickets);
    let availableTickets = $derived(data.availableTickets);

    let showAddMenu = $state(false);
    let copyText = $state("Copy Public Link");

    function copyPublicLink() {
        const url = `${window.location.origin}/public/groups/${group.id}`;
        navigator.clipboard.writeText(url);
        copyText = "Copied! ✅";
        setTimeout(() => { copyText = "Copy Public Link"; }, 2000);
    }
</script>

<svelte:head>
    <title>{group.name} - Cinema Wallet</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-white flex flex-col">
    <!-- Header -->
    <header class="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
        <div>
            <h1 class="text-xl font-bold">{group.name}</h1>
            <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-gray-500">{tickets.length} tickets</span>
                <span class="w-1 h-1 rounded-full bg-gray-700"></span>
                <span class="text-[10px] font-bold uppercase tracking-widest {group.isPublic ? 'text-green-500' : 'text-amber-500'}">
                    {group.isPublic ? 'Public' : 'Private'}
                </span>
            </div>
        </div>
        <div class="flex gap-2">
            <button 
                onclick={() => showAddMenu = true}
                aria-label="Add ticket"
                class="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
            <a href="/passes" aria-label="Back to history" class="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </a>
        </div>
    </header>

    <!-- Public Access Bar -->
    <div class="px-6 py-4 bg-gray-900/30 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <form method="POST" action="?/updatePublic" use:enhance class="flex items-center gap-3">
            <input type="hidden" name="isPublic" value={!group.isPublic ? 'true' : 'false'} />
            <button type="submit" class="text-xs font-bold px-3 py-1.5 rounded-full border {group.isPublic ? 'border-green-500/30 text-green-400 bg-green-500/5' : 'border-gray-700 text-gray-400 bg-gray-800/50'} hover:scale-105 transition-all">
                {group.isPublic ? 'Disable Public Link' : 'Enable Public Link'}
            </button>
        </form>
        
        {#if group.isPublic}
            <button onclick={copyPublicLink} class="text-xs font-bold text-blue-400 flex items-center gap-2 hover:text-blue-300 transition-colors">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                {copyText}
            </button>
        {/if}
    </div>

    <!-- Main Horizontal Swipe Section -->
    <main class="flex-grow flex items-center justify-center overflow-hidden py-10">
        {#if tickets.length === 0}
            <div class="text-center p-10">
                <div class="w-20 h-20 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-700">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
                </div>
                <h2 class="text-lg font-bold text-white mb-2">No tickets in this group</h2>
                <p class="text-sm text-gray-500 mb-8">Add tickets from your wallet to start swiping.</p>
                <button onclick={() => showAddMenu = true} class="text-blue-500 font-bold uppercase text-xs tracking-widest">Add Ticket</button>
            </div>
        {:else}
            <!-- Horizontal Scroll Container -->
            <div class="w-full h-full overflow-x-auto snap-x snap-mandatory flex items-center gap-6 px-10 no-scrollbar pb-10">
                {#each tickets as ticket}
                    <div class="snap-center shrink-0 w-full max-w-[320px] sm:max-w-sm">
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
                                    <div><p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Date</p><p class="font-medium text-sm text-gray-100">{ticket.date}</p></div>
                                    <div><p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time</p><p class="font-medium text-sm text-gray-100">{ticket.time}</p></div>
                                    <div><p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Room</p><p class="font-bold text-white text-xl">{ticket.room}</p></div>
                                    <div class="flex gap-4">
                                        <div><p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Row</p><p class="font-bold text-white text-xl">{ticket.row}</p></div>
                                        <div><p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Seat</p><p class="font-bold text-white text-xl">{ticket.seat}</p></div>
                                    </div>
                                </div>
                                <div class="w-full flex flex-col items-center mt-10">
                                    <div class="bg-white p-3 rounded-2xl shadow-inner">
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticket.qrData)}`} alt="Ticket QR Code" class="w-24 h-28 mix-blend-multiply" />
                                    </div>
                                    <p class="text-[10px] font-mono tracking-[0.2em] text-gray-500 mt-4 uppercase">{ticket.qrText}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
                <div class="shrink-0 w-1 px-5"></div>
            </div>
        {/if}
    </main>

    <!-- Add Ticket Modal -->
    {#if showAddMenu}
        <div class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
            <div class="bg-gray-900 border border-gray-800 rounded-t-[2.5rem] sm:rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-xl font-bold">Add to Group</h2>
                    <button onclick={() => showAddMenu = false} aria-label="Close" class="text-gray-500 hover:text-white transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                {#if availableTickets.length === 0}
                    <div class="text-center py-10 opacity-50"><p class="text-sm">No available ungrouped tickets found.</p></div>
                {:else}
                    <div class="space-y-3 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
                        {#each availableTickets as ticket}
                            <form method="POST" action="?/addTicket" use:enhance>
                                <input type="hidden" name="ticketId" value={ticket.id} />
                                <button type="submit" class="w-full text-left bg-gray-950 border border-gray-800 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-500/50 transition-all active:scale-[0.98]">
                                    <div class="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400 font-bold">{ticket.movie.charAt(0)}</div>
                                    <div class="min-w-0"><p class="font-bold text-sm truncate">{ticket.movie}</p><p class="text-[10px] text-gray-500 uppercase tracking-wider">{ticket.date} • {ticket.time}</p></div>
                                    <div class="ml-auto bg-blue-600 text-white p-1 rounded-full"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></div>
                                </button>
                            </form>
                        {/each}
                    </div>
                {/if}
                <button onclick={() => showAddMenu = false} class="w-full mt-8 bg-gray-800 text-gray-400 font-bold py-4 rounded-2xl hover:text-white transition-colors">Done</button>
            </div>
        </div>
    {/if}
</div>

<style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>