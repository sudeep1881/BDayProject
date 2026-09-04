// Global Variables
let currentSlideIndex = 0;
let currentTrack = 0;
let isPlaying = false;
let gameTimer;
let gameStartTime;
let moveCount = 0;
let currentDifficulty = 'easy';
let puzzlePieces = [];
let currentPuzzleImageIndex = -1;
let countdownInterval;
let targetBirthday = null;

// Audio tracks (using placeholder URLs - in real implementation, you'd have actual audio files)
// In your script.js file
const audioTracks = [
    {
        title: "Happy Birthday Song",
        artist: "Birthday Collection",
        duration: "2:30",
        src: "/date,photo,puzzle 700/audio/22.mp3"
    },
    {
        title: "Celebration Time",
        artist: "Party Hits",
        duration: "3:15",
        src: "/date,photo,puzzle 700/audio/23.mp3"
    },
    {
        title: "Party Anthem",
        artist: "Birthday Beats",
        duration: "2:45",
        src: "/date,photo,puzzle 700/audio/24.mp3"
    }
];

// Puzzle uses only her Chapter 3 special photos.
const puzzleImages = [
    "/images/specialmomentphotos/1707899947570.jpg",
    "/images/specialmomentphotos/WhatsApp%20Image%202026-09-04%20at%2011.49.42%20PM.jpeg",
    "/images/specialmomentphotos/WhatsApp%20Image%202026-09-05%20at%2012.07.21%20AM.jpeg",
    "/images/specialmomentphotos/WhatsApp%20Image%202026-09-05%20at%2012.16.20%20AM.jpeg",
    "/images/specialmomentphotos/1673534469868.jpg",
    "/images/specialmomentphotos/WhatsApp%20Image%202026-09-04%20at%2011.49.43%20PM.jpeg",
    "/images/specialmomentphotos/WhatsApp%20Image%202026-09-04%20at%2011.51.19%20PM.jpeg",
    "/images/specialmomentphotos/WhatsApp%20Image%202026-09-05%20at%2012.19.04%20AM.jpeg"
];

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progress');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const vinylRecord = document.getElementById('vinylRecord');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

    initializeNavigation();
    initializeBackgroundAnimations();
    initializeGallery();
    initializeMusicPlayer();
    initializePuzzleGame();
    initializePuzzleControls();
    initializeCountdown();
    //initializeEventListeners();

});

// Dedicated music chapter controls.
document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('journeyAudio');
    const play = document.getElementById('journeyPlay');
    const previous = document.getElementById('journeyPrevious');
    const next = document.getElementById('journeyNext');
    const progress = document.getElementById('journeyProgress');
    const title = document.getElementById('journeyTrackTitle');
    const artist = document.getElementById('journeyTrackArtist');
    const list = document.getElementById('journeyTrackList');
    if (!audio || !play || !previous || !next || !progress || !title || !artist || !list) return;

    const tracks = Array.from(list.querySelectorAll('button'));
    let index = 0;
    const selectTrack = function (newIndex, shouldPlay) {
        index = (newIndex + tracks.length) % tracks.length;
        const track = tracks[index];
        tracks.forEach(item => item.classList.toggle('active', item === track));
        audio.src = track.dataset.src;
        title.textContent = track.dataset.title;
        artist.textContent = track.dataset.artist;
        progress.style.width = '0%';
        if (shouldPlay) { audio.play(); play.textContent = 'Ⅱ'; }
    };
    play.addEventListener('click', function () {
        if (audio.paused) { audio.play(); play.textContent = 'Ⅱ'; } else { audio.pause(); play.textContent = '▶'; }
    });
    previous.addEventListener('click', () => selectTrack(index - 1, !audio.paused));
    next.addEventListener('click', () => selectTrack(index + 1, !audio.paused));
    tracks.forEach((track, trackIndex) => track.addEventListener('click', () => selectTrack(trackIndex, !audio.paused)));
    audio.addEventListener('timeupdate', () => { if (audio.duration) progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`; });
    audio.addEventListener('ended', () => selectTrack(index + 1, true));
});

document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('openLetter');
    const letter = document.getElementById('loveLetter');
    if (!button || !letter) return;
    button.addEventListener('click', function () { letter.hidden = false; button.hidden = true; });
});

// Initialize event listeners
function initializeMusicPlayer() {

    const audio = document.getElementById("audioPlayer");
    const trackTitle = document.getElementById("trackTitle");
    const trackArtist = document.getElementById("trackArtist");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const playlistItems = document.querySelectorAll(".playlist-item");

    let currentTrackIndex = 0;

    if (!audio || !trackTitle || !trackArtist || !playPauseBtn) {
        return;
    }

    function loadTrack(index) {

        const track = audioTracks[index];

        audio.src = track.src;
        audio.load();

        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;

        playlistItems.forEach(item => {
            item.classList.remove("active");
        });

        if (playlistItems[index]) {
            playlistItems[index].classList.add("active");
        }
    }

    async function playTrack() {

        try {
            await audio.play();
            playPauseBtn.textContent = "⏸️";
        }
        catch (error) {
            console.error("Audio playback failed:", error);
        }
    }

    function pauseTrack() {
        audio.pause();
        playPauseBtn.textContent = "▶️";
    }

    function selectTrack(index) {

        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playTrack();
    }

    // Load first song
    loadTrack(currentTrackIndex);

    // Play / Pause button
    playPauseBtn.addEventListener("click", () => {

        if (audio.paused) {
            playTrack();
        } else {
            pauseTrack();
        }

    });

    // Playlist click
    playlistItems.forEach((item, index) => {

        item.addEventListener("click", () => {
            selectTrack(index);
        });

    });

    // Next song when current song ends
    audio.addEventListener("ended", () => {

        currentTrackIndex++;

        if (currentTrackIndex >= audioTracks.length) {
            currentTrackIndex = 0;
        }

        selectTrack(currentTrackIndex);
    });
}

// Navigation Functions
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.getElementById('navbar');

        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        }
    });
}

// Background Animation Functions
function initializeBackgroundAnimations() {
    createConfetti();
    createParticles();
    
    // Regenerate confetti every 10 seconds
    setInterval(createConfetti, 10000);
    
    // Regenerate particles every 15 seconds
    setInterval(createParticles, 15000);
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing confetti
    
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#00cec9'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(confetti);
    }
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing particles
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
        container.appendChild(particle);
    }
}

// Celebration function
function celebrateNow() {
    // Trigger confetti explosion
    triggerConfettiExplosion();
    
    // Play celebration sound (if available)
    if (audioPlayer && !audioPlayer.src) {
        // If no audio is loaded, just show visual effects
        showCelebrationMessage();
    } else {
        togglePlay();
    }
    
    // Scroll to gallery section
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
        const offsetTop = gallerySection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function triggerConfettiExplosion() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    
    const colors = ['#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#00cec9'];
    
    // Create burst of confetti
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}

function showCelebrationMessage() {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ff6b9d, #4ecdc4);
        color: white;
        padding: 2rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 2000;
        animation: celebrationPop 0.5s ease-out;
        text-align: center;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    `;
    message.innerHTML = '🎉 Let the celebration begin! 🎉';
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}

// Gallery Functions
function initializeGallery() {
    // Add intersection observer for gallery animations
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

function changeView(viewType) {
    const gridView = document.getElementById('galleryGrid');
    const slideshowView = document.getElementById('gallerySlideshow');
    
    if (!gridView || !slideshowView) return;
    
    if (viewType === 'grid') {
        gridView.style.display = 'grid';
        slideshowView.style.display = 'none';
    } else if (viewType === 'slideshow') {
        gridView.style.display = 'none';
        slideshowView.style.display = 'block';
        startSlideshow();
    }
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function jumpToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    indicators[currentSlideIndex].classList.remove('active');
    
    currentSlideIndex = slideIndex;
    
    slides[currentSlideIndex].classList.add('active');
    indicators[currentSlideIndex].classList.add('active');
}

function startSlideshow() {
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Music Player Functions
function initializeMusicPlayer() {
    // Since we don't have actual audio files, we'll simulate the player
    updateTrackDisplay();
    
    // Simulate audio loading
    if (durationDisplay) {
        durationDisplay.textContent = audioTracks[currentTrack].duration;
    }
    
    // Progress bar click
    const progressContainer = document.querySelector('.progress-bar');
    if (progressContainer) {
        progressContainer.addEventListener('click', seek);
    }
    
    // Simulate time updates
    setInterval(updateProgressBar, 1000);
}

function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        if (playPauseBtn) playPauseBtn.textContent = '⏸️';
        if (vinylRecord) vinylRecord.classList.add('playing');
        
        // In a real implementation, you would start the audio
        // audioPlayer.play();
    } else {
        if (playPauseBtn) playPauseBtn.textContent = '▶️';
        if (vinylRecord) vinylRecord.classList.remove('playing');
        
        // In a real implementation, you would pause the audio
        // audioPlayer.pause();
    }
}

function previousTrack() {
    currentTrack = currentTrack > 0 ? currentTrack - 1 : audioTracks.length - 1;
    switchTrack();
}

function nextTrack() {
    currentTrack = currentTrack < audioTracks.length - 1 ? currentTrack + 1 : 0;
    switchTrack();
}

function selectTrack(trackIndex) {
    // Remove active class from all playlist items
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach(item => item.classList.remove('active'));
    
    // Add active class to selected track
    if (playlistItems[trackIndex]) {
        playlistItems[trackIndex].classList.add('active');
    }
    
    currentTrack = trackIndex;
    switchTrack();
}

function switchTrack() {
    updateTrackDisplay();
    
    // Reset progress
    if (progressBar) progressBar.style.width = '0%';
    if (currentTimeDisplay) currentTimeDisplay.textContent = '0:00';
    if (durationDisplay) durationDisplay.textContent = audioTracks[currentTrack].duration;
    
    // Update playlist active state
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentTrack);
    });
    
    // If playing, continue playing new track
    if (isPlaying) {
        // In real implementation: audioPlayer.src = audioTracks[currentTrack].src;
        // audioPlayer.play();
    }
}

function updateTrackDisplay() {
    const track = audioTracks[currentTrack];
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
}

function changeVolume() {
    if (!volumeSlider) return;
    const volume = volumeSlider.value / 100;
    // In real implementation: audioPlayer.volume = volume;
}

function seek(e) {
    const progressContainer = e.currentTarget;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (clickX / width) * 100;
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    
    // In real implementation, you would seek the audio:
    // const duration = audioPlayer.duration;
    // audioPlayer.currentTime = (percentage / 100) * duration;
}

function updateProgressBar() {
    if (isPlaying && progressBar) {
        // Simulate progress (in real implementation, use audioPlayer.currentTime)
        let currentWidth = parseFloat(progressBar.style.width) || 0;
        currentWidth += 0.5; // Simulate progress
        
        if (currentWidth >= 100) {
            currentWidth = 0;
            nextTrack(); // Auto-advance to next track
        }
        
        progressBar.style.width = currentWidth + '%';
        
        // Update time display (simulated)
        if (currentTimeDisplay) {
            const minutes = Math.floor(currentWidth * 0.03); // Rough simulation
            const seconds = Math.floor((currentWidth * 1.8) % 60);
            currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// Puzzle Game Functions
function initializePuzzleGame() {
    //changeDifficulty();
    startNewGame();
}

// The controls are bound once after the game page has loaded.
function initializePuzzleControls() {
    const newGameButton = document.getElementById('newGameBtn');
    const playAgainButton = document.getElementById('playAgainBtn');
    const completionNewGameButton = document.getElementById('completionNewGameBtn');
    const solutionButton = document.getElementById('showSolutionBtn');

    if (newGameButton) {
        newGameButton.addEventListener('click', () => startNewGame(true));
    }

    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => startNewGame(false));
    }

    if (completionNewGameButton) {
        completionNewGameButton.addEventListener('click', () => startNewGame(true));
    }

    if (solutionButton) {
        solutionButton.addEventListener('click', showSolution);
    }
}

//function changeDifficulty() {
//    const select = document.getElementById('difficultySelect');
//    if (!select) return;
    
//    currentDifficulty = select.value;
    
//    const puzzleBoard = document.getElementById('puzzleBoard');
//    if (!puzzleBoard) return;
    
//    let gridSize;
    
//    switch (currentDifficulty) {
//        case 'easy':
//            gridSize = 3;
//            break;
//        case 'medium':
//            gridSize = 4;
//            break;
//        case 'hard':
//            gridSize = 5;
//            break;
//    }
    
//    puzzleBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
//    puzzleBoard.style.width = '300px';
//    puzzleBoard.style.height = '300px';
//}

function startNewGame(useDifferentPhoto = false) {
    clearInterval(gameTimer);
    selectedPuzzlePiece = null;
    gameStartTime = Date.now();
    moveCount = 0;
    updateGameStats();
    
    generatePuzzle(useDifferentPhoto);
    shufflePuzzle();
    startGameTimer();
    
    // Hide completion screen
    const gameCompletion = document.getElementById('gameCompletion');
    if (gameCompletion) {
        gameCompletion.style.display = 'none';
    }
}

function generatePuzzle(useDifferentPhoto = false) {
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;

    const gridSize =
        currentDifficulty === 'easy' ? 3 :
            currentDifficulty === 'medium' ? 4 : 5;

    const totalPieces = gridSize * gridSize;

    puzzleBoard.innerHTML = '';
    puzzlePieces = [];

    // "New Game" always picks a photo different from the puzzle just completed.
    if (currentPuzzleImageIndex < 0) {
        currentPuzzleImageIndex = Math.floor(Math.random() * puzzleImages.length);
    } else if (useDifferentPhoto && puzzleImages.length > 1) {
        let nextIndex = Math.floor(Math.random() * (puzzleImages.length - 1));
        if (nextIndex >= currentPuzzleImageIndex) nextIndex++;
        currentPuzzleImageIndex = nextIndex;
    }
    const imageUrl = puzzleImages[currentPuzzleImageIndex];

    // Show solution image
    const solutionImage = document.getElementById('solutionImage');

    if (solutionImage) {
        solutionImage.src = imageUrl;
    }

    for (let i = 0; i < totalPieces; i++) {

        const piece = document.createElement('div');

        piece.className = 'puzzle-piece';

        piece.dataset.position = i;
        piece.dataset.correctPosition = i;

        const row = Math.floor(i / gridSize);
        const col = i % gridSize;

        // Background image
        piece.style.backgroundImage = `url("${imageUrl}")`;

        // Make the complete image fit across the whole puzzle
        piece.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`;

        // Position each individual piece
        piece.style.backgroundPosition =
            `${(col / (gridSize - 1)) * 100}% ${(row / (gridSize - 1)) * 100}%`;

        piece.style.backgroundRepeat = 'no-repeat';

        // Drag and drop
        piece.draggable = true;

        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragover', handleDragOver);
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener('dragend', handleDragEnd);
        piece.addEventListener('click', handlePuzzlePieceTap);

        puzzleBoard.appendChild(piece);

        puzzlePieces.push(piece);
    }
}
function shufflePuzzle() {
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    const pieces = Array.from(puzzlePieces);
    
    // Fisher-Yates shuffle
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }
    
    // Update positions
    pieces.forEach((piece, index) => {
        piece.dataset.position = index;
        puzzleBoard.appendChild(piece);
    });
}

let draggedElement = null;
let selectedPuzzlePiece = null;

function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    if (draggedElement && e.target !== draggedElement && e.target.classList.contains('puzzle-piece')) {
        swapPuzzlePieces(draggedElement, e.target);
    }
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

function handlePuzzlePieceTap(e) {
    const tappedPiece = e.currentTarget;
    if (selectedPuzzlePiece === tappedPiece) {
        tappedPiece.classList.remove('selected');
        selectedPuzzlePiece = null;
        return;
    }
    if (!selectedPuzzlePiece) {
        selectedPuzzlePiece = tappedPiece;
        tappedPiece.classList.add('selected');
        return;
    }
    swapPuzzlePieces(selectedPuzzlePiece, tappedPiece);
    selectedPuzzlePiece.classList.remove('selected');
    selectedPuzzlePiece = null;
}

function swapPuzzlePieces(firstPiece, secondPiece) {
    if (!firstPiece || !secondPiece || firstPiece === secondPiece) return;
    const firstPosition = firstPiece.dataset.position;
    firstPiece.dataset.position = secondPiece.dataset.position;
    secondPiece.dataset.position = firstPosition;
    const parent = firstPiece.parentNode;
    const firstMarker = document.createComment('first-piece');
    const secondMarker = document.createComment('second-piece');
    parent.replaceChild(firstMarker, firstPiece);
    parent.replaceChild(secondMarker, secondPiece);
    parent.replaceChild(firstPiece, secondMarker);
    parent.replaceChild(secondPiece, firstMarker);
    moveCount++;
    updateGameStats();
    checkPuzzleCompletion();
}

function checkPuzzleCompletion() {
    const isComplete = puzzlePieces.every(piece => 
        piece.dataset.position === piece.dataset.correctPosition
    );
    
    if (isComplete) {
        clearInterval(gameTimer);
        showCompletionMessage();
        triggerConfettiExplosion();
    }
}

function showCompletionMessage() {
    const completionDiv = document.getElementById('gameCompletion');
    const finalTime = document.getElementById('finalTime');
    const finalMoves = document.getElementById('finalMoves');
    const completionImage = document.getElementById('completionImage');
    
    if (!completionDiv || !finalTime || !finalMoves) return;
    
    const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    
    finalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    finalMoves.textContent = moveCount;
    if (completionImage) {
        const solutionImage = document.getElementById('solutionImage');
        completionImage.src = solutionImage?.currentSrc || solutionImage?.src || '';
    }
    
    // Place the overlay at the document level so it stays centered in the phone viewport,
    // even when the puzzle section itself has been scrolled.
    if (completionDiv.parentElement !== document.body) {
        document.body.appendChild(completionDiv);
    }
    completionDiv.style.display = 'flex';
}

function showSolution() {
    // Sort pieces to correct positions
    puzzlePieces.sort((a, b) => a.dataset.correctPosition - b.dataset.correctPosition);
    
    const puzzleBoard = document.getElementById('puzzleBoard');
    if (!puzzleBoard) return;
    
    puzzlePieces.forEach((piece, index) => {
        piece.dataset.position = index;
        puzzleBoard.appendChild(piece);
    });
    
    checkPuzzleCompletion();
}

function startGameTimer() {
    gameTimer = setInterval(() => {
        const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        const gameTimerElement = document.getElementById('gameTimer');
        if (gameTimerElement) {
            gameTimerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function updateGameStats() {
    const moveCounter = document.getElementById('moveCounter');
    if (moveCounter) {
        moveCounter.textContent = moveCount;
    }
}

// Countdown Functions
function initializeCountdown() {
    const birthdayInput = document.getElementById('birthdayDate');
    if (birthdayInput) {
        birthdayInput.value = '2026-09-06T00:00';
        birthdayInput.addEventListener('change', updateCountdown);
    }
    
    updateCountdown();
}

function updateCountdown() {
    const birthdayInput = document.getElementById('birthdayDate');
    if (!birthdayInput) return;
    
    const selectedDate = new Date(birthdayInput.value);
    
    if (!birthdayInput.value) {
        const countdownMessage = document.getElementById('countdownMessage');
        if (countdownMessage) {
            countdownMessage.innerHTML = '<p>Set your birthday date to start the countdown!</p>';
        }
        return;
    }
    
    targetBirthday = selectedDate;
    
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(calculateTimeRemaining, 1000);
    calculateTimeRemaining(); // Run immediately
}

function calculateTimeRemaining() {
    if (!targetBirthday) return;
    
    const now = new Date().getTime();
    const birthdayTime = targetBirthday.getTime();
    const timeDiff = birthdayTime - now;
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const messageDiv = document.getElementById('countdownMessage');
    
    if (timeDiff <= 0) {
        const hasPassed = timeDiff < -(24 * 60 * 60 * 1000);
        if (daysElement) daysElement.textContent = '00';
        if (hoursElement) hoursElement.textContent = '00';
        if (minutesElement) minutesElement.textContent = '00';
        if (secondsElement) secondsElement.textContent = '00';
        
        if (messageDiv) {
            messageDiv.classList.remove('is-birthday', 'is-passed');
            if (hasPassed) {
                messageDiv.innerHTML = '<span class="countdown-message-icon">♡</span><div><p class="countdown-message-label">The day may be ending, but my love for you grows stronger with every single second that passes.</p></div>';
                messageDiv.classList.add('is-passed');
            } else {
                messageDiv.innerHTML = '<span class="countdown-message-icon">🎂</span><div><p class="countdown-message-label">You make my world so much brighter just by being in it. I hope today brings you as much happiness as you give me. ✨</p></div>';
                messageDiv.classList.add('is-birthday');
            }
        }
        
        triggerConfettiExplosion();
        clearInterval(countdownInterval);
        
        return;
    }
    
    // Calculate time units
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // Update display
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    
    // Update message
    if (messageDiv) {
        messageDiv.classList.remove('is-birthday', 'is-passed');
        
        if (days > 1) {
            messageDiv.innerHTML = `<span class="countdown-message-icon">🎂</span><div><p class="countdown-message-label">The celebration is coming</p><p class="countdown-message-text">Only ${days} beautiful days to go.</p></div>`;
        } else if (days === 1) {
            messageDiv.innerHTML = '<span class="countdown-message-icon">✨</span><div><p class="countdown-message-label">Almost here</p><p class="countdown-message-text">Tomorrow is your special day!</p></div>';
        } else if (hours > 1) {
            messageDiv.innerHTML = `<span class="countdown-message-icon">⏰</span><div><p class="countdown-message-label">So close now</p><p class="countdown-message-text">Just ${hours} hours until the celebration.</p></div>`;
        } else if (minutes > 1) {
            messageDiv.innerHTML = `<span class="countdown-message-icon">⏱️</span><div><p class="countdown-message-label">The moment is near</p><p class="countdown-message-text">Only ${minutes} minutes left!</p></div>`;
        } else {
            messageDiv.innerHTML = `<span class="countdown-message-icon">⚡</span><div><p class="countdown-message-label">Get ready</p><p class="countdown-message-text">${seconds} seconds until birthday time!</p></div>`;
        }
    }
}

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Full-size photo viewer: images are intentionally shown with their complete aspect ratio.
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    if (!modal || !modalImage || !modalCaption) return;

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const image = item.querySelector('img');
            if (!image) return;
            modalImage.src = image.currentSrc || image.src;
            modalImage.alt = image.alt;
            modalCaption.textContent = item.dataset.caption || '';
            modal.showModal();
        });
    });

    modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Gallery slideshow keyboard controls
    const slideshowView = document.getElementById('gallerySlideshow');
    if (slideshowView && slideshowView.style.display !== 'none') {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
    
    // Music player keyboard controls
    if (e.key === ' ' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        togglePlay();
    }
    
    // Puzzle game keyboard controls
    if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        startNewGame(true);
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    // Adjust gallery layout on resize
    if (window.innerWidth <= 768) {
        // Mobile layout adjustments
        changeView('grid');
    }
});

// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause music when page is hidden
        if (isPlaying) {
            togglePlay();
        }
    }
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/300x200/ff6b9d/ffffff?text=Birthday+Image';
    });
});

// Touch support for mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        // Only handle swipes in gallery slideshow
        const slideshowView = document.getElementById('gallerySlideshow');
        if (slideshowView && slideshowView.style.display !== 'none') {
            if (diff > 0) {
                changeSlide(1); // Swipe left - next slide
            } else {
                changeSlide(-1); // Swipe right - previous slide
            }
        }
    }
}

// Special moments: the photo at the top of the wheel is mirrored in the center every three seconds.
document.addEventListener('DOMContentLoaded', function () {
    const orbit = document.querySelector('.memory-wheel__orbit');
    const center = document.getElementById('memoryWheelCenter');
    const preview = document.getElementById('memoryWheelPreview');
    const modal = document.getElementById('specialPhotoModal');
    const modalImage = document.getElementById('specialModalImage');
    const modalCaption = document.getElementById('specialModalCaption');
    if (!orbit || !center || !preview) return;

    const photos = Array.from(orbit.querySelectorAll('.wheel-photo'));
    let turn = 0;

    function showCenterPhoto(index) {
        const image = photos[index]?.querySelector('img');
        if (!image) return;
        preview.src = image.currentSrc || image.src;
        preview.alt = image.alt;
        center.classList.add('is-previewing');
    }

    showCenterPhoto(0);
    window.setInterval(function () {
        turn += 45;
        orbit.style.setProperty('--wheel-turn', `${turn}deg`);
        const topPhotoIndex = (photos.length - ((turn / 45) % photos.length)) % photos.length;
        showCenterPhoto(topPhotoIndex);
    }, 3000);

    photos.forEach(function (photo) {
        photo.addEventListener('click', function () {
            const image = photo.querySelector('img');
            if (!image) return;
            if (!modal || !modalImage) return;
            modalImage.src = image.currentSrc || image.src;
            modalImage.alt = image.alt;
            if (modalCaption) modalCaption.textContent = image.alt;
            modal.showModal();
        });
    });

    modal?.querySelector('.modal-close')?.addEventListener('click', () => modal.close());
    modal?.addEventListener('click', event => { if (event.target === modal) modal.close(); });
});
