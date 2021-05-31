var Discord = require('discord.io');
var fs = require('fs');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        console.log("User: " + user, ", userID: " + userID);

        switch(cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'kjekkest':
                bot.sendMessage({
                    to: channelID,
                    message: 'Aleksander, of course!'
                });
                break;
            case "join":
                bot.joinVoiceChannel("150685223540097024", function(error, events) {
                    console.log(error);
                }); 
                break;
            case "stop":
                bot.leaveVoiceChannel("150685223540097024", function(error, events) {
                    console.log(error);
                }); 
                break;
            case "play":
                bot.joinVoiceChannel("150685223540097024", function(error, events) {
                    //Check to see if any errors happen while joining.
                    if (error) return console.error(error);

                    //Then get the audio context
                    client.getAudioContext("150685223540097024", function(error, stream) {
                        //Once again, check to see if any errors exist
                        if (error) return console.error(error);

                        //Create a stream to your file and pipe it to the stream
                        //Without {end: false}, it would close up the stream, so make sure to include that.
                        fs.createReadStream('./1.wav').pipe(stream, {end: false});

                        //The stream fires `done` when it's got nothing else to send to Discord.
                        stream.on('done', function() {
                        //Handle

                        });
                        stream.on('error', function(error) {
                            //Handle
                            console.log(error)
                            });
                    });
                });
                break;
                

            // Just add any case commands if you want to..
         }
     }
});