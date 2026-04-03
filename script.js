// Global State
let voterData = {};
let selectedMethod = '';
let attemptCount = { fingerprint: 0, iris: 0, otp: 0 };
let timeLeft = 60;
let timerInterval;
let selectedCandidate = null;

// Sample Voter Database (Scenario 1)
const voterDatabase = {
    '123456789012': {
        name: 'ARIGELA ADARSH PATEL',
        mobile: '7386919842',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
        aadhar: '123456789012',
        voterId: '123456789012'
    }
};

// 10 Political Parties (VVPAT Style)
const parties = [
    { id: 'inc', name: 'Rahul Gandhi', party: 'Indian National Congress', symbol: '🌺', color: '#1e3a8a' },
    { id: 'bjp', name: 'Narendra Modi', party: 'Bharatiya Janata Party', symbol: '🦁', color: '#ff6b35' },
    { id: 'aap', name: 'Arvind Kejriwal', party: 'Aam Aadmi Party', symbol: '🧹', color: '#f7931e' },
    { id: 'sp', name: 'Akhilesh Yadav', party: 'Samajwadi Party', symbol: '🚲', color: '#e91e63' },
    { id: 'bsp', name: 'Mayawati', party: 'Bahujan Samaj Party', symbol: '🐘', color: '#00bcd4' },
    { id: 'ncp', name: 'Sharad Pawar', party: 'Nationalist Congress Party', symbol: '⭕', color: '#2196f3' },
    { id: 'shivsena', name: 'Uddhav Thackeray', party: 'Shiv Sena', symbol: '🏹', color: '#ff9800' },
    { id: 'dmk', name: 'M.K. Stalin', party: 'Dravida Munnetra Kazhagam', symbol: '🔱', color: '#1976d2' },
    { id: 'tmc', name: 'Mamata Banerjee', party: 'Trinamool Congress', symbol: '🌼', color: '#00d4aa' },
    { id: 'bjd', name: 'Naveen Patnaik', party: 'Biju Janata Dal', symbol: '🪘', color: '#8b5cf6' }
];

// ================= PAGE 1: Voter Verification =================
function verifyDetails() {
    const aadharNo = document.getElementById('aadharNo').value.trim();
    const voterId = document.getElementById('voterId').value.trim();
    const spinner = document.getElementById('verifySpinner');

    if (!aadharNo || !voterId || aadharNo.length !== 12 || voterId.length !== 12) {
        alert('❌ Enter valid 12-digit Aadhaar & Voter ID');
        return;
    }

    // Show loading
    spinner.classList.remove('d-none');
    document.getElementById('inputSection').style.opacity = '0.5';

    setTimeout(() => {
        spinner.classList.add('d-none');
        document.getElementById('inputSection').style.display = 'none';
        document.getElementById('profileSection').style.display = 'block';

        // Scenario 1: Specific voter data
        if (aadharNo === '123456789012' && voterId === '123456789012') {
            voterData = voterDatabase['123456789012'];
            displayVoterProfile();
        } else {
            // Random mock data for demo
            voterData = {
                name: 'DEMO VOTER ' + Math.floor(Math.random() * 10000),
                mobile: '9' + Math.floor(Math.random() * 9000000000),
                photo: `https://i.pravatar.cc/300?u=${Math.random()}`,
                aadhar: aadharNo,
                voterId: voterId
            };
            displayVoterProfile();
        }
    }, 3000);
}

function displayVoterProfile() {
    document.getElementById('voterPhoto').src = voterData.photo;
    document.getElementById('voterName').textContent = voterData.name;
    document.getElementById('voterMobile').textContent = voterData.mobile;
    document.getElementById('displayAadhar').textContent = `**** **** ${voterData.aadhar.slice(-4)}`;
    document.getElementById('displayVoterId').textContent = `**** **** ${voterData.voterId.slice(-4)}`;

    sessionStorage.setItem('voterData', JSON.stringify(voterData));
}

function proceedToBiometric() {
    window.location.href = 'biometric.html';
}

function resetVerification() {
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById('profileSection').style.display = 'none';
    document.getElementById('aadharNo').value = '';
    document.getElementById('voterId').value = '';
}

// ================= PAGE 2: Biometric Selection =================
function selectMethod(method, element) {
    selectedMethod = method;

    // Update UI
    document.querySelectorAll('.method-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('selectedMethodSection').style.display = 'block';

    // Method specific UI
    ['fingerprintSection', 'irisSection', 'otpSection'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(`${method}Section`).style.display = 'block';

    // Load voter info
    const voterData = JSON.parse(sessionStorage.getItem('voterData') || '{}');
    document.getElementById('voterNameBio').textContent = voterData.name || 'Unknown';
    document.getElementById('voterIdBio').textContent = voterData.voterId || 'Unknown';

    // Method titles
    const methodInfo = {
        fingerprint: { title: 'Fingerprint Authentication', desc: 'Aadhaar-linked biometric scan' },
        iris: { title: 'Iris Recognition', desc: 'High-security eye pattern scan' },
        otp: { title: 'Mobile OTP Verification', desc: '6-digit code sent to registered mobile' }
    };

    document.getElementById('methodTitle').textContent = methodInfo[method].title;
    document.getElementById('methodDesc').textContent = methodInfo[method].desc;

    if (method === 'otp') {
        document.getElementById('mobileDisplay').textContent = `+91 *******${voterData.mobile?.slice(-4) || 'XXXX'}`;
    }
}

function processBiometric(type) {
    attemptCount[type]++;
    const spinnerId = type === 'fingerprint' ? 'fpSpinner' : 'irisSpinner';
    const spinner = document.getElementById(spinnerId);

    spinner.classList.remove('d-none');

    setTimeout(() => {
        spinner.classList.add('d-none');

        // 1st attempt FAILS, 2nd SUCCEEDS
        const isSuccess = attemptCount[type] >= 2;

        if (isSuccess) {
            showBiometricSuccess(type);
        } else {
            showBiometricFail(type);
        }
    }, 3000);
}

function showBiometricSuccess(type) {
    alert(`✅ ${type.toUpperCase()} Verified Successfully!\nProceeding to EVM...`);
    window.location.href = 'evm.html';
}

function showBiometricFail(type) {
    alert(`❌ ${type.toUpperCase()} Failed (Attempt ${attemptCount[type]}/2)\nTry again or select different method`);
}

function verifyOTP() {
    const otp = document.getElementById('otpInput').value.trim();

    if (otp.length !== 6 || isNaN(otp)) {
        alert('❌ Enter valid 6-digit OTP');
        return;
    }

    // Any 6-digit OTP passes (random number)
    alert('✅ OTP Verified Successfully!\nProceeding to EVM...');
    window.location.href = 'evm.html';
}

// ================= PAGE 3: EVM Voting =================
// function initEVM() {
//     const voterData = JSON.parse(sessionStorage.getItem('voterData') || '{}');
//     if (!voterData.name) {
//         window.location.href = 'index.html';
//         return;
//     }

//     // Load 10 parties
//     loadCandidates();

//     // Start 60s timer
//     timeLeft = 60;
//     startTimer();
// }
function initEVM() {
    const voterData = JSON.parse(sessionStorage.getItem('voterData') || '{}');
    if (!voterData.name) {
        window.location.href = 'index.html';
        return;
    }

    loadCandidates();  // Now creates VERTICAL VVPAT
    startTimer();
}

function sendOTP() {
    const spinner = document.getElementById('otpSpinner');
    spinner.classList.remove('d-none');

    setTimeout(() => {
        spinner.classList.add('d-none');
        document.getElementById('otpInputSection').style.display = 'block';
        alert('📩 OTP Sent Successfully');
    }, 2000);
}

// function loadCandidates() {
//     const grid = document.getElementById('candidatesGrid');
//     parties.forEach(party => {
//         const btn = document.createElement('div');
//        btn.className = 'candidate-card';
//         btn.onclick = (event) => selectCandidate(party, event);
//         btn.innerHTML = `
//     <div class="party-color-strip" style="background:${party.color}"></div>
//     <div class="candidate-info">
//         <div class="party-logo">${party.symbol}</div>
//         <div class="candidate-name">${party.name}</div>
//         <div class="party-name">${party.party}</div>
//     </div>
// `;
//         btn.style.borderLeft = `8px solid ${party.color}`;
//         grid.appendChild(btn);
//     });
// }

// function selectCandidate(party,event) {
//     if (selectedCandidate) return; // One vote only

//     selectedCandidate = party;

//     // Visual feedback
//     document.querySelectorAll('.candidate-btn').forEach(btn => btn.classList.remove('selected'));
//     event.currentTarget.classList.add('selected');

//     // Confirmation
//     setTimeout(() => {
//         if (confirm(`Confirm vote for:\n\n${party.name}\n${party.party}\n\n✓ Final Selection`)) {
//             castVote();
//         } else {
//             selectedCandidate = null;
//             event.currentTarget.classList.remove('selected');
//         }
//     }, 500);
// }


function loadCandidates() {
    const grid = document.getElementById('candidatesGrid');
    grid.innerHTML = '';

    parties.forEach((party, index) => {
        const candidate = document.createElement('div');
        candidate.className = 'vvpat-candidate';
        candidate.dataset.id = party.id;
        candidate.innerHTML = `
            <div class="serial-no">${index + 1}</div>
            <div class="candidate-details">
                <div class="candidate-name">${party.name}</div>
                <div class="party-name">${party.party}</div>
            </div>
            <div class="logo-large" style="background: ${party.color};">${party.symbol}</div>
            <button class="vote-btn" onclick="castVoteFor('${party.id}', this)">
                VOTE
            </button>
        `;
        grid.appendChild(candidate);
    });
}

// function castVoteFor(candidateId, button) {
//     if (selectedCandidate) return; // One vote only

//     selectedCandidate = candidateId;

//     // Visual feedback
//     button.textContent = 'VOTED ✓';
//     button.classList.add('voted');

//     // Mark candidate row as voted
//     button.closest('.vvpat-candidate').classList.add('voted');

//     // Show confirmation
//     document.getElementById('voteStatus').classList.remove('d-none');
//     const party = parties.find(p => p.id === candidateId);
//     document.getElementById('selectedCandidateInfo').textContent =
//         `Serial No: ${parties.findIndex(p => p.id === candidateId) + 1} | ${party.name}`;

//     playEVMSound('success');

//     // Auto lock after 3s
//     setTimeout(() => {
//         lockEVM();
//     }, 3000);
// }
function castVoteFor(candidateId, button) {
    if (selectedCandidate) return;
    
    selectedCandidate = candidateId;
    button.textContent = 'VOTED ✓';
    button.classList.add('voted');
    button.closest('.vvpat-candidate').classList.add('voted');
    
    const party = parties.find(p => p.id === candidateId);
    const infoEl = document.getElementById('selectedCandidateInfo');
    if (infoEl) {
        infoEl.textContent = `${party.name} (${party.party}) ✓`;
        document.getElementById('voteStatus').classList.remove('d-none');
    }
    
    // SINGLE SUCCESS ALERT
    alert(`✅ VOTE CAST SUCCESSFULLY!\n\n${party.name}\n${party.party}\n\n⏰ Auto reset in 5 seconds...`);
    
    // SINGLE COUNTDOWN - NO REPEATED ALERTS
    let count = 5;
    const interval = setInterval(() => {
        count--;
        document.title = `ECI EVM - Reset in ${count}s`; // Browser tab countdown
        
        if (count <= 0) {
            clearInterval(interval);
            fullSystemReset();
        }
    }, 1000);
}

function fullSystemReset() {
    sessionStorage.clear();
    selectedCandidate = null;
    window.location.href = 'index.html';
}


function lockEVM() {
    clearInterval(timerInterval);
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

function castVote() {
    clearInterval(timerInterval);
    sessionStorage.setItem('voteCast', 'true');

    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();

    // Auto reset after 5s
    let count = 5;
    const countdown = document.getElementById('countdown');
    const interval = setInterval(() => {
        count--;
        countdown.textContent = count;
        if (count <= 0) {
            clearInterval(interval);
            resetSystem();
        }
    }, 1000);
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;

        if (timeLeft <= 10) {
            timerEl.parentElement.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';
        }

        if (timeLeft <= 0) {
            lockEVM();
        }
    }, 1000);
}

function lockEVM() {
    clearInterval(timerInterval);
    alert('🔒 EVM Locked - Time Expired!\nContact Election Officer');
    resetSystem();
}

function resetSystem() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    // Enter key handlers
    const inputs = ['aadharNo', 'voterId', 'otpInput'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;

        el.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                if (id === 'otpInput') verifyOTP();
                else verifyDetails();
            }
        });
    });

    // Page specific init
    if (window.location.pathname.includes('evm.html')) initEVM();

    // Prevent back navigation
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => window.history.pushState(null, null, window.location.href);
});

