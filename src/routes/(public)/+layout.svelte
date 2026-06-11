<script lang="ts">
    import '../layout.css';
    let { children } = $props();
</script>

<div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans antialiased">
    {@render children()}
</div>