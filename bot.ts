import { Bot } from "grammy";
import "dotenv/config";

if (!process.env.BOT_TOKEN) {
	throw new Error("BOT_TOKEN environment variable is not set");
}

const bot = new Bot(process.env.BOT_TOKEN);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.start();
