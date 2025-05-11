"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const i18n_1 = require("@grammyjs/i18n");
require("dotenv/config");
const botToken = process.env.BOT_TOKEN || "";
const bot = new grammy_1.Bot(botToken);
// -------------------- Middlewares Start -------------------- //
const i18n = new i18n_1.I18n({
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
bot.command("language", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const keyboard = new grammy_1.InlineKeyboard().text("🇷🇺 Русский", "lang_ru").text("🇺🇿 O'zbekcha", "lang_uz");
    yield ctx.reply(ctx.t("messages-language"), {
        reply_markup: keyboard
    });
}));
bot.callbackQuery(/^lang_(ru|uz)$/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const lang = ctx.match[1];
    console.log(lang);
    yield ctx.i18n.useLocale(lang);
    // await ctx.editMessageText(ctx.t("messages-language"));
    yield ctx.deleteMessage();
    yield ctx.reply(ctx.t("messages-language-changed"), { parse_mode: "HTML" });
}));
bot.on("message", (ctx) => ctx.reply("Got another message!"));
// Start the bot.
bot.start();
