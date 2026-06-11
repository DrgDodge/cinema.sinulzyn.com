<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Tesseract from 'tesseract.js';

    let videoElement = $state<HTMLVideoElement>();
    let canvasElement = $state<HTMLCanvasElement>();
    let stream = $state<MediaStream | null>(null);
    
    let processing = $state(false);
    let progress = $state(0);
    
    // Accumulate the scanned data here
    let draft = $state({
        movie: '',
        date: '',
        time: '',
        room: '',
        row: '',
        seat: '',
        ticketId: ''
    });

    let showTicket = $state(false);

    // Reactive check to enable the Generate button
    let isComplete = $derived(!!(draft.movie && draft.date && draft.time && draft.room && draft.row && draft.seat));

    onMount(async () => {
        startCamera();
    });

    onDestroy(() => {
        stopStream();
    });

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoElement && stream) {
                videoElement.srcObject = stream;
            }
        } catch (err) {
            console.error('Camera error. Ensure you are on HTTPS:', err);
        }
    }

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
            console.error('OCR Error:', err);
        } finally {
            processing = false;
        }
    }

    function parseReceipt(text: string) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        const dateTimeRegex = /DATA:\s*([\d.]+)\s*ORA:\s*([\d:]+)/i;
        const roomRegex = /SALA\s*(\d+)/i;
        const seatRegex = /RANDUL:\s*(\d+)\s*LOCUL:\s*(\d+)/i;
        const idRegex = /\b(\d{9,20})\b/; // Look for a long transaction/ticket barcode ID

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            const dtMatch = line.match(dateTimeRegex);
            if (dtMatch) {
                if (!draft.date) draft.date = dtMatch[1];
                if (!draft.time) draft.time = dtMatch[2];
                if (!draft.movie && i > 0) {
                    let m = lines[i - 1];
                    // FIX: Strip trailing single digits/spaces (often age ratings or screen numbers read improperly)
                    m = m.replace(/\s+\d$/, '');
                    draft.movie = m;
                }
            }

            const roomMatch = line.match(roomRegex);
            if (roomMatch && !draft.room) draft.room = roomMatch[1];

            const seatMatch = line.match(seatRegex);
            if (seatMatch) {
                if (!draft.row) draft.row = seatMatch[1];
                if (!draft.seat) draft.seat = seatMatch[2];
            }

            const idMatch = line.match(idRegex);
            if (idMatch && !draft.ticketId) {
                draft.ticketId = idMatch[1];
            }
        }
    }

    function generateTicket() {
        if (!draft.ticketId) {
            // Generate a fallback barcode ID if OCR missed the numbers at the bottom
            draft.ticketId = Math.floor(Math.random() * 9000000000) + 1000000000 + '';
        }
        showTicket = true;
        stopStream();
    }

    function scanAnother() {
        draft = { movie: '', date: '', time: '', room: '', row: '', seat: '', ticketId: '' };
        showTicket = false;
        startCamera();
    }
</script>

<svelte:head>
    <title>Scan Receipt - Cinema Wallet</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6 font-sans pb-24">
    <h1 class="text-2xl font-bold mb-6 mt-4 tracking-tight">Scanner</h1>

    {#if !showTicket}
        <!-- Progressive Camera View -->
        <div class="relative w-full max-w-sm aspect-[4/3] bg-black rounded-3xl overflow-hidden border border-gray-800 shadow-xl mb-6">
            <video 
                bind:this={videoElement} 
                autoplay 
                playsinline 
                class="w-full h-full object-cover"
            ></video>
            
            <canvas bind:this={canvasElement} class="hidden"></canvas>

            <!-- Guide Overlay -->
            <div class="absolute inset-0 border-[2px] border-white/20 m-6 rounded-xl pointer-events-none"></div>

            {#if processing}
                <div class="absolute inset-0 bg-gray-950/80 flex flex-col items-center justify-center backdrop-blur-md">
                    <div class="text-blue-400 font-medium mb-3">Scanning...</div>
                    <div class="w-3/4 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 transition-all duration-300 ease-out" style="width: {progress}%"></div>
                    </div>
                </div>
            {/if}
        </div>

        <button 
            onclick={captureAndScan}
            disabled={processing}
            aria-label="Capture and scan receipt"
            class="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 mb-8"
        >
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </button>

        <!-- Infographic Checklist & Edit Form -->
        <div class="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-2xl">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-semibold text-white">Scan Data</h3>
                <span class="text-[10px] uppercase tracking-wider text-blue-400 font-bold px-2 py-1 bg-blue-500/10 rounded-md">Editable</span>
            </div>
            
            <p class="text-xs text-gray-400 mb-5">
                Scan multiple times to fill missing data, or manually correct typos below.
            </p>

            <div class="grid grid-cols-2 gap-3">
                <!-- Movie Name -->
                <div class="col-span-2">
                    <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Movie</label>
                    <div class="relative mt-1">
                        <input bind:value={draft.movie} class="w-full bg-gray-950 border {draft.movie ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Missing..." />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">{draft.movie ? '✅' : '❌'}</div>
                    </div>
                </div>

                <!-- Date -->
                <div>
                    <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Date</label>
                    <div class="relative mt-1">
                        <input bind:value={draft.date} class="w-full bg-gray-950 border {draft.date ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Missing" />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">{draft.date ? '✅' : '❌'}</div>
                    </div>
                </div>

                <!-- Time -->
                <div>
                    <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Time</label>
                    <div class="relative mt-1">
                        <input bind:value={draft.time} class="w-full bg-gray-950 border {draft.time ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Missing" />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">{draft.time ? '✅' : '❌'}</div>
                    </div>
                </div>

                <!-- Room -->
                <div class="col-span-2 sm:col-span-1">
                    <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Room</label>
                    <div class="relative mt-1">
                        <input bind:value={draft.room} class="w-full bg-gray-950 border {draft.room ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Missing" />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">{draft.room ? '✅' : '❌'}</div>
                    </div>
                </div>

                <!-- Row & Seat -->
                <div class="col-span-2 sm:col-span-1 flex gap-3">
                    <div class="flex-1">
                        <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Row</label>
                        <div class="relative mt-1">
                            <input bind:value={draft.row} class="w-full bg-gray-950 border {draft.row ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-center" placeholder="-" />
                        </div>
                    </div>

                    <div class="flex-1">
                        <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Seat</label>
                        <div class="relative mt-1">
                            <input bind:value={draft.seat} class="w-full bg-gray-950 border {draft.seat ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-center" placeholder="-" />
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onclick={generateTicket}
                disabled={!isComplete}
                class="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
            >
                {isComplete ? 'Generate Pass' : 'Scan missing fields...'}
            </button>
        </div>

    {:else}
        <!-- Digital Pass View -->
        <div class="w-full max-w-sm mt-4 relative animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div class="bg-gradient-to-b from-indigo-950 to-gray-900 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-800 relative drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)]">
                
                <!-- Ticket Cutouts -->
                <div class="absolute top-[42%] -left-4 w-8 h-8 bg-gray-950 rounded-full border-r border-gray-800 z-10"></div>
                <div class="absolute top-[42%] -right-4 w-8 h-8 bg-gray-950 rounded-full border-l border-gray-800 z-10"></div>

                <!-- Upper Section -->
                <div class="p-8 pb-10 text-center relative">
                    <h2 class="text-[10px] uppercase tracking-[0.3em] text-indigo-400 font-bold mb-4">Cinema Pass</h2>
                    <h3 class="text-3xl font-bold text-white leading-tight">{draft.movie}</h3>
                </div>

                <!-- Divider -->
                <div class="relative w-full h-0 border-t-2 border-dashed border-gray-700"></div>

                <!-- Lower Section -->
                <div class="p-8 pt-8">
                    <div class="grid grid-cols-2 gap-y-6 gap-x-6">
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Date</p>
                            <p class="font-medium text-gray-100">{draft.date}</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time</p>
                            <p class="font-medium text-gray-100">{draft.time}</p>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Room</p>
                            <p class="font-bold text-white text-2xl">{draft.room}</p>
                        </div>
                        <div class="flex gap-4">
                            <div>
                                <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Row</p>
                                <p class="font-bold text-white text-2xl">{draft.row}</p>
                            </div>
                            <div>
                                <p class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Seat</p>
                                <p class="font-bold text-white text-2xl">{draft.seat}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Functional QR Code -->
                    <div class="w-full flex flex-col items-center mt-10">
                        <div class="bg-white p-3 rounded-2xl shadow-inner">
                            <!-- Using a public API to dynamically generate the QR Code based on the ticket ID -->
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${draft.ticketId}`} 
                                alt="Ticket QR Code" 
                                class="w-28 h-28 mix-blend-multiply"
                            />
                        </div>
                        <p class="text-[11px] font-mono tracking-[0.2em] text-gray-500 mt-4 uppercase">
                            {draft.ticketId}
                        </p>
                    </div>
                </div>
            </div>
            
            <button 
                onclick={scanAnother} 
                aria-label="Scan another receipt"
                class="w-full mt-8 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white font-medium py-4 rounded-xl transition-colors shadow-lg"
            >
                Scan Another Receipt
            </button>
        </div>
    {/if}
</div>