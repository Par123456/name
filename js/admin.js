document.getElementById('dataForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const statusMsg = document.getElementById('status-msg');
    statusMsg.textContent = "// Transmitting data...";

    const payload = {
        password: document.getElementById('password').value,
        name: document.getElementById('name').value,
        alias: document.getElementById('alias').value,
        mobile: document.getElementById('mobile').value,
        home: document.getElementById('home').value,
        description: document.getElementById('description').value,
        images: document.getElementById('images').value.split('\n').filter(Boolean),
        videos: document.getElementById('videos').value.split('\n').filter(Boolean),
        gifs: document.getElementById('gifs').value.split('\n').filter(Boolean)
    };

    try {
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        
        if (res.ok) {
            statusMsg.style.color = '#0f0';
            statusMsg.textContent = "// SUCCESS: Data has been injected into the mainframe.";
        } else {
            statusMsg.style.color = '#f00';
            statusMsg.textContent = `// ERROR: ${result.error || 'Unauthorized'}`;
        }
    } catch (error) {
        statusMsg.style.color = '#f00';
        statusMsg.textContent = `// FATAL ERROR: ${error.message}`;
    }
});
