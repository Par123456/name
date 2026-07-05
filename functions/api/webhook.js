export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const update = await request.json();
        
        // بررسی اینکه آیا پیام جدیدی ارسال شده و آیا متن آن /start است
        if (update.message && update.message.text === '/start') {
            const chatId = update.message.chat.id;
            
            // آدرس API تلگرام با استفاده از توکن موجود در Environment Variables
            const telegramApiUrl = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;
            
            // ساختار پیام و دکمه شیشه‌ای (Inline Keyboard) با قابلیت Open App
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
            
            // ارسال پیام به تلگرام
            await fetch(telegramApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
        
        // تلگرام همیشه انتظار پاسخ 200 OK دارد
        return new Response('OK', { status: 200 });
        
    } catch (error) {
        // در صورت بروز خطا همچنان 200 برمی‌گردانیم تا تلگرام ربات را خاموش نکند
        return new Response('Error', { status: 200 });
    }
}
