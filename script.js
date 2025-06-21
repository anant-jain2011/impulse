const baseUrl = "https://vchat-4ldl.onrender.com";

// Create loading overlay element (add this at the top)
const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'loading-overlay';
loadingOverlay.innerHTML = `
    <div class="loading-content">
        <div class="loading-spinner">
            <svg viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
            </svg>
        </div>
        <p class="loading-text">Processing your request...</p>
    </div>
`;
document.body.appendChild(loadingOverlay);

// Loading control functions
function showLoading(message) {
    loadingOverlay.querySelector('.loading-text').textContent = message;
    loadingOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Modified changeDetails function with loader
function changeDetails() {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const roomNumber = document.getElementById('roomId').value;

    showLoading(`Joining room ${roomNumber}...`);

    (async function () {
        try {
            const res = await fetch(baseUrl + "/room?rn=" + roomNumber);
            let resp = await res.json();

            localStorage.setItem("details", JSON.stringify({ 
                username, 
                roomNumber, 
                roomName: resp[0].roomName 
            }));

            hideLoading();
            location.href = `${location.origin}/chat/`;
        } catch (error) {
            hideLoading();
            alert("Failed to join room. Kindly check the details.");
            console.error("Join error:", error);
        }
    })();
}

// Modified createRoom function with loader
const createRoom = () => {
    event.preventDefault();

    let username = document.getElementById('username2').value;
    let roomName = document.getElementById('roomName').value;
    let newRoomId = Math.floor(100000 + Math.random() * 900000);
    let maxMembers = document.getElementById("maxMembers").value;

    let data = {
        roomName,
        roomNumber: newRoomId,
    }

    maxMembers ? data.maxMembers = maxMembers : false;

    showLoading(`Creating room ${roomName}...`);

    (async function () {
        try {
            const res = await fetch(baseUrl + "/addRoom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            await res.json();
            localStorage.setItem("details", JSON.stringify({ username, ...data }));
            
            hideLoading();
            location.href = `${location.origin}/?newRoom`;
        }
        catch (err) {
            hideLoading();
            alert("Failed to create room. Please try again after a moment.");
            console.error("Create error:", err);
        }
    })();
}

// Your existing tab switching code remains unchanged
function switchTab(activeTab, activeForm) {
    joinTab.classList.remove('active');
    createTab.classList.remove('active');
    activeTab.classList.add('active');

    joinForm.classList.remove('active');
    createForm.classList.remove('active');
    activeForm.classList.add('active');

    if (activeTab === joinTab) {
        activeIndicator.style.translate = '0px';
    } else {
        activeIndicator.style.translate = 'calc(100% + 8px) 0px';
    }
}

joinTab.addEventListener('click', function () {
    switchTab(joinTab, joinForm);
});

createTab.addEventListener('click', function () {
    switchTab(createTab, createForm);
});