<script lang="ts">
    import { enhance } from '$app/forms';
    let { data } = $props();
    
    let tickets = $derived(data.tickets);
    let groups = $derived(data.groups);

    let showCreateGroup = $state(false);

    function formatDate(dateStr: string) {
        if (!dateStr) return "Unknown date";
        try {
            const iso = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
            return new Date(iso).toLocaleDateString();
        } catch (e) {
            return "Invalid date";
        }
    }
</script>

<svelte:head>
    <title>Wallet - Cinema Wallet</title>
</svelte:head>

<div class="w-full h-full p-4 md:p-8 overflow-y-auto no-scrollbar relative z-10 animate-in fade-in zoom-in-95 duration-700 ease-out">
    <div class="max-w-4xl mx-auto">
        <header class="flex justify-between items-center mb-10 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h1 class="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">Wallet</h1>
            <a href="/scan" class="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Scan New
            </a>
        </header>

        <!-- Groups Section -->
        <section class="mb-12">
            <div class="flex justify-between items-center mb-6 px-2">
                <h2 class="text-[11px] font-semibold tracking-widest uppercase text-white/50">Your Groups</h2>
                <button 
                    onclick={() => showCreateGroup = true}
                    class="text-[10px] text-white/70 font-bold uppercase tracking-widest hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
                >
                    + New Group
                </button>
            </div>

            {#if groups.length === 0}
                <div class="bg-white/[0.02] backdrop-blur-xl border border-dashed border-white/10 rounded-[2rem] p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                    <p class="text-sm text-white/40 font-medium">No groups created yet. Group tickets to swipe through them easily.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {#each groups as group}
                        <a href="/groups/{group.id}" class="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 rounded-[1.5rem] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:-translate-y-1">
                            <div>
                                <h3 class="font-bold text-white group-hover:text-white/90 transition-colors text-base">{group.name}</h3>
                                <p class="text-[11px] text-white/40 mt-1 uppercase tracking-wider font-medium">Created {formatDate(group.created)}</p>
                            </div>
                            <div class="bg-white/10 text-white/80 text-[10px] px-3 py-1.5 rounded-full uppercase font-bold tracking-widest border border-white/10 group-hover:bg-white/20 transition-colors">
                                Swipe
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </section>

        <!-- All Passes -->
        <section>
            <h2 class="text-[11px] font-semibold tracking-widest uppercase text-white/50 mb-6 px-2">Recent Passes</h2>
            
            {#if tickets.length === 0}
                <div class="bg-white/[0.02] backdrop-blur-xl border border-dashed border-white/10 rounded-[2rem] p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                    <p class="text-sm text-white/40 text-balance font-medium">Your wallet is empty. Scan a receipt to get started.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {#each tickets as ticket}
                        <a href="/passes/{ticket.id}" class="flex items-center gap-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 rounded-[1.5rem] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:-translate-y-1">
                            <div class="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold shrink-0 shadow-lg group-hover:bg-white/20 transition-colors">
                                {ticket.movie.charAt(0)}
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-sm text-white truncate">{ticket.movie}</h3>
                                <p class="text-[10px] uppercase tracking-wider font-medium text-white/40 truncate mt-0.5">{ticket.date} • {ticket.time}</p>
                            </div>
                            <div class="ml-auto text-white/30 group-hover:text-white/80 transition-colors">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </section>
    </div>

    <!-- Create Group Modal -->
    {#if showCreateGroup}
        <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex items-center justify-center p-4">
            <div class="bg-white/[0.05] border border-white/10 rounded-[2rem] w-full max-w-md p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 ease-out">
                <h2 class="text-xl font-bold mb-6 text-white text-center">Create New Group</h2>
                <form method="POST" action="/groups?/create" use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'redirect') {
                            showCreateGroup = false;
                        }
                    };
                }} class="space-y-6">
                    <div>
                        <label for="name" class="block text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-2 ml-1">Group Name</label>
                        <input name="name" id="name" required placeholder="e.g. Movie Night" class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 placeholder:text-white/20 text-sm" />
                    </div>
                    <div class="flex gap-3 pt-2">
                        <button type="button" onclick={() => showCreateGroup = false} class="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white/80 hover:text-white font-semibold py-3.5 rounded-2xl transition-all duration-300 text-sm">Cancel</button>
                        <button type="submit" class="flex-1 bg-white text-black hover:bg-gray-200 font-semibold py-3.5 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 text-sm">Create</button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>

<style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>