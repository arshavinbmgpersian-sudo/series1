export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Movie Bot Online 🚀");
    }

    const update = await request.json();

    // شروع
    if (update.message?.text === "/start") {
      await sendMessage(env.BOT_TOKEN, update.message.chat.id, {
        text:
`🎬 به ربات فیلم خوش آمدید

🔎 نام فیلم یا سریال را ارسال کنید.`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔥 فیلم‌های جدید", callback_data: "new_movies" }],
            [{ text: "⭐ سریال‌های برتر", callback_data: "top_series" }]
          ]
        }
      });

      return new Response("ok");
    }

    // جستجو
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const query = update.message.text;

      await sendMessage(env.BOT_TOKEN, chatId, {
        text: `🔍 نتایج جستجو برای:\n${query}`,
        reply_markup: {
          inline_keyboard: [
            [{ text: "🎬 Interstellar (2014)", callback_data: "movie_interstellar" }],
            [{ text: "🎬 Oppenheimer (2023)", callback_data: "movie_oppenheimer" }],
            [{ text: "📺 Breaking Bad", callback_data: "series_bb" }]
          ]
        }
      });
    }

    // کلیک روی دکمه‌ها
    if (update.callback_query) {
      const chatId = update.callback_query.message.chat.id;
      const data = update.callback_query.data;

      let text = "اطلاعاتی یافت نشد";

      if (data === "movie_interstellar") {
        text =
`🎬 Interstellar

⭐ 8.7/10
📅 2014
🎭 Sci-Fi

🚀 نمونه اطلاعات فیلم`;
      }

      if (data === "movie_oppenheimer") {
        text =
`🎬 Oppenheimer

⭐ 8.3/10
📅 2023
🎭 Drama`;
      }

      if (data === "series_bb") {
        text =
`📺 Breaking Bad

⭐ 9.5/10
📅 2008
🎭 Crime`;
      }

      await sendMessage(env.BOT_TOKEN, chatId, {
        text
      });
    }

    return new Response("ok");
  }
};

async function sendMessage(token, chatId, payload) {
  await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: chatId,
        ...payload
      })
    }
  );
}
