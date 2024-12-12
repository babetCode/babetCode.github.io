class BeatMaker {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.bpm = 120;
        this.isPlaying = false;
        this.currentStep = 0;
        this.tracks = [
            { name: 'Kick', buffer: null, url: '../sounds/kick.wav' },
            { name: 'Snare', buffer: null, url: '../sounds/snare.wav' },
            { name: 'Hi-Hat', buffer: null, url: '../sounds/hihat.wav' },
            { name: 'Clap', buffer: null, url: '../sounds/clap.wav' }
        ];
        this.grid = this.tracks.map(() => new Array(16).fill(false));
        
        this.initUI();
        this.loadSounds();
    }

    async loadSounds() {
        for (let track of this.tracks) {
            try {
                const response = await fetch(track.url);
                const arrayBuffer = await response.arrayBuffer();
                track.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
            } catch (error) {
                console.error(`Failed to load sound for ${track.name}:`, error);
            }
        }
    }

    playSound(buffer) {
        if (!buffer) return;
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }

    initUI() {
        this.createSequencerGrid();
        this.setupControls();
    }

    createSequencerGrid() {
        const grid = document.getElementById('sequencer-grid');
        grid.innerHTML = '';

        this.tracks.forEach((track, trackIndex) => {
            const trackRow = document.createElement('div');
            trackRow.className = 'flex items-center';
            
            const trackLabel = document.createElement('div');
            trackLabel.textContent = track.name;
            trackLabel.className = 'w-20 text-right mr-4';
            trackRow.appendChild(trackLabel);

            for (let i = 0; i < 16; i++) {
                const step = document.createElement('button');
                step.className = `w-8 h-8 m-0.5 border rounded step-inactive 
                    ${i % 4 === 0 ? 'border-gray-400' : 'border-gray-200'}`;
                
                step.addEventListener('click', () => {
                    this.grid[trackIndex][i] = !this.grid[trackIndex][i];
                    step.classList.toggle('step-active');
                    step.classList.toggle('step-inactive');
                });

                trackRow.appendChild(step);
            }

            grid.appendChild(trackRow);
        });
    }

    setupControls() {
        const playPauseBtn = document.getElementById('play-pause');
        const bpmDecreaseBtn = document.getElementById('bpm-decrease');
        const bpmIncreaseBtn = document.getElementById('bpm-increase');
        const bpmDisplay = document.getElementById('bpm-display');

        playPauseBtn.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            playPauseBtn.textContent = this.isPlaying ? 'Pause' : 'Play';
            
            if (this.isPlaying) {
                this.startSequencer();
            } else {
                this.stopSequencer();
            }
        });

        bpmDecreaseBtn.addEventListener('click', () => {
            this.bpm = Math.max(40, this.bpm - 1);
            bpmDisplay.textContent = `${this.bpm} BPM`;
            if (this.isPlaying) {
                this.stopSequencer();
                this.startSequencer();
            }
        });

        bpmIncreaseBtn.addEventListener('click', () => {
            this.bpm = Math.min(240, this.bpm + 1);
            bpmDisplay.textContent = `${this.bpm} BPM`;
            if (this.isPlaying) {
                this.stopSequencer();
                this.startSequencer();
            }
        });
    }

    startSequencer() {
        const interval = (60000 / (this.bpm * 4));
        
        this.sequencerInterval = setInterval(() => {
            const gridButtons = document.querySelectorAll('#sequencer-grid button');
            
            // Remove previous step highlight
            gridButtons.forEach(btn => btn.classList.remove('step-current'));
            
            // Highlight current step
            gridButtons.forEach((btn, index) => {
                const trackIndex = Math.floor(index / 16);
                const stepIndex = index % 16;
                
                if (stepIndex === this.currentStep) {
                    btn.classList.add('step-current');
                    
                    // Play sound if step is active
                    if (this.grid[trackIndex][stepIndex]) {
                        this.playSound(this.tracks[trackIndex].buffer);
                    }
                }
            });

            this.currentStep = (this.currentStep + 1) % 16;
        }, interval);
    }

    stopSequencer() {
        clearInterval(this.sequencerInterval);
        this.currentStep = 0;
        
        // Remove all step highlights
        const gridButtons = document.querySelectorAll('#sequencer-grid button');
        gridButtons.forEach(btn => btn.classList.remove('step-current'));
    }
}

// Initialize the Beat Maker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.beatMaker = new BeatMaker();
});