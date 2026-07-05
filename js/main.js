// افکت ماتریککس
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
const charArray = chars.split(''); const fontSize = 16;
const columns = canvas.width / fontSize; const drops = [];
for (let x = 0; x < columns; x++) drops[x] = 1;
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0'; ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 40);
window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

// غیرفعال کردن راست کلیک و ویو سورس
document.addEventListener('contextmenu', function(e) { e.preventDefault(); alert('Access Denied: Right Click Disabled'); });
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
});

// گرفتن دیتا از بک‌اند کلودفلر
fetch('/api/data')
    .then(res => res.json())
    .then(data => {
        // اگر دیتا خالی بود (هنوز ادمین ثبت نکرده بود)
        const noData = "از پنل ادمین اضافه شود";
        
        const infoSection = document.getElementById('info-section');
        infoSection.innerHTML = `
            <p><span class="prompt">root@anon:~$</span> cat target_info.txt</p><br>
            <p><span class="label">Target Name:</span> ${data.name || noData}</p>
            <p><span class="label">Known As:</span> ${data.alias || noData}</p>
            <p><span class="label">Mobile:</span> ${data.mobile || noData}</p>
            <p><span class="label">Home:</span> ${data.home || noData}</p>
            <p><span class="label">Description:</span> ${data.description || noData}</p>
        `;

        const imgSection = document.getElementById('images-section');
        if (data.images && data.images.length > 0) {
            imgSection.innerHTML = data.images.map(url => 
                `<div class="media-card"><img src="${url.trim()}" alt="Evidence"></div>`
            ).join('');
        }

        const vidSection = document.getElementById('videos-section');
        if (data.videos && data.videos.length > 0) {
            vidSection.innerHTML = data.videos.map(url => 
                `<div class="media-card video-card"><video controls muted><source src="${url.trim()}" type="video/mp4"></video></div>`
            ).join('');
        }

        const gifSection = document.getElementById('gifs-section');
        if (data.gifs && data.gifs.length > 0) {
            gifSection.innerHTML = data.gifs.map(url => 
                `<div class="media-card"><img src="${url.trim()}" alt="GIF"></div>`
            ).join('');
        }
    })
    .catch(err => console.log('Error fetching data:', err));
