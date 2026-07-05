let adminPassword = '';
let currentData = {
    show_info: true, show_images: true, show_videos: true, show_gifs: true,
    name: "", alias: "", mobile: "", home: "", description: "",
    images: [], videos: [], gifs: []
};

// 1. گیت ورود
async function attemptLogin() {
    const pass = document.getElementById('login-pass').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '// Checking credentials...';

    try {
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pass })
        });

        if (res.ok) {
            adminPassword = pass;
            document.getElementById('login-gate').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            await loadExistingData();
            setupFileHandlers();
        } else {
            errorDiv.textContent = '// ACCESS DENIED: Incorrect Password';
        }
    } catch (error) {
        errorDiv.textContent = '// NETWORK ERROR';
    }
}

// 2. لود کردن اطلاعات و فایل‌های قبلی
async function loadExistingData() {
    try {
        const res = await fetch('/api/data');
        if (!res.ok) return;
        const data = await res.json();
        
        if (data && data.name !== undefined) {
            currentData = data;
            document.getElementById('name').value = data.name || '';
            document.getElementById('alias').value = data.alias || '';
            document.getElementById('mobile').value = data.mobile || '';
            document.getElementById('home').value = data.home || '';
            document.getElementById('description').value = data.description || '';
            
            document.getElementById('show_info').checked = data.show_info !== false;
            document.getElementById('show_images').checked = data.show_images !== false;
            document.getElementById('show_videos').checked = data.show_videos !== false;
            document.getElementById('show_gifs').checked = data.show_gifs !== false;

            updateFileStatus('images', data.images ? data.images.length : 0);
            updateFileStatus('videos', data.videos ? data.videos.length : 0);
            updateFileStatus('gifs', data.gifs ? data.gifs.length : 0);
        }
    } catch (error) {
        console.log('Error loading:', error);
    }
}

// 3. تنظیم هندلرهای فایل (وقتی فایل جدید انتخاب می‌شود)
function setupFileHandlers() {
    document.getElementById('file-images').addEventListener('change', (e) => handleFiles(e, 'images'));
    document.getElementById('file-videos').addEventListener('change', (e) => handleFiles(e, 'videos'));
    document.getElementById('file-gifs').addEventListener('change', (e) => handleFiles(e, 'gifs'));
}

async function handleFiles(event, type) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    let base64Files = [];
    for (const file of files) {
        const base64 = await readFileAsBase64(file);
        base64Files.push(base64);
    }
    currentData[type] = base64Files; // جایگزین کردن فایل‌های قبلی با فایل‌های جدید
    updateFileStatus(type, currentData[type].length);
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function updateFileStatus(type, count) {
    document.getElementById(`status-${type}`).textContent = count > 0 ? `${count} فایل ذخیره شده/آپلود شده` : 'فایلی انتخاب نشده';
}

function clearFiles(type) {
    currentData[type] = [];
    document.getElementById(`file-${type}`).value = '';
    updateFileStatus(type, 0);
}

// 4. ارسال نهایی به سرور
document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusMsg = document.getElementById('status-msg');
    statusMsg.textContent = "// Transmitting data... (If files are large, this may take a minute)";

    const payload = {
        password: adminPassword,
        show_info: document.getElementById('show_info').checked,
        show_images: document.getElementById('show_images').checked,
        show_videos: document.getElementById('show_videos').checked,
        show_gifs: document.getElementById('show_gifs').checked,
        name: document.getElementById('name').value,
        alias: document.getElementById('alias').value,
        mobile: document.getElementById('mobile').value,
        home: document.getElementById('home').value,
        description: document.getElementById('description').value,
        images: currentData.images,
        videos: currentData.videos,
        gifs: currentData.gifs
    };

    try {
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            statusMsg.style.color = '#0f0';
            statusMsg.textContent = "// SUCCESS: Data injected into mainframe.";
        } else {
            statusMsg.style.color = '#f00';
            const errData = await res.json();
            statusMsg.textContent = `// ERROR: ${errData.error || 'Unauthorized or Size Limit Exceeded'}`;
        }
    } catch (error) {
        statusMsg.style.color = '#f00';
        statusMsg.textContent = `// FATAL ERROR: ${error.message}`;
    }
});
