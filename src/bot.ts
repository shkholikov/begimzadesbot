import { Bot, Context } from "grammy";
import { I18n, I18nFlavor } from "@grammyjs/i18n";
import "dotenv/config";

type MyContext = Context & I18nFlavor;

const botToken = process.env.BOT_TOKEN || "";
const bot = new Bot<MyContext>(botToken);

const i18n = new I18n<MyContext>({
	defaultLocale: "ru", // see below for more information
	directory: "src/locales" // Load all translation files from locales/.
});

bot.use(i18n);

bot.api.setMyCommands([
	{ command: "start", description: "Приветики 🦦" },
	{ command: "help", description: "Show help text" },
	{ command: "settings", description: "Open settings" }
]);

bot.command("start", (ctx) => ctx.reply(ctx.t("messages-welcome"), { parse_mode: "Markdown" }));

bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Start the bot.
bot.start();
