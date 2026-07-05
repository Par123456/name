export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const body = await request.json();
        if (body.password !== env.ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { 'Content-Type': 'application/json' }
            });
        }
        return new Response(JSON.stringify({ success: true }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Bad Request' }), {
            status: 400, headers: { 'Content-Type': 'application/json' }
        });
    }
}
