const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const { joinVoiceChannel } = require('@discordjs/voice');
const { ActivityType } = require('discord.js');

const client = new Discord.Client({ intents: [1, 512, 32768, 2, 128] });

require('./handler')(client)

module.exports = client

client.on('interactionCreate', (interaction) => { 
  
   if(interaction.type === Discord.InteractionType.ApplicationCommand){ 
  
       const cmd = client.slashCommands.get(interaction.commandName); 
  
       if (!cmd) return interaction.reply(`Error`); 
  
       interaction["member"] = interaction.guild.members.cache.get(interaction.user.id); 
  
       cmd.run(client, interaction) 
  
    } 
 }) 
fs.readdirSync('./events/').forEach(file => {
    let files = fs.readdirSync('./events/').filter(file => file.endsWith('.js'))
    if(files.length <= 0) return 

    files.forEach(event => {
        const getEvent = require(`./events/${event}`)
        try {
           
            client.events.set(getEvent.name, getEvent);
        
        } catch(e) {
            return console.log(e)
        }
    })
})

// SISTEMA DE ENTRAR NO CANAL DE VOZ AUTOMÁTICO 
client.on("ready", () => {
  let canal = client.channels.cache.get("1089653872349433936") // coloque o ID do canal de voz
  if (!canal) return console.log("❌ Não foi possível entrar no canal de voz.")
  if (canal.type !== Discord.ChannelType.GuildVoice) return console.log(`❌ Não foi possível entrar no canal [ ${canal.name} ].`)

  try {

    joinVoiceChannel({
      channelId: canal.id, // ID do canal de voz
      guildId: canal.guild.id, // ID do servidor
      adapterCreator: canal.guild.voiceAdapterCreator,
    })
    console.log(`✅ Entrei no canal de voz [ ${canal.name} ] com sucesso!`)

  } catch(e) {
    console.log(`❌ Não foi possível entrar no canal [ ${canal.name} ].`)
  }

})
//FIM

//SISTEMA DE BEMVINDO EMBED
client.on("guildMemberAdd", (member) => {
  let canal_logs = "1089640835626311833";
  if (!canal_logs) return;

  let embed = new Discord.EmbedBuilder()
  .setColor("000001")
  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
  .setTitle("<:prince_emoji26:1089582176976248883>  **__Boas Vindas ao Reino de Princeton__** ")
  .setDescription(`Sinta-se a Vontade em Princeton!\n↳ Veja algumas [Informações](https://discord.com/channels/1039049234734919721/1089640823248912414) Sobre o Servidor!\n↳ Faça seu [registro](https://discord.com/channels/1039049234734919721/1089640827040579624) para personalizar seu perfil!\n↳ Leia as [regras](https://discord.com/channels/1039049234734919721/1039051546157129809) para evitar punições e se manter informado(a)!`)
  .setImage('https://cdn.discordapp.com/attachments/1088516288688697484/1088648846550241330/518_Sem_Titulo_202303232311202.png');

  member.guild.channels.cache.get(canal_logs).send({ embeds: [embed], content: `${member} <@&1088258400514744430>.` }).then((message) => {
  setTimeout(function () {
    message.delete()
  }, 45000 )
}) 
 // Caso queira que o usuário não seja mencionado, retire a parte do "content".
})
//FIM

//MENSAGEN DE NOVO BOOST
module.exports = async (Client, oldMember, newMember) => {

    const { guild } = newMember;

 
    if (!oldMember.premiumSince && newMember.premiumSince) {

        const embed = new MessageEmbed()
            .setColor("PURPLE")
            .setAuthor({ name: `${newMember.user.username}`, iconURL: guild.iconURL({ dynamic: true, size: 512 }) })
            .setDescription(`<:prince_trofeu:1085708154895081613> ${newMember.user} impulsionou  o servidor ! veja os benefícios de booster em <#1039051553006432276>`)

           Client.guilds.cache.get(guild.id).channels.cache.get("1039051583490637924").send({embeds: [embed]})
    }
} 
//FIM


client.on('ready', () => {
    console.log(`🏴 Estou online em ${client.user.username}!`);
    client.user.setPresence({
      activities: [{ name: `#ImperioPrinceton`, type: ActivityType.Playing }],
      status: 'idle',
    });
 })  

client.slashCommands = new Discord.Collection()


client.login(config.token)


        