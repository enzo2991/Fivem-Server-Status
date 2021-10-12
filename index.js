"use strict";

const { SSL_OP_EPHEMERAL_RSA } = require("constants");
const { TIMEOUT } = require("dns");
const { waitForDebugger } = require("inspector");

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const http = __importStar(require("request"));
const discord = __importStar(require("discord.js"));
const bot = new discord.Client;
var interrupteur = 0;
var firstcmd = 0;
console.log(`Démarrage du bot...`);
bot.on("message", message => {
    if(message.member.roles.has(process.env.staffteam)){
        if(message.content == "!start" && interrupteur == 1){
            if (message.deletable) {
                message.delete();
            }
            updatePlayerInterval = setInterval(() => updatePlayers(), process.env.refreshtime * 1000);
            message.reply("relancement du compteur.").then(msg => {
                msg.delete(process.env.refreshtime * 1000)
            });
            interrupteur = 0;
        } else if(message.content == "!start" && interrupteur == 0){
            message.delete();
            message.reply("Le bot est deja allumer.").then(msg => {
                msg.delete(20 * 1000)
            });
        }
        if(message.content == "!maintenance" && interrupteur == 0){
            if (message.deletable) {
                message.delete();
            }
            interrupteur = 1; 
            clearInterval(updatePlayerInterval);
            maintenance();
            message.reply("Mise en maintenance du serveur.").then(msg => {
                msg.delete(process.env.refreshtime * 1000)
            });
        } else if(message.content == "!maintenance" && interrupteur == 1){
            message.delete();
            message.reply("Le serveur est deja en maintenance.").then(msg => {
                msg.delete(20 * 1000)
            });
        } 
        if(message.content == "!first" && firstcmd == 0){
            firstcmd = 1;
            message.delete();
            bot.channels.get(process.env.channels).send(`Ce message va etre modifier`);
        } else if(message.content == "!first" && firstcmd == 1){
            message.delete();
            message.reply("Le message est deja envoyer.").then(msg => {
                msg.delete(20 * 1000)
            });
        }
    } else{
        message.delete();
        message.reply("Tu n'as pas le role necessaire pour utiliser cette commande.").then(msg => {
            msg.delete(20 * 1000)
        });
    }
});

bot.login(process.env.token);
var updatePlayerInterval;
updatePlayerInterval = setInterval(() => updatePlayers(), process.env.refreshtime * 1000);
function updatePlayers() {
        var args = process.env.server;
        let guild = bot.guilds.get(process.env.guild);
        http.get(`http://${args}/dynamic.json`, { json: true }, (err, res, data) => {
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
                      const maindiscord = bot.guilds.find(g => g.id === process.env.guild); 
                      const statuschannel = maindiscord.channels.find(c => c.id === process.env.channels); 
                        statuschannel.fetchMessage(process.env.messsage).then((msg) => { 
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
                const maindiscord = bot.guilds.find(g => g.id === process.env.guild); 
                const statuschannel = maindiscord.channels.find(c => c.id === process.env.channels);
                statuschannel.fetchMessage(process.env.messsage).then((msg) => { 
                    msg.edit(embed)
                })
            }
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
      const maindiscord = bot.guilds.find(g => g.id === process.env.guild) 
      const statuschannel = maindiscord.channels.find(c => c.id === process.env.channels); 
      statuschannel.fetchMessage(process.env.messsage).then((msg) => { 
      msg.edit(embed)
    })
}