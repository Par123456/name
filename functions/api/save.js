export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();

        // بررسی رمز عبور (این رمز را در تنظیمات کلودفلر تنظیم می‌کنیم)
        if (body.password !== env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Invalid Admin Password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // حذف رمز عبور از دیتایی که قرار است ذخیره شود
        delete body.password;

        // ذخیره در دیتابیس KV
        await env.SITE_KV.put('site_data', JSON.stringify(body));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to process data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
