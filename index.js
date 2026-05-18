const { Client, GatewayIntentBits } = require("discord.js");
const { DisTube } = require("distube");
const { YouTubePlugin } = require("@distube/youtube");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client, {
  plugins: [new YouTubePlugin()],
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
});

const prefix = "!";

client.on("ready", () => {
  console.log(`${client.user.tag} شغال 🎧`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift();

  if (command === "مساعده") {
    return message.reply(`
🎵 أوامر البوت:

!مساعده
!ادخل
!شغل اسم_الأغنية
!وقف
!تشغيل
!تخطي
!خروج
    `);
  }

  if (command === "ادخل") {
    const vc = message.member.voice.channel;

    if (!vc) {
      return message.reply("ادخل روم صوتي أول");
    }

    return message.reply("🎧 أنا جاهز بالفويس");
  }

  if (command === "شغل") {
    const song = args.join(" ");

    if (!song) {
      return message.reply("اكتب اسم الأغنية");
    }

    const vc = message.member.voice.channel;

    if (!vc) {
      return message.reply("ادخل روم صوتي أول");
    }

    try {
      await distube.play(vc, song, {
        textChannel: message.channel,
        member: message.member,
      });

      message.reply(`🎶 جاري تشغيل: ${song}`);
    } catch (e) {
      console.log(e);
      message.reply("❌ صار خطأ بالتشغيل");
    }
  }

  if (command === "وقف") {
    try {
      distube.pause(message);
      message.reply("⏸️ توقفت الأغنية");
    } catch {
      message.reply("❌ ما فيه شيء شغال");
    }
  }

  if (command === "تشغيل") {
    try {
      distube.resume(message);
      message.reply("▶️ كمل التشغيل");
    } catch {
      message.reply("❌ ما فيه شيء متوقف");
    }
  }

  if (command === "تخطي") {
    try {
      distube.skip(message);
      message.reply("⏭️ تم تخطي الأغنية");
    } catch {
      message.reply("❌ ما فيه أغنية ثانية");
    }
  }

  if (command === "خروج") {
    try {
      distube.voices.leave(message.guild);
      message.reply("👋 طلعت من الفويس");
    } catch {
      message.reply("❌ ما قدرت أطلع");
    }
  }
});

client.login(process.env.TOKEN);
