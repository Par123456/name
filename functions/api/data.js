export async function onRequestGet(context) {
    const { env } = context;
    
    // خواندن دیتا از KV. اگر خالی بود یک آبجکت خالی برمی‌گردانیم
    let data = await env.SITE_KV.get('site_data');
    if (!data) {
        data = JSON.stringify({ name: "", alias: "", mobile: "", home: "", description: "", images: [], videos: [], gifs: [] });
    }

    return new Response(data, {
        headers: { 'Content-Type': 'application/json' }
    });
}
