"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const i18n_1 = require("@grammyjs/i18n");
require("dotenv/config");
const botToken = process.env.BOT_TOKEN || "";
const bot = new grammy_1.Bot(botToken);
const i18n = new i18n_1.I18n({
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
