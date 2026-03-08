

// ===== State =====
const state = {
    completedOffers: [],
    offers: [],
    currentSlide: 0,
    totalSlides: 6,
    slideInterval: null,
};

// ===== DOM Elements =====
const elements = {
    offersLoading: document.getElementById('offersLoading'),
    offersList: document.getElementById('offersList'),
    offersError: document.getElementById('offersError'),
    completedCount: document.getElementById('completedCount'),
    progressFill: document.getElementById('progressFill'),
    successOverlay: document.getElementById('successOverlay'),
    redirectProgress: document.getElementById('redirectProgress'),
    countdown: document.getElementById('countdown'),
    countdownTimer: document.getElementById('countdownTimer'),
};

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    loadCompletedOffers();
    checkForCompletion();
    startCountdown('countdownTimer', 10, 0);
    startCommentSlideshow();
    initConfettiCanvas();

    // Show register button with animation
    const btnWrap = document.getElementById('registerBtnWrap');
    if (btnWrap) {
        btnWrap.style.display = 'flex';
    }

    // Show FB comments
    const fbCard = document.getElementById('fbCommentsCard');
    if (fbCard) {
        fbCard.style.display = 'block';
    }
});

// ===== Countdown Timer (10 minutes) =====
function startCountdown(elementId, minutes, seconds) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;

    function update() {
        const remaining = endTime - +new Date();

        if (remaining < 1000) {
            el.innerHTML = '<span style="color:red">Time is up!</span>';
            return;
        }

        const d = new Date(remaining);
        const hrs = d.getUTCHours();
        const mins = d.getUTCMinutes();
        const secs = d.getUTCSeconds();

        function pad(n) { return n <= 9 ? '0' + n : n; }

        el.textContent = (hrs ? hrs + ':' + pad(mins) : mins) + ':' + pad(secs);
        setTimeout(update, d.getUTCMilliseconds() + 500);
    }

    update();
}

// ===== Comment Slideshow =====
function startCommentSlideshow() {
    const slides = document.querySelectorAll('.comment-slide');
    if (slides.length === 0) return;

    state.totalSlides = slides.length;
    state.currentSlide = 0;

    state.slideInterval = setInterval(() => {
        // Hide current slide
        slides[state.currentSlide].classList.remove('active-slide');

        // Advance to next slide
        state.currentSlide = (state.currentSlide + 1) % state.totalSlides;

        // Show next slide
        slides[state.currentSlide].classList.add('active-slide');
    }, 4000); // Change every 4 seconds
}

// ===== Go to Offer Wall =====
function goToOfferWall() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    if (step1) {
        step1.style.opacity = '0';
        step1.style.transform = 'translateY(-20px)';
        step1.style.transition = 'all 0.4s ease';

        setTimeout(() => {
            step1.style.display = 'none';
            if (step2) {
                step2.style.display = 'block';
                step2.style.opacity = '0';
                step2.style.transform = 'translateY(20px)';
                step2.style.transition = 'all 0.4s ease';

                setTimeout(() => {
                    step2.style.opacity = '1';
                    step2.style.transform = 'translateY(0)';
                }, 50);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            loadOffers();
        }, 400);
    }

    // Stop comment slideshow
    if (state.slideInterval) {
        clearInterval(state.slideInterval);
    }
}

// ===== Load Completed Offers from Storage =====
function loadCompletedOffers() {
    try {
        const saved = localStorage.getItem('completedOffers');
        if (saved) {
            state.completedOffers = JSON.parse(saved);
            updateProgress();
        }
    } catch (e) { }
}

function saveCompletedOffers() {
    try {
        localStorage.setItem('completedOffers', JSON.stringify(state.completedOffers));
    } catch (e) { }
}

// ===== Check URL params (returning from offer) =====
function checkForCompletion() {
    const urlParams = new URLSearchParams(window.location.search);
    const offerId = urlParams.get('offer_id') || urlParams.get('aff_sub');

    if (offerId && urlParams.get('completed') === 'true') {
        loadCompletedOffers();
        markOfferCompleted(offerId);
        window.history.replaceState({}, document.title, window.location.pathname);

        // Jump directly to offer wall
        const step1 = document.getElementById('step1');
        const step2 = document.getElementById('step2');
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
        loadOffers();
    }
}

// ===== Load Offers from OGads API =====
async function loadOffers() {
    if (!elements.offersLoading || !elements.offersList || !elements.offersError) return;

    elements.offersLoading.style.display = 'block';
    elements.offersList.innerHTML = '';
    elements.offersError.style.display = 'none';

    try {
        const params = new URLSearchParams({ max: CONFIG.maxOffers || 10 });
        if (CONFIG.minOffers && CONFIG.minOffers !== 'null') params.append('min', CONFIG.minOffers);
        if (CONFIG.ctype && CONFIG.ctype !== 'null') params.append('ctype', CONFIG.ctype);
        if (CONFIG.affSub && CONFIG.affSub !== 'null') params.append('aff_sub', CONFIG.affSub);
        if (CONFIG.affSub2 && CONFIG.affSub2 !== 'null') params.append('aff_sub2', CONFIG.affSub2);
        if (CONFIG.affSub3 && CONFIG.affSub3 !== 'null') params.append('aff_sub3', CONFIG.affSub3);
        if (CONFIG.affSub4 && CONFIG.affSub4 !== 'null') params.append('aff_sub4', CONFIG.affSub4);
        if (CONFIG.affSub5 && CONFIG.affSub5 !== 'null') params.append('aff_sub5', CONFIG.affSub5);

        const response = await fetch(`${CONFIG.apiEndpoint}?${params.toString()}`);
        const data = await response.json();

        elements.offersLoading.style.display = 'none';

        const isSuccess = data.success === true || data.success === 1;
        const hasOffers = isSuccess && Array.isArray(data.offers) && data.offers.length > 0;

        if (hasOffers) {
            state.offers = data.offers;
            renderOffers(data.offers);
        } else {
            showError(data.error || 'No surveys available in your region. Please try again later.');
        }
    } catch (error) {
        elements.offersLoading.style.display = 'none';
        showError('Failed to connect to server');
    }
}

function showError(msg) {
    if (!elements.offersError) return;
    elements.offersError.style.display = 'block';
    const p = elements.offersError.querySelector('p');
    if (p) p.textContent = msg || 'Failed to load surveys';
}

// ===== Render Offers =====
function renderOffers(offers) {
    if (!elements.offersList) return;
    elements.offersList.innerHTML = '';

    const emojiSet = ['📋', '📱', '🎯', '📊', '💡', '🎁', '⭐', '🛒', '🏆', '💎'];

    offers.forEach((offer, index) => {
        const offerId = String(offer.offerid || offer.id || `offer_${index}`);
        const isCompleted = state.completedOffers.includes(offerId);
        const emoji = emojiSet[index % emojiSet.length];

        const offerName = offer.name || offer.name_short || 'Complete Survey';
        const offerLink = offer.link || '#';

        const el = document.createElement('a');
        el.href = isCompleted ? '#' : offerLink;
        el.target = isCompleted ? '_self' : '_blank';
        el.rel = 'noopener noreferrer';
        el.className = `offer-item${isCompleted ? ' completed' : ''}`;
        el.dataset.offerId = offerId;

        el.innerHTML = `
            <div class="offer-icon">
                <span class="offer-icon-emoji">${emoji}</span>
            </div>
            <div class="offer-content">
                <div class="offer-name">${offerName}</div>
            </div>
            <div class="offer-status">${isCompleted ? '✓' : '→'}</div>
        `;

        if (isCompleted) {
            el.addEventListener('click', e => e.preventDefault());
        } else {
            el.addEventListener('click', () => handleOfferClick(offer, offerId));
        }

        elements.offersList.appendChild(el);

        // Stagger animation
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        setTimeout(() => {
            el.style.transition = 'all 0.35s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 80);
    });
}

// ===== Handle Offer Click =====
function handleOfferClick(offer, offerId) {
    sessionStorage.setItem('pendingOffer', JSON.stringify({
        id: offerId,
        name: offer.name || offer.name_short || 'Survey',
        timestamp: Date.now()
    }));
}

// ===== Mark Offer Completed =====
function markOfferCompleted(offerId) {
    if (state.completedOffers.includes(offerId)) return;

    state.completedOffers.push(offerId);
    saveCompletedOffers();
    updateProgress();

    const el = document.querySelector(`[data-offer-id="${offerId}"]`);
    if (el) {
        el.classList.add('completed');
        const status = el.querySelector('.offer-status');
        if (status) status.textContent = '✓';
    }

    if (state.completedOffers.length >= CONFIG.requiredOffers) {
        showSuccessAndRedirect();
    }
}

// ===== Update Progress Bar =====
function updateProgress() {
    const completed = state.completedOffers.length;
    const required = CONFIG.requiredOffers;
    const pct = Math.min((completed / required) * 100, 100);

    if (elements.completedCount) elements.completedCount.textContent = completed;
    if (elements.progressFill) {
        elements.progressFill.style.width = `${pct}%`;
        if (completed >= required) {
            elements.progressFill.style.background = 'linear-gradient(90deg, #16a34a, #22c55e)';
        }
    }
}

// ===== Success + Redirect =====
function showSuccessAndRedirect() {
    if (!elements.successOverlay) return;
    elements.successOverlay.classList.add('active');
    createConfetti();

    let seconds = 3;
    let progress = 0;

    const progInterval = setInterval(() => {
        progress += 33.33;
        if (elements.redirectProgress) {
            elements.redirectProgress.style.width = `${Math.min(progress, 100)}%`;
        }
    }, 1000);

    const cdInterval = setInterval(() => {
        seconds--;
        if (elements.countdown) elements.countdown.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(cdInterval);
            clearInterval(progInterval);
            localStorage.removeItem('completedOffers');
            sessionStorage.removeItem('pendingOffer');
            window.location.href = CONFIG.redirectUrl;
        }
    }, 1000);
}

// ===== Confetti (CSS version) =====
function createConfetti() {
    const wrap = document.getElementById('confettiWrap');
    if (!wrap) return;

    const colors = ['#1b5fc5', '#7c3aed', '#16a34a', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

    for (let i = 0; i < 70; i++) {
        setTimeout(() => {
            const c = document.createElement('div');
            c.className = 'confetti-piece';
            c.style.left = `${Math.random() * 100}%`;
            c.style.width = `${Math.random() * 10 + 4}px`;
            c.style.height = `${Math.random() * 10 + 4}px`;
            c.style.background = colors[Math.floor(Math.random() * colors.length)];
            c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            c.style.animationDuration = `${Math.random() * 2.5 + 2}s`;
            c.style.animationDelay = `${Math.random() * 0.5}s`;
            wrap.appendChild(c);
            setTimeout(() => c.remove(), 5000);
        }, i * 25);
    }
}

// ===== Canvas Confetti Animation (from reference) =====
const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;

var viewWidth = 580,
    viewHeight = 350,
    drawingCanvas = null,
    ctx = null,
    timeStep = (1 / 120);

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

function Particle(p0, p1, p2, p3) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.time = 0;
    this.duration = 3 + Math.random() * 2;
    this.color = '#' + Math.floor((Math.random() * 0xffffff)).toString(16).padStart(6, '0');
    this.w = 8;
    this.h = 6;
    this.complete = false;
}

Particle.prototype = {
    update: function () {
        this.time = Math.min(this.duration, this.time + timeStep);
        var f = Ease.outCubic(this.time, 0, 1, this.duration);
        var p = cubeBezier(this.p0, this.p1, this.p2, this.p3, f);
        var dx = p.x - (this.x || 0);
        var dy = p.y - (this.y || 0);
        this.r = Math.atan2(dy, dx) + HALF_PI;
        this.sy = Math.sin(Math.PI * f * 10);
        this.x = p.x;
        this.y = p.y;
        this.complete = this.time === this.duration;
    },
    draw: function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.r);
        ctx.scale(1, this.sy);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w * 0.5, -this.h * 0.5, this.w, this.h);
        ctx.restore();
    }
};

function Loader(x, y) {
    this.x = x;
    this.y = y;
    this.r = 1;
    this._progress = 0;
    this.complete = false;
}

Loader.prototype = {
    reset: function () {
        this._progress = 0;
        this.complete = false;
    },
    set progress(p) {
        this._progress = p < 0 ? 0 : (p > 1 ? 1 : p);
        this.complete = this._progress === 1;
    },
    get progress() {
        return this._progress;
    },
    draw: function () {
        ctx.fillStyle = '#00000000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, -HALF_PI, TWO_PI * this._progress - HALF_PI);
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fill();
    }
};

function Exploader(x, y) {
    this.x = x;
    this.y = y;
    this.startRadius = 4;
    this.time = 0;
    this.duration = 0.4;
    this.progress = 0;
    this.complete = false;
}

Exploader.prototype = {
    reset: function () {
        this.time = 0;
        this.progress = 0;
        this.complete = false;
    },
    update: function () {
        this.time = Math.min(this.duration, this.time + timeStep);
        this.progress = Ease.inBack(this.time, 0, 1, this.duration);
        this.complete = this.time === this.duration;
    },
    draw: function () {
        ctx.fillStyle = '#00000000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.startRadius * (1 - this.progress), 0, TWO_PI);
        ctx.fill();
    }
};

var particles = [],
    loader,
    exploader,
    phase = 0;

function initConfettiCanvas() {
    drawingCanvas = document.getElementById('confettiCanvas');
    if (!drawingCanvas) return;

    drawingCanvas.width = viewWidth;
    drawingCanvas.height = viewHeight;
    ctx = drawingCanvas.getContext('2d');

    createCanvasLoader();
    createCanvasExploader();
    createCanvasParticles();
    requestAnimationFrame(canvasLoop);
}

function createCanvasLoader() {
    loader = new Loader(viewWidth * 0.5, viewHeight * 0.5);
}

function createCanvasExploader() {
    exploader = new Exploader(viewWidth * 0.5, viewHeight * 0.5);
}

function createCanvasParticles() {
    for (var i = 0; i < 128; i++) {
        var p0 = new Point(viewWidth * 0.5, viewHeight * 0.5);
        var p1 = new Point(Math.random() * viewWidth, Math.random() * viewHeight);
        var p2 = new Point(Math.random() * viewWidth, Math.random() * viewHeight);
        var p3 = new Point(Math.random() * viewWidth, viewHeight + 64);
        particles.push(new Particle(p0, p1, p2, p3));
    }
}

function canvasUpdate() {
    switch (phase) {
        case 0:
            loader.progress += (1 / 40);
            break;
        case 1:
            exploader.update();
            break;
        case 2:
            particles.forEach(function (p) { p.update(); });
            break;
    }
}

function canvasDraw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, viewWidth, viewHeight);
    switch (phase) {
        case 0:
            loader.draw();
            break;
        case 1:
            exploader.draw();
            break;
        case 2:
            particles.forEach(function (p) { p.draw(); });
            break;
    }
}

function canvasLoop() {
    canvasUpdate();
    canvasDraw();
    if (phase === 0 && loader.complete) {
        phase = 1;
    } else if (phase === 1 && exploader.complete) {
        phase = 2;
    } else if (phase === 2 && checkCanvasParticlesComplete()) {
        phase = 0;
        loader.reset();
        exploader.reset();
        particles.length = 0;
        createCanvasParticles();
    }
    requestAnimationFrame(canvasLoop);
}

function checkCanvasParticlesComplete() {
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].complete === false) return false;
    }
    return true;
}

var Ease = {
    inCubic: function (t, b, c, d) {
        t /= d;
        return c * t * t * t + b;
    },
    outCubic: function (t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    },
    inOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    },
    inBack: function (t, b, c, d, s) {
        s = s || 1.8;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    }
};

function cubeBezier(p0, c0, c1, p1, t) {
    var p = new Point();
    var nt = (1 - t);
    p.x = nt * nt * nt * p0.x + 3 * nt * nt * t * c0.x + 3 * nt * t * t * c1.x + t * t * t * p1.x;
    p.y = nt * nt * nt * p0.y + 3 * nt * nt * t * c0.y + 3 * nt * t * t * c1.y + t * t * t * p1.y;
    return p;
}

// ===== Testing Helpers =====
window.completeOffer = function (offerId) {
    if (!offerId && state.offers.length > 0) {
        for (const offer of state.offers) {
            const id = String(offer.offerid || offer.id);
            if (!state.completedOffers.includes(id)) {
                markOfferCompleted(id);
                console.log('✓ Completed:', offer.name || offer.name_short);
                return;
            }
        }
    } else {
        markOfferCompleted(String(offerId));
    }
};

window.resetProgress = function () {
    state.completedOffers = [];
    localStorage.removeItem('completedOffers');
    location.reload();
};

window.skipToOfferWall = function () {
    goToOfferWall();
};

console.log('%c🎉 Prize Landing Page', 'font-size:18px;font-weight:bold;color:#1b5fc5;');
console.log('%c Flow: Congratulations → Register → Offer Wall → Redirect', 'font-size:11px;color:#6b7280;');
console.log('%c Testing commands:', 'font-size:11px;color:#6b7280;');
console.log('%c   skipToOfferWall() - Jump to offer wall', 'font-size:11px;color:#9ca3af;');
console.log('%c   completeOffer()   - Complete next offer', 'font-size:11px;color:#9ca3af;');
console.log('%c   resetProgress()   - Reset all progress', 'font-size:11px;color:#9ca3af;');
