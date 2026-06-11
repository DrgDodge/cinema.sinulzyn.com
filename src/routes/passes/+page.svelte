<script lang="ts">
    import { enhance } from '$app/forms';
    let { data } = $props();
    
    let tickets = $derived(data.tickets);
    let groups = $derived(data.groups);

    let showCreateGroup = $state(false);
</script>

<svelte:head>
    <title>My Passes - Cinema Wallet</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-white p-6 pb-24">
    <div class="max-w-4xl mx-auto">
        <header class="flex justify-between items-center mb-10">
            <h1 class="text-3xl font-bold tracking-tight">Wallet</h1>
            <a href="/scan" class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/20">
                Scan New
            </a>
        </header>

        <!-- Groups Section -->
        <section class="mb-12">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-semibold text-gray-400">Your Groups</h2>
                <button 
                    onclick={() => showCreateGroup = true}
                    class="text-xs text-blue-400 font-bold uppercase tracking-wider hover:text-blue-300"
                >
                    + New Group
                </button>
            </div>

            {#if groups.length === 0}
                <div class="bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl p-8 text-center">
                    <p class="text-sm text-gray-500">No groups created yet. Group tickets to swipe through them easily.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {#each groups as group}
                        <a href="/groups/{group.id}" class="bg-gray-900 border border-gray-800 p-5 rounded-2xl hover:border-gray-700 transition-colors group">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h3 class="font-bold text-white group-hover:text-blue-400 transition-colors">{group.name}</h3>
                                    <p class="text-xs text-gray-500 mt-1">Created {new Date(group.created).toLocaleDateString()}</p>
                                </div>
                                <div class="bg-gray-800 text-gray-400 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-tighter">
                                    Swipe View
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </section>

        <!-- All Passes -->
        <section>
            <h2 class="text-lg font-semibold text-gray-400 mb-6">Recent Passes</h2>
            
            {#if tickets.length === 0}
                <div class="bg-gray-900/50 border border-dashed border-gray-800 rounded-2xl p-8 text-center">
                    <p class="text-sm text-gray-500 text-balance">Your wallet is empty. Scan a receipt to get started.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {#each tickets as ticket}
                        <a href="/passes/{ticket.id}" class="flex items-center gap-4 bg-gray-900 border border-gray-800 p-4 rounded-2xl hover:border-gray-700 transition-colors">
                            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg">
                                {ticket.movie.charAt(0)}
                            </div>
                            <div class="min-w-0">
                                <h3 class="font-bold text-sm text-white truncate">{ticket.movie}</h3>
                                <p class="text-xs text-gray-500 truncate">{ticket.date} • {ticket.time}</p>
                            </div>
                            <div class="ml-auto text-gray-600 group-hover:text-gray-400">
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
        <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div class="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <h2 class="text-xl font-bold mb-6">Create New Group</h2>
                <form method="POST" action="/groups?/create" use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'redirect') {
                            showCreateGroup = false;
                        }
                    };
                }} class="space-y-6">
                    <div>
                        <label for="name" class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Group Name</label>
                        <input name="name" id="name" required placeholder="e.g. Movie Night with Friends" class="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div class="flex gap-3">
                        <button type="button" onclick={() => showCreateGroup = false} class="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-colors">Create</button>
                    </div>
                </form>
            </div>
        </div>
    {/if}
</div>