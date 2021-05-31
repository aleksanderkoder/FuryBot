const Discord = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");

const client = new Discord.Client();
var connection;
var vc;

client.on("ready", () => {
  console.log("Bot is ready");
});

client.login(process.env.BOT_TOKEN);

client.on("message", async (message) => {
  // if (msg.content === '!play') {
  //     const channel = client.channels.get("150685223540097024");
  //     channel.join();
  //     console.log("Joined voice channel!");
  // }
  if (
    message.content.includes(
      "!play https://furymusicplayer.000webhostapp.com/"
    ) &&
    message.member.voice.channel
  ) {
    let msgParams = message.content.split(" ");
    let url = new URL(msgParams[1]);
    let songid = url.searchParams.get("songid");
    vc = message.member.voice.channel;
    connection = await message.member.voice.channel.join();
    // Create a dispatcher
    //const dispatcher = connection.play('https://furymusicplayer.000webhostapp.com/songs/LXST CXNTURY - INFINITY VOLUME TWO.mp3');

    fetch(
      "https://furymusicplayer.000webhostapp.com/scripts/getSongById.php/?songid=" +
        songid
    )
      .then((res) => res.text())
      .then((text) => {
        console.log(text);
        if (text != "Error") {
          const dispatcher = connection.play(text);

          dispatcher.on("start", () => {
            console.log("Audio is now playing!");
          });

          dispatcher.on("finish", () => {
            console.log("Audio has finished playing!");
            vc.leave();
          });

          // Always remember to handle errors appropriately!
          dispatcher.on("error", console.error);
        } else 
            message.channel.send("Selected content is not available!");
      });
    // From a path
    // connection.play('https://furymusicplayer.000webhostapp.com/songs/LXST CXNTURY - INFINITY VOLUME TWO.mp3');
    // From a ReadableStream
    // connection.play(fs.createReadStream('https://furymusicplayer.000webhostapp.com/songs/LXST CXNTURY - INFINITY VOLUME TWO.mp3'));
    // // From a URL
    // connection.play('http://myserver.com/audio.aac');
  } else if (message.content == "!stop") {
    vc.leave();
    console.log("Left voice channel");
  }
});
