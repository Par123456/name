export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const update = await request.json();
        
        if (!env.BOT_TOKEN) {
            console.error("BOT_TOKEN is missing in Cloudflare Environment Variables");
            return new Response('Token Missing', { status: 500 });
        }

        if (update.message && update.message.text === '/start') {
            const chatId = update.message.chat.id;
            const telegramApiUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
            
            const payload = {
                chat_id: chatId,
                text: "🔐 *سیستم امنیتی فعال شد*\n\nبرای ورود به سیستم و مشاهده اطلاعات، دکمه زیر را لمس کنید:",
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "🌐 ورود به سایت (Open App)",
                                web_app: {
                                    url: "https://namekos.pages.dev/"
                                }
                            }
                        ]
                    ]
                }
            };
            
            const tgResponse = await fetch(telegramApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!tgResponse.ok) {
                const tgError = await tgResponse.json();
                console.error("Telegram API Error:", JSON.stringify(tgError));
            }
        }
        
        return new Response('OK', { status: 200 });
        
    } catch (error) {
        console.error("Webhook Error:", error);
        return new Response('Error', { status: 200 });
    }
}
