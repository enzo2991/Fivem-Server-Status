"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("request"));
const discord = __importStar(require("discord.js"));
const bot = new discord.Client;
const config = {
    "token": "", 
    "guild": "", 
    "staffteam": "",
    "channels": "", 
    "refreshtime": 120, 
    "servers": [
        "nameserver ip:port",
    ] 
};
var interrupteur = 0;
var firstcmd = 0;
console.log(`Démarrage du bot...`);
bot.on("message", message => {
    //relancer le compteur
    if (message.content == "!start" && message.member.roles.has(config.staffteam) && interrupteur == 1) {
        if (message.deletable) {
            message.delete();
        }
        updatePlayerInterval = setInterval(() => updatePlayers(), config.refreshtime * 1000);
        message.reply("relancement du compteur.");
        interrupteur = 0;
        //maintenance
    } else if(message.content == "!maintenance" && message.member.roles.has(config.staffteam) && interrupteur == 0){
        if (message.deletable) {
            message.delete();
        }
        interrupteur = 1; 
        clearInterval(updatePlayerInterval);
        maintenance();
        message.reply("Mise en maintenance du serveur.");
    } else if(message.content == "!first" && message.member.roles.has(config.staffteam) && firstcmd == 0){
        firstcmd = 1;
        message.delete();
        bot.channels.get(config.channels).send(`Ce message va etre modifier`);
    }
    /*suggestion
    if(message.channel.id == "861328280216535100"){
        message.react("👍");
        message.react("👎");
    }  */
});

bot.login(config.token);
var updatePlayerInterval;
updatePlayerInterval = setInterval(() => updatePlayers(), config.refreshtime * 1000);
function updatePlayers() {
    config.servers.forEach(server => {
        var args = server.split(" ");
        let guild = bot.guilds.get(config.guild);
        http.get(`http://${args[1]}/dynamic.json`, { json: true }, (err, res, data) => {
            if (err) {
                if (err.code == "ECONNREFUSED" || err.code == "ETIMEDOUT") {
                    bot.user.setPresence({
                        status: "dnd", 
                        game: {
                            name: `Serveur Kelloogs Eteint!`, 
                            type: "Watching", 
                        }
                    })
                  var embed = new discord.RichEmbed()
                      .setColor('#ff0000')
                      .addField('**Statut du serveur:**', `❌ Hors Ligne`)
                      .setTitle('__**Kelloogs  RolePlay**__')
                      .setImage('https://i.imgur.com/QN6Xg1D.png')
                      .setTimestamp()
                      .setFooter('Actualisation','https://i.imgur.com/QN6Xg1D.png');
                      const maindiscord = bot.guilds.find(g => g.id === config.guild) 
                      const statuschannel = maindiscord.channels.find(c => c.id === config.channels); 
                  statuschannel.fetchMessage('852160066617475082').then((msg) => { 
                      msg.edit(embed)
                  })
                }
            }
            else {
                bot.user.setPresence({
                    status: "online", 
                    game: {
                        name: `${data.clients} Joueurs sur Kelloogs!`,
                        type: "Playing", 
                    }
                })
                var embed = new discord.RichEmbed()
                .setColor('#00ff00')
                .setTitle('__**Kelloogs  RolePlay**__')
                .addField('**Statut du serveur:**', `✅ En Ligne`, true)
                .addField('**Nombre de joueur en ligne:**', `**Total:** \`${data.clients}\` / \`${data.sv_maxclients}\``, true)
                .addBlankField()
                .setImage('https://i.imgur.com/QN6Xg1D.png')
                .setTimestamp()
                .setFooter('Actualisation','https://i.imgur.com/QN6Xg1D.png');
                const maindiscord = bot.guilds.find(g => g.id === config.guild) 
                const statuschannel = maindiscord.channels.find(c => c.id === config.channels);
                statuschannel.fetchMessage('852160066617475082').then((msg) => { 
                    msg.edit(embed)
                })
            }
        });
    });
}

function maintenance() {
    bot.user.setPresence({
        status: "idle", 
        game: {
            name: `Serveur en maintenance!`, 
            type: "Watching", 
        }
    })    
      var embed = new discord.RichEmbed()
      .setColor('#FF8000')
      .addField('**Statut du serveur:**', `🔸 maintenance`)
      .setTitle('__**KeLLoOgs  RolePlay GTA**__')
      .setImage('https://i.imgur.com/QN6Xg1D.png')
      .setTimestamp()
      .setFooter('Actualisation','https://i.imgur.com/QN6Xg1D.png');
      const maindiscord = bot.guilds.find(g => g.id === config.guild) 
      const statuschannel = maindiscord.channels.find(c => c.id === config.channels); 
      statuschannel.fetchMessage('852160066617475082').then((msg) => { 
      msg.edit(embed)
    })
}