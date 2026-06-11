<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Tesseract from 'tesseract.js';

    let videoElement = $state<HTMLVideoElement>();
    let canvasElement = $state<HTMLCanvasElement>();
    let stream = $state<MediaStream | null>(null);
    
    let processing = $state(false);
    let progress = $state(0);
    let errorMsg = $state('');
    
    let parsedTicket = $state<{ movie: string, date: string, time: string, room: string, row: string, seat: string } | null>(null);

    onMount(async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoElement && stream) {
                videoElement.srcObject = stream;
            }
        } catch (err) {
            errorMsg = 'Could not access camera. Please ensure permissions are granted.';
            console.error(err);
        }
    });

    onDestroy(() => {
        stopStream();
    });

    function stopStream() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    async function captureAndScan() {
        if (!videoElement || !canvasElement) return;

        processing = true;
        progress = 0;
        errorMsg = '';
        parsedTicket = null;

        const ctx = canvasElement.getContext('2d');
        if (!ctx) return;

        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const imageDataUrl = canvasElement.toDataURL('image/jpeg');

        try {
            const result = await Tesseract.recognize(
                imageDataUrl,
                'ron+eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            progress = Math.round(m.progress * 100);
                        }
                    }
                }
            );
            parseReceipt(result.data.text);
        } catch (err) {
            errorMsg = 'Error during OCR parsing.';
            console.error(err);
        } finally {
            processing = false;
        }
    }

    function parseReceipt(text: string) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        let date = '', time = '', room = '', row = '', seat = '', movie = '';
        
        const dateTimeRegex = /DATA:\s*([\d.]+)\s*ORA:\s*([\d:]+)/i;
        const roomRegex = /SALA\s*(\d+)/i;
        const seatRegex = /RANDUL:\s*(\d+)\s*LOCUL:\s*(\d+)/i;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            const dtMatch = line.match(dateTimeRegex);
            if (dtMatch) {
                date = dtMatch[1];
                time = dtMatch[2];
                if (i > 0) movie = lines[i - 1]; // Movie is the line preceding Date/Time
            }

            const roomMatch = line.match(roomRegex);
            if (roomMatch) room = roomMatch[1];

            const seatMatch = line.match(seatRegex);
            if (seatMatch) {
                row = seatMatch[1];
                seat = seatMatch[2];
            }
        }

        if (date && time && room && row && seat && movie) {
            parsedTicket = { movie, date, time, room, row, seat };
            stopStream();
        } else {
            errorMsg = 'Could not find all ticket details. Please try scanning again.';
        }
    }
</script>

<svelte:head>
    <title>Scan Receipt - Cinema Wallet</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6 font-sans">
    <h1 class="text-2xl font-bold mb-8 mt-4 tracking-tight">Scanner</h1>

    {#if errorMsg}
        <div class="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 mb-6 w-full max-w-sm text-center text-sm">
            {errorMsg}
        </div>
    {/if}

    {#if !parsedTicket}
        <!-- Camera View -->
        <div class="relative w-full max-w-sm aspect-[3/4] bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
            <video 
                bind:this={videoElement} 
                autoplay 
                playsinline 
                class="w-full h-full object-cover"
            ></video>
            
            <canvas bind:this={canvasElement} class="hidden"></canvas>

            <!-- Guide Overlay -->
            <div class="absolute inset-0 border-[3px] border-white/20 m-8 rounded-xl pointer-events-none"></div>

            {#if processing}
                <div class="absolute inset-0 bg-gray-950/80 flex flex-col items-center justify-center backdrop-blur-md">
                    <div class="text-blue-400 font-medium mb-3">Analyzing Receipt...</div>
                    <div class="w-3/4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 transition-all duration-300 ease-out" style="width: {progress}%"></div>
                    </div>
                    <div class="text-xs text-gray-500 mt-3">{progress}%</div>
                </div>
            {/if}
        </div>

        <div class="mt-10 mb-4">
            <button 
                onclick={captureAndScan}
                disabled={processing}
                aria-label="Capture and scan receipt"
                class="w-20 h-20 rounded-full bg-transparent border-[4px] border-gray-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 group"
            >
                <div class="w-16 h-16 rounded-full bg-white group-hover:bg-gray-200 transition-colors"></div>
            </button>
        </div>
        <p class="text-gray-500 text-sm">Align receipt within the frame</p>

    {:else}
        <!-- Digital Pass View -->
        <div class="w-full max-w-sm mt-4 relative animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div class="bg-gradient-to-b from-indigo-950 to-gray-900 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-800 relative drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]">
                
                <!-- Ticket Cutouts -->
                <div class="absolute top-[45%] -left-4 w-8 h-8 bg-gray-950 rounded-full border-r border-gray-800 z-10"></div>
                <div class="absolute top-[45%] -right-4 w-8 h-8 bg-gray-950 rounded-full border-l border-gray-800 z-10"></div>

                <!-- Upper Section -->
                <div class="p-8 pb-10 text-center relative">
                    <h2 class="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold mb-4">Cinema Pass</h2>
                    <h3 class="text-3xl font-bold text-white leading-tight">{parsedTicket.movie}</h3>
                </div>

                <!-- Divider -->
                <div class="relative w-full h-0 border-t-2 border-dashed border-gray-700"></div>

                <!-- Lower Section -->
                <div class="p-8 pt-10">
                    <div class="grid grid-cols-2 gap-y-8 gap-x-6">
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Date</p>
                            <p class="font-medium text-gray-100">{parsedTicket.date}</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time</p>
                            <p class="font-medium text-gray-100">{parsedTicket.time}</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Room</p>
                            <p class="font-bold text-white text-2xl">{parsedTicket.room}</p>
                        </div>
                        <div class="flex gap-4">
                            <div>
                                <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Row</p>
                                <p class="font-bold text-white text-2xl">{parsedTicket.row}</p>
                            </div>
                            <div>
                                <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Seat</p>
                                <p class="font-bold text-white text-2xl">{parsedTicket.seat}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Barcode Mockup -->
                    <div class="w-full h-14 flex justify-between items-center opacity-70 mt-10 px-2">
                        {#each Array(45) as _, i}
                            <div class="bg-gray-400 h-full" style="width: {Math.random() * 4 + 1}px;"></div>
                        {/each}
                    </div>
                </div>
            </div>
            
            <button 
                onclick={() => location.reload()} 
                aria-label="Scan another receipt"
                class="w-full mt-8 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white font-medium py-4 rounded-xl transition-colors shadow-lg"
            >
                Scan Another Receipt
            </button>
        </div>
    {/if}
</div>