import { Bot, Context, InlineKeyboard } from "grammy";
import { I18n, I18nFlavor } from "@grammyjs/i18n";
import "dotenv/config";

import type { ParseModeFlavor } from "@grammyjs/parse-mode";

type MyContext = Context & I18nFlavor;

const botToken = process.env.BOT_TOKEN || "";
const bot = new Bot<ParseModeFlavor<MyContext>>(botToken);

// -------------------- Middlewares Start -------------------- //
const i18n = new I18n<MyContext>({
	defaultLocale: "ru", // see below for more information
	directory: "src/locales" // Load all translation files from locales/.
});

bot.use(i18n);
// -------------------- Middlewares End -------------------- //

bot.api.setMyCommands([
	{ command: "start", description: "Приветики 🦦" },
	{ command: "language", description: "Язык 💱" }
]);

bot.command("start", (ctx) => ctx.reply(ctx.t("messages-welcome"), { parse_mode: "HTML" }));

bot.command("language", async (ctx) => {
	const keyboard = new InlineKeyboard().text("🇷🇺 Русский", "lang_ru").text("🇺🇿 O'zbekcha", "lang_uz");

	await ctx.reply(ctx.t("messages-language"), {
		reply_markup: keyboard
	});
});

bot.callbackQuery(/^lang_(ru|uz)$/, async (ctx) => {
	const lang = ctx.match[1];
	await ctx.i18n.useLocale(lang);
	await ctx.deleteMessage();
	await ctx.reply(ctx.t("messages-language-changed"), { parse_mode: "HTML" });
});

// Start the bot.
bot.start();
