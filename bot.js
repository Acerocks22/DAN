const Discord = require('discord.js');
const bot = new Discord.Client();

const prefix = "-";

bot.on("ready", () => {
    console.log(`Ready to server in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
    bot.user.setGame("with friends | -help");
});

bot.on('message', msg => {
	if (msg.author.bot) return;
	
	if (msg.content.startsWith(prefix + "ping")) {
        msg.channel.send("Hello! :smile:");
    }
    if (msg.content.startsWith(prefix + "who")) {
        msg.channel.send("Hi! My name is D.A.N. or\n**D**iscord\n**A**rtificial\n**N**eohuman");
    }
    if(msg.content.startsWith(prefix + "conch")) {
		var args = msg.content.split(' ');
		if (args[1] == undefined) {c 
			msg.channel.send(":shell: | You have to ask a question in order to receive an answer!");
			return;
		} else {
			var responses = ["It is certain.", "Reply hazy try again.", "Don't count on it.", "It is decidedly so.", "Ask again later.", "My reply is no.", "Without a doubt,", "Yes definitely.", "You may rely on it.", "Better not tell you now.", "My sources say no.", "As I see it, yes.", "Cannot predict now", "Outlook not so good.", "Most likely.", "Outlook good.", "Yes", "Concentrate and ask again.", "Very doubtful.", "Signs point to yes."];
			response = responses[Math.floor(Math.random() * responses.length)];
			msg.channel.send(":shell: | Asking the Conch...").then((sent) => {setTimeout(() =>{sent.edit(":shell: | " + response)},1000)});
		}
	}
	if (msg.content.startsWith(prefix + "insult")) {
        var target = msg.mentions.users.first();
        if (target == undefined) {
			msg.reply("Make sure you specify a target!");
			return;
		}
        
        var noun = ["poo-head", "butt-face", "stinky-butt", "dummy", "fart-face", "pee-pee head", "poo-poo", "beaver", "dumb-dumb", "mc fart face"];
        var noun = noun[Math.floor(Math.random() * noun.length)];
        
        var adj = ["stinky", "stupid", "silly", "weird", "smelly", "annoying", "dumb", "spooky", "poopy"];
        var adj = adj[Math.floor(Math.random() * adj.length)];
        
        var phrase = [`You're a ${adj} ${noun}. >:(`, `Wowow, what a ${adj} ${noun}.`, `You are nothing but a ${adj} ${noun}.`];
        var phrase = phrase[Math.floor(Math.random() * phrase.length)];
        
        msg.channel.send(`${target}, ${phrase}`);
	}
	if (msg.content.startsWith(prefix + "spooky")) {
        var target;
        if (msg.mentions.users.first() == undefined) {
			target = msg.author + ", you have";
		} else {
			target = msg.mentions.users.first() + " has";
		}
		var num = randomInt(0, 11);
		var message;
		
		if (num == 1) {
			message = "Not spooky at all. Don't worry.";
		} else if (num == 2) {
			message = "Barely spooky enough to matter.";
		} else if (num == 3) {
			message = "Your spooky levels are spiking a bit, but it's ok.";
		} else if (num == 4) {
			message = "Spooky, but yet not spooky.";
		} else if (num == 5) {
			message = "Spooky.";
		} else if (num == 6) {
			message = "Just a little spookier than normal.";
		} else if (num == 7) {
			message = "You're much spookier. I'd watch out for skeletons.";
		} else if (num == 8) {
			message = "You're really spooky, it's making me nervous.";
		} else if (num == 9) {
			message = "2 Spooky 4 Me!";
		} else if (num == 10) {
			message = "THE SKELETONS HAVE CONSUMED YOU. IT IS TOO LATE.";
		}
		
		msg.channel.send(`:skull: | Spook-o-meter:\n${target} a spooky level of **${num}**.\n${message}`);
	}
	if (msg.content.startsWith(prefix + "avatar")) {
		var avatar;
		if (msg.mentions.users.first() == undefined) {
			avatar = msg.author.avatarURL;
			msg.channel.send(":frame_photo: | **" + msg.author.username + "**, What a wonderful image!\n" + avatar);
		} else {
			avatar = msg.mentions.users.first().avatarURL;
			msg.channel.send(":frame_photo: | **" + msg.mentions.users.first().username + "**, What a wonderful image!\n" + avatar);
		}
	}
	if (msg.content.startsWith(prefix + "add")) {
		msg.author.send("**Want me on your server?**\nClick this link:\nhttps://discordapp.com/oauth2/authorize?client_id=313303655656849410&scope=bot&permissions=201452608");
	}
	if (msg.content.startsWith(prefix + "help")) {
		msg.channel.send("`Full Command List`\n```cs\n-ping\n\t# Ping the bot.\n-who\n\t# Find out info about the bot.\n-insult\n\t# Insult someone.\n-conch\n\t# Ask the magic conch shell a question.\n-spooky\n\t# Check how spooky someone is.\n-avatar\n\t# Get the avatar of someone.\n-slap\n\t# Slap someone!\n-add\n\t# Add this bot to your own server.```");
	}
	if (msg.content.startsWith(prefix + "slap")) {
		var slapnum = randomInt(0, 16);
		var target = msg.mentions.users.first();
		if (target == undefined) {
			msg.reply("You have to specify a target!");
			return;
		} else if (target == msg.author) {
			msg.reply("Don't slap yourself, that's not nice. :(");
			return;
		}
		msg.channel.send(`:clap: | ${msg.author} slapped ${target}!\n`, {files: ["slap/slap" + slapnum + ".gif"]});
	}
});

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};

bot.login('MzEzMzAzNjU1NjU2ODQ5NDEw.C_nr9w.VCjneeveovhq8OvTTqcHEraMv3Q');
