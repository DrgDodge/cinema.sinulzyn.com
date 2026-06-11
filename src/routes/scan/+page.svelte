<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import Tesseract from 'tesseract.js';
    import jsQR from 'jsqr';

    let videoElement = $state<HTMLVideoElement>();
    let canvasElement = $state<HTMLCanvasElement>();
    let overlayCanvas = $state<HTMLCanvasElement>();
    let stream = $state<MediaStream | null>(null);
    
    let processing = $state(false);
    let progress = $state(0);

    // AR Tracking loop ID
    let animId = 0;
    
    // Live AR Text state
    let tesseractWorker: Tesseract.Worker | null = null;
    let isWorkerBusy = false;
    let liveWordBoxes: { x: number, y: number, w: number, h: number }[] = $state([]);

    // Camera switching state
    let videoDevices = $state<MediaDeviceInfo[]>([]);
    let currentDeviceIndex = $state(0);
    
    // Accumulate the scanned data here
    let draft = $state({
        movie: '',
        date: '',
        time: '',
        room: '',
        row: '',
        seat: '',
        qrData: '', 
        qrText: ''
    });

    let showTicket = $state(false);
    let isComplete = $derived(!!(draft.movie && draft.date && draft.time && draft.room && draft.row && draft.seat));

    onMount(async () => {
        if (browser) {
            // Initialize persistent Tesseract worker with a logger
            tesseractWorker = await Tesseract.createWorker('ron+eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        progress = Math.round(m.progress * 100);
                    }
                }
            });
            await startCamera();
        }
    });

    onDestroy(() => {
        if (browser) {
            stopStream();
            if (tesseractWorker) tesseractWorker.terminate();
        }
    });

    async function getDevices() {
        if (!browser) return;
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            videoDevices = devices.filter(d => d.kind === 'videoinput');
        } catch (e) {
            console.error('Error enumerating devices:', e);
        }
    }

    async function startCamera(deviceId?: string) {
        if (!browser) return;
        stopStream();
        try {
            const constraints: MediaStreamConstraints = {
                video: deviceId 
                    ? { deviceId: { exact: deviceId }, width: { ideal: 2560 }, height: { ideal: 1440 } } 
                    : { facingMode: 'environment', width: { ideal: 2560 }, height: { ideal: 1440 } }
            };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoElement && stream) {
                videoElement.srcObject = stream;
                
                videoElement.onplay = () => {
                    startARLoop();
                };
            }
            
            if (videoDevices.length === 0) {
                await getDevices();
                if (!deviceId && stream && videoDevices.length > 0) {
                    const activeTrack = stream.getVideoTracks()[0];
                    if (activeTrack) {
                        const activeLabel = activeTrack.label;
                        const idx = videoDevices.findIndex(d => d.label === activeLabel);
                        if (idx !== -1) {
                            currentDeviceIndex = idx;
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Camera error. Ensure you are on HTTPS:', err);
        }
    }

    function switchCamera() {
        if (videoDevices.length > 1) {
            currentDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
            startCamera(videoDevices[currentDeviceIndex].deviceId);
        }
    }

    function stopStream() {
        if (typeof cancelAnimationFrame !== 'undefined') {
            cancelAnimationFrame(animId);
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    function getCoverTransforms() {
        if (!videoElement || !overlayCanvas) return { scale: 1, offsetX: 0, offsetY: 0 };
        
        const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
        const displayRatio = overlayCanvas.width / overlayCanvas.height;
        let scale, offsetX, offsetY;

        if (displayRatio > videoRatio) {
            scale = overlayCanvas.width / videoElement.videoWidth;
            offsetX = 0;
            offsetY = (overlayCanvas.height - (videoElement.videoHeight * scale)) / 2;
        } else {
            scale = overlayCanvas.height / videoElement.videoHeight;
            offsetX = (overlayCanvas.width - (videoElement.videoWidth * scale)) / 2;
            offsetY = 0;
        }
        return { scale, offsetX, offsetY };
    }

    function startARLoop() {
        if (!browser || !videoElement || !overlayCanvas) return;
        
        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
        
        const textOffscreen = document.createElement('canvas');
        const textOffCtx = textOffscreen.getContext('2d', { willReadFrequently: true });
        
        if (!offCtx || !textOffCtx) return;

        function tick() {
            if (!videoElement || !overlayCanvas || processing || videoElement.paused || videoElement.ended) {
                return;
            }

            if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
                overlayCanvas.width = overlayCanvas.clientWidth;
                overlayCanvas.height = overlayCanvas.clientHeight;
                const oCtx = overlayCanvas.getContext('2d');
                if (!oCtx) return;

                oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                const transforms = getCoverTransforms();

                // 1. FAST QR CODE DETECTION (Runs every frame)
                offscreen.width = 400;
                offscreen.height = Math.floor(400 / (videoElement.videoWidth / videoElement.videoHeight));
                offCtx.drawImage(videoElement, 0, 0, offscreen.width, offscreen.height);
                
                const imgData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
                const code = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: "attemptBoth" });

                const scaleToVideo = videoElement.videoWidth / offscreen.width;

                if (code) {
                    draft.qrData = code.data;
                    
                    const mapPt = (pt: {x: number, y: number}) => ({
                        x: (pt.x * scaleToVideo) * transforms.scale + transforms.offsetX,
                        y: (pt.y * scaleToVideo) * transforms.scale + transforms.offsetY
                    });
                    
                    const pt1 = mapPt(code.location.topLeftCorner);
                    const pt2 = mapPt(code.location.topRightCorner);
                    const pt3 = mapPt(code.location.bottomRightCorner);
                    const pt4 = mapPt(code.location.bottomLeftCorner);
                    
                    oCtx.beginPath();
                    oCtx.moveTo(pt1.x, pt1.y);
                    oCtx.lineTo(pt2.x, pt2.y);
                    oCtx.lineTo(pt3.x, pt3.y);
                    oCtx.lineTo(pt4.x, pt4.y);
                    oCtx.closePath();
                    oCtx.lineWidth = 4;
                    oCtx.strokeStyle = "#22c55e"; 
                    oCtx.fillStyle = "rgba(34, 197, 94, 0.3)";
                    oCtx.fill();
                    oCtx.stroke();
                }

                // 2. LIVE TEXT DRAWING (Draws cached boxes every frame)
                oCtx.strokeStyle = "rgba(59, 130, 246, 0.8)"; // Blue boxes for live text
                oCtx.lineWidth = 2;
                oCtx.fillStyle = "rgba(59, 130, 246, 0.1)";
                liveWordBoxes.forEach(box => {
                    const x = box.x * transforms.scale + transforms.offsetX;
                    const y = box.y * transforms.scale + transforms.offsetY;
                    const w = box.w * transforms.scale;
                    const h = box.h * transforms.scale;
                    oCtx.strokeRect(x, y, w, h);
                    oCtx.fillRect(x, y, w, h);
                });

                // 3. BACKGROUND OCR PROCESSING (Fires async when not busy)
                if (!isWorkerBusy && tesseractWorker && !processing) {
                    isWorkerBusy = true;
                    
                    // Downscale slightly to keep live AR fast, but keep contrast high
                    textOffscreen.width = 1000;
                    textOffscreen.height = Math.floor(1000 / (videoElement.videoWidth / videoElement.videoHeight));
                    
                    textOffCtx.filter = 'grayscale(100%) contrast(250%) brightness(120%)';
                    textOffCtx.drawImage(videoElement, 0, 0, textOffscreen.width, textOffscreen.height);
                    textOffCtx.filter = 'none';
                    
                    const textScaleToVideo = videoElement.videoWidth / textOffscreen.width;
                    const dataUrl = textOffscreen.toDataURL('image/jpeg', 0.8);

                    tesseractWorker.recognize(dataUrl).then(result => {
                        // Cache the bounding boxes for the render loop
                        liveWordBoxes = result.data.words.map(w => ({
                            x: w.bbox.x0 * textScaleToVideo,
                            y: w.bbox.y0 * textScaleToVideo,
                            w: (w.bbox.x1 - w.bbox.x0) * textScaleToVideo,
                            h: (w.bbox.y1 - w.bbox.y0) * textScaleToVideo
                        }));
                        isWorkerBusy = false;
                    }).catch(e => {
                        console.error("Live OCR err:", e);
                        ocrDebugError = 'Live Error: ' + e?.message;
                        isWorkerBusy = false;
                    });
                }
            }
            if (typeof requestAnimationFrame !== 'undefined') animId = requestAnimationFrame(tick);
        }
        if (typeof requestAnimationFrame !== 'undefined') animId = requestAnimationFrame(tick);
    }

    async function captureAndScan() {
        if (!browser || !videoElement || !canvasElement || !overlayCanvas || !tesseractWorker) return;

        processing = true;
        progress = 0;
        if (typeof cancelAnimationFrame !== 'undefined') {
            cancelAnimationFrame(animId);
        }
        videoElement.pause(); 

        const ctx = canvasElement.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        ctx.filter = 'grayscale(100%) contrast(250%) brightness(120%)';
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        ctx.filter = 'none';
        
        const enhancedImageUrl = canvasElement.toDataURL('image/jpeg', 1.0);

        try {
            // Use the ALREADY RUNNING persistent worker so it doesn't crash the browser by spinning up a new one
            const result = await tesseractWorker.recognize(enhancedImageUrl);
            
            // Clear AR boxes and draw the final exact ones
            const oCtx = overlayCanvas.getContext('2d');
            const transforms = getCoverTransforms();
            
            if (oCtx && transforms) {
                oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                
                result.data.words.forEach(word => {
                    const x = word.bbox.x0 * transforms.scale + transforms.offsetX;
                    const y = word.bbox.y0 * transforms.scale + transforms.offsetY;
                    const w = (word.bbox.x1 - word.bbox.x0) * transforms.scale;
                    const h = (word.bbox.y1 - word.bbox.y0) * transforms.scale;
                    
                    oCtx.strokeStyle = "rgba(34, 197, 94, 0.8)";
                    oCtx.lineWidth = 2;
                    oCtx.strokeRect(x, y, w, h);
                    oCtx.fillStyle = "rgba(34, 197, 94, 0.2)";
                    oCtx.fillRect(x, y, w, h);
                });
            }

            parseReceipt(result.data.text);
        } catch (err) {
            console.error('OCR Error:', err);
        } finally {
            processing = false;
        }
    }

    function parseReceipt(text: string) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        const dateTimeRegex = /D[A4]T[A4][:;\s]*([\d.]+)\s*[O0]R[A4][:;\s]*([\d:]+)/i;
        const roomRegex = /S[A4]L[A4]\s*([O0]?\d+)/i;
        const seatRegex = /R[A4]NDUL[:;\s]*(\d+)\s*L[O0]CUL[:;\s]*(\d+)/i;
        const idRegex = /\b([A-Z0-9]{9,25})\b/i; 

        const dateLineIndex = lines.findIndex(l => dateTimeRegex.test(l));

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            const dtMatch = line.match(dateTimeRegex);
            if (dtMatch) {
                if (!draft.date) draft.date = dtMatch[1];
                if (!draft.time) draft.time = dtMatch[2];
            }

            const roomMatch = line.match(roomRegex);
            if (roomMatch && !draft.room) {
                draft.room = roomMatch[1].replace(/[O0]/g, '0');
            }

            const seatMatch = line.match(seatRegex);
            if (seatMatch) {
                if (!draft.row) draft.row = seatMatch[1];
                if (!draft.seat) draft.seat = seatMatch[2];
            }

            const idMatch = line.match(idRegex);
            if (idMatch && !draft.qrText) {
                draft.qrText = idMatch[1];
            }
        }

        if (dateLineIndex > 0 && !draft.movie) {
            for (let j = dateLineIndex - 1; j >= 0; j--) {
                let m = lines[j].trim();
                if (/^(2D|3D|4DX|IMAX|VIP|SUB|DUB|ATMOS|MACRO|AP12|N15|IM18|\s|,)+$/i.test(m)) continue;
                if (m.length < 3) continue; 
                m = m.replace(/[\s\-,;]+[\dOIl]$/, '');
                draft.movie = m;
                break; 
            }
        }
    }

    function generateTicket() {
        if (!draft.qrData && draft.qrText) {
            draft.qrData = draft.qrText; 
        } else if (!draft.qrData) {
            draft.qrData = Math.floor(Math.random() * 9000000000) + 1000000000 + '';
        }
        
        if (!draft.qrText) {
            draft.qrText = draft.qrData;
        }

        showTicket = true;
        stopStream();
    }

    async function scanAnother() {
        draft = { movie: '', date: '', time: '', room: '', row: '', seat: '', qrData: '', qrText: '' };
        liveWordBoxes = [];
        showTicket = false;
        
        if (browser && videoElement) {
            const oCtx = overlayCanvas?.getContext('2d');
            if (oCtx && overlayCanvas) {
                oCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            }
            if (!tesseractWorker) {
                tesseractWorker = await Tesseract.createWorker('ron+eng');
            }
            videoElement.play();
            startARLoop();
        } else {
            startCamera();
        }
    }
</script>

<svelte:head>
    <title>Scan Receipt - Cinema Wallet</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-white flex flex-col items-center p-6 font-sans pb-24">
    <h1 class="text-2xl font-bold mb-6 mt-4 tracking-tight">Scanner</h1>

    {#if ocrDebugError}
        <div class="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 w-full max-w-sm break-words">
            <strong>Debug Error:</strong> {ocrDebugError}
        </div>
    {/if}

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
            
            <!-- Transparent AR Overlay Canvas -->
            <canvas bind:this={overlayCanvas} class="absolute inset-0 w-full h-full z-10 pointer-events-none"></canvas>

            <!-- Guide Overlay -->
            <div class="absolute inset-0 border-[2px] border-white/20 m-6 rounded-xl pointer-events-none"></div>

            <!-- Switch Camera Button -->
            {#if videoDevices.length > 1}
                <button 
                    onclick={switchCamera}
                    class="absolute top-4 right-4 bg-gray-950/60 backdrop-blur-md border border-gray-700 p-2.5 rounded-full text-white hover:bg-gray-800 transition-colors z-20 shadow-lg"
                    aria-label="Switch Camera"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
            {/if}

            {#if processing}
                <div class="absolute inset-0 bg-gray-950/80 flex flex-col items-center justify-center backdrop-blur-md z-30">
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
        <div class="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-2xl z-40">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-sm font-semibold text-white">Scan Data</h3>
                <span class="text-[10px] uppercase tracking-wider text-blue-400 font-bold px-2 py-1 bg-blue-500/10 rounded-md">Editable</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <!-- Movie Name -->
                <div class="col-span-2">
                    <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Movie</label>
                    <div class="relative mt-1">
                        <input bind:value={draft.movie} class="w-full bg-gray-950 border {draft.movie ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Missing..." />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">{draft.movie ? '✅' : '❌'}</div>
                    </div>
                </div>

                <!-- Date & Time -->
                <div>
                    <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Date</label>
                    <div class="relative mt-1">
                        <input bind:value={draft.date} class="w-full bg-gray-950 border {draft.date ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Missing" />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">{draft.date ? '✅' : '❌'}</div>
                    </div>
                </div>
                <div>
                    <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Time</label>
                    <div class="relative mt-1">
                        <input bind:value={draft.time} class="w-full bg-gray-950 border {draft.time ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" placeholder="Missing" />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">{draft.time ? '✅' : '❌'}</div>
                    </div>
                </div>

                <!-- Room, Row, Seat -->
                <div class="col-span-2 flex gap-3">
                    <div class="flex-1">
                        <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Room</label>
                        <div class="relative mt-1">
                            <input bind:value={draft.room} class="w-full bg-gray-950 border {draft.room ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors text-center" placeholder="-" />
                        </div>
                    </div>
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

                <!-- QR Payload & Text -->
                <div class="col-span-2 flex gap-3 mt-2 pt-4 border-t border-gray-800">
                    <div class="flex-1">
                        <label class="text-[10px] uppercase text-gray-500 font-medium ml-1 flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                            QR Detected
                        </label>
                        <div class="relative mt-1 flex items-center h-10 px-3 bg-gray-950 border {draft.qrData ? 'border-green-500/30 text-green-400' : 'border-gray-800 text-gray-500'} rounded-xl text-xs font-mono overflow-hidden">
                            {draft.qrData ? draft.qrData.substring(0, 12) + '...' : 'Not found yet'}
                        </div>
                    </div>
                    <div class="flex-1">
                        <label class="text-[10px] uppercase text-gray-500 font-medium ml-1">Printed ID Text</label>
                        <div class="relative mt-1">
                            <input bind:value={draft.qrText} class="w-full bg-gray-950 border {draft.qrText ? 'border-green-500/30 text-white' : 'border-red-500/30 text-red-200'} rounded-xl px-3 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors" placeholder="Missing" />
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
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(draft.qrData)}`} 
                                alt="Ticket QR Code" 
                                class="w-28 h-28 mix-blend-multiply"
                            />
                        </div>
                        <p class="text-[11px] font-mono tracking-[0.2em] text-gray-500 mt-4 uppercase">
                            {draft.qrText}
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