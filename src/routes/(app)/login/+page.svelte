<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
    
    let isRegister = $state(false);

    function toggleMode(e: Event) {
        e.preventDefault();
        isRegister = !isRegister;
    }
</script>

<svelte:head>
    <title>{isRegister ? 'Register' : 'Login'} - Cinema Wallet</title>
</svelte:head>

<div class="w-full h-full flex items-center justify-center p-4 md:p-8">
    <div class="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        
        <div class="p-8 md:p-10 relative z-10">
            <div class="mb-10 text-center">
                <h2 class="text-3xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">Cinema Wallet</h2>
                <p class="text-white/50 text-sm font-medium">
                    {isRegister ? 'Create an account to continue' : 'Sign in to your account'}
                </p>
            </div>
            
            <form method="POST" action={isRegister ? '?/register' : '?/login'} use:enhance class="space-y-5">
                <div class="group">
                    <label for="email" class="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-white/80 transition-colors">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 placeholder:text-white/20"
                        placeholder="name@example.com"
                        required
                    />
                </div>
                
                <div class="group">
                    <label for="password" class="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2 mt-6 group-focus-within:text-white/80 transition-colors">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 placeholder:text-white/20"
                        placeholder="••••••••"
                        required
                        minlength="8"
                    />
                </div>

                {#if isRegister}
                    <div class="group animate-in fade-in slide-in-from-top-4 duration-500 ease-out">
                        <label for="passwordConfirm" class="block text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-2 mt-6 group-focus-within:text-white/80 transition-colors">Confirm Password</label>
                        <input
                            type="password"
                            name="passwordConfirm"
                            id="passwordConfirm"
                            class="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 placeholder:text-white/20"
                            placeholder="••••••••"
                            required
                            minlength="8"
                        />
                    </div>
                {/if}

                <div class="pt-4">
                    {#if form?.missing}
                        <p class="text-red-400 text-xs mb-4 font-medium px-3 py-2 bg-red-500/10 rounded-xl border border-red-500/20 backdrop-blur-md">Please fill out all required fields.</p>
                    {/if}
                    {#if form?.incorrect && form?.action === 'login'}
                        <p class="text-red-400 text-xs mb-4 font-medium px-3 py-2 bg-red-500/10 rounded-xl border border-red-500/20 backdrop-blur-md">Invalid email or password.</p>
                    {/if}
                    {#if form?.mismatch && form?.action === 'register'}
                        <p class="text-red-400 text-xs mb-4 font-medium px-3 py-2 bg-red-500/10 rounded-xl border border-red-500/20 backdrop-blur-md">Passwords do not match.</p>
                    {/if}
                    {#if form?.error && form?.action === 'register'}
                        <p class="text-red-400 text-xs mb-4 font-medium px-3 py-2 bg-red-500/10 rounded-xl border border-red-500/20 backdrop-blur-md">{form?.message || 'Error creating account. Email might be taken.'}</p>
                    {/if}

                    <button
                        type="submit"
                        class="w-full bg-white text-black hover:bg-gray-200 font-semibold rounded-2xl px-4 py-4 transition-all duration-300 text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95"
                    >
                        {isRegister ? 'Create Account' : 'Sign In'}
                    </button>
                </div>
            </form>

            <div class="mt-8 text-center pt-6 border-t border-white/10">
                <button type="button" onclick={toggleMode} class="text-xs font-medium text-white/50 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                    {isRegister ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                </button>
            </div>
        </div>
    </div>
</div>