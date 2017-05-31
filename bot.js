const Discord = require('discord.js');
const bot = new Discord.Client();
const express = require('express');
var app = express();
var http = require('http');
app.server = http.createServer(app);
var mzsi = require('mzsi');
var owjs = require('overwatch-js');
var bodyParser = require('body-parser');
var casual = require('casual');
var query = require('./lib/db.js');
var moment = require('moment');
moment().format();

var acronym = require("acronym");
var path = require("path");
var figlet = require('figlet');
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();
    
var pos = require('pos');

//===COLLECTIONS===//
var timeout = new Discord.Collection();
var slots = new Discord.Collection();

const prefix = "-";
const beta = "beta ";
const port = "8080";
var post;
var user;
var server;
var message;

/*var channel;
var adjectives = [];
var nouns = [];
var verbs = [];*/

bot.on("ready", () => {
    console.log(`Ready to server in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
    bot.user.setGame("with friends | -help");
});

bot.on('message', msg => {
	if (msg.author.bot) return;
	
	userId = msg.author.id;
	//==CHATBOT CODE STARTS HERE==
	/*channel = msg.channel;
	if (!msg.content.startsWith("http")) {
		var words = new pos.Lexer().lex(msg.content);
		var tags = new pos.Tagger()
		  .tag(words)
		  .map(function(tag){return tag[0] + '/' + tag[1];})
		  .join(' ');
		  
		var chunker = require('pos-chunker');
		var places = chunker.chunk(tags, '[{ tag: NNP }]');
		adjectives.push(chunker.chunk(tags, '[{ tag: JJ }]'));
		console.log(places);
		
		wordpos.getAdjectives(msg.content, function(result){
			for (var i = 0; i < result.length; i++) {
				adjectives.push(result[i]);
			}
		});
		wordpos.getNouns(msg.content, function(result){
			for (var i = 0; i < result.length; i++) {
				nouns.push(result[i]);
			}
		});
		wordpos.getVerbs(msg.content, function(result){
			for (var i = 0; i < result.length; i++) {
				verbs.push(result[i]);
			}
		});
	}
	
	if (msg.isMentioned(bot.user)) {
		noun = nouns[Math.floor(Math.random() * nouns.length)];
		adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		msg.reply("I am " + noun + " " + adjective);
	}*/
	//==CHATBOT CODE ENDS HERE==
	
	if (msg.content.startsWith(prefix + "payday")) {
		getTime(userId, function(err, result) {
			if (err) {
				console.log(err);
			}
			var paydaydate = Number(result.rows[0].payday) * 1000;
			paydaydateISO = moment(paydaydate).toISOString();
			
			var date = moment();
			var nextdate = moment(paydaydate).add(18, 'hours');
			
			var difference = moment(date).diff(moment(paydaydate), 'minutes');
			var timeuntil = moment(nextdate).diff(date, 'hours', true);
			timeuntil = Math.round(timeuntil * 100) / 100;
			
			if (difference > 1079) {
				var curdate = Math.floor(moment() / 1000);
				msg.channel.send(":money_mouth::moneybag: | Gave you **250** coins!");
				setTime(userId, curdate, function(err, result) {
					if (err) {
						console.log(err);
					}
				 });
				 addMoney(userId, 250, function(err, result) {
					if (err) {
						console.log(err);
					}
				 });
				return;
			} else if (difference <= 1079) {
				msg.channel.send(":moneybag::alarm_clock: | You have **"+timeuntil+"** hour(s) before your next payday!");
				return;
			}
		});
	}
	if (msg.content.startsWith(prefix + "balance")) {
		var target;
		var person;
		var debt = "";
		if (msg.mentions.users.first() == undefined) {
			target = msg.author.id;
			person = msg.author.username;
		} else {
			target = msg.mentions.users.first().id;
			person = msg.mentions.users.first().username;
		}
		getMoney(target, function(err, result) {
			if (result.rows[0] == undefined) {
				msg.reply(person + " has not opened an account yet!");
				return;
			} else {
				var amount = result.rows[0].money;
				if (amount < 0) {
					debt = "**You're in debt!**";
				}
			}
			
			msg.channel.send(":bank::moneybag: | " +person+ " has **"+amount+" coins** in their account.\n" + debt);
			if (err) {
				console.log(err);
			}
		});
	}
	
	if (msg.guild.name != "Discord Bots") {
		addUser(userId, 0, function(err, result) {
			if (err) {
				console.log(err);
			}
		});
		
		/*getUser(userId, function(err, result) {
			if (err) {
				console.log(err);
			}
		});*/
	}
	
	if (msg.author.bot) return;
	
	/*if (msg.content.includes("@everyone")) {
		msg.delete();
		msg.reply("Don't ping everyone >:(");
		return;
	}*/
	
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
        
        var adj = ["a stinky", "a stupid", "a silly", "a weird", "a smelly", "an annoying", "a dumb", "a spooky", "a poopy"];
        var adj = adj[Math.floor(Math.random() * adj.length)];
        
        var phrase = [`You're ${adj} ${noun}. >:(`, `Wowow, what ${adj} ${noun}.`, `You are nothing but ${adj} ${noun}.`];
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
		var num = randomInt(1, 10);
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
		msg.reply('Sent you a DM.');
		msg.author.send("**Want me on your server?**\nClick this link:\nhttps://discordapp.com/oauth2/authorize?client_id=313303655656849410&scope=bot&permissions=201452608");
	}
	if (msg.content.startsWith(prefix + "help")) {
		msg.author.send("`Full Command List`\n```cs\n-ping\n\t# Ping the bot.\n-who\n\t# Find out info about the bot.\n-insult <user>\n\t# Insult someone.\n-conch <question>\n\t# Ask the magic conch shell a question.\n-spooky <user>\n\t# Check how spooky someone is.\n-avatar <user>\n\t# Get the avatar of someone.\n-slap <user>\n\t# Slap someone!\n-add\n\t# Add this bot to your own server.\n-duel <user>\n\t# Duel someone in the server.\n-ascii <text>\n\t# Convert text into ASCII lettering.\n-horses\n\t# Bet on some horse racing!\n-zodiac <month INT> <day INT>\n\t# Get info about your zodiac sign.\n-ow <battle tag>\n\t# Get info about your Overwatch profile.\n-ftoc <number>\n\t# Convert Farenheit to Celsius\n-ctof <number>\n\t# Convert Celsius to Farenheit\n-join\n\t# Join the DAN's Support Server\n====MONEY====\n-payday\n\t# Collect your daily paycheck!\n-balance\n\t# Check your bank account balance.\n-work <job>\n\t# Work a job for some extra Coins. Use -jobs to check the available jobs.\n-slots\n\t# Test your luck, pull the lever.\n-heist\n\t# Attempt a bank heist!```");
		msg.channel.send("The command list has been DMed to you. :)");
	}
	if (msg.content.startsWith(prefix + "slap")) {
		var slapnum = randomInt(1, 16);
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
	if (msg.content.startsWith(prefix + "acronym")) {
		var args = msg.content.split(' ');
		if(args[1] == undefined) {
			msg.reply("Make sure you specify a word/name!");
		}
		if(args.length > 2) {
			msg.reply("Please only specify one word.");
			return;
		}
		
		msg.channel.send(args[1] + " = **" + acronym(args[1]) + "**");
	}
	if (msg.content.startsWith(prefix + "duel")) {
		var target = msg.mentions.users.first();
		var winner = randomInt(1,3);
		var loser;
		
		if(target == undefined) {
			msg.reply("Make sure you specify a target!");
			return;
			
		}
		
		var battlemsg = [
			"<user1> grabbed a sword and rushed past <user2>, making a clean cut across their neck, and leaving them to bleed out on the ground.",
			"<user1> stuck their hand down <user2>'s throat, wrapped their palm around their spine, and tugged it out through their mouth.",
			"Just when <user2> thought they were safe, <user1> came up behind them and stabbed them in the back 47 times.",
			"<user1> sneaks up from behind, covers <user2>'s mouth and shanks them with a dagger to the throat.",
			"<user1> grabs <user2> by the back of the neck and tightly pushes their head against a belt sander, slowly exposing the bone underneath their skin.",
			"<user1> charges <user2> with no hesitation. the first strike severs both legs, disembowels their abdomen, then begins to shove the chainsaw down <user2>'s throat.",
			"<user1> sprints to <user2>, severing their legs with an ax blow straight above the kneecaps and they fall into the bloodied blade.",
			"<user1> wraps their hands arounds <user2>'s head, pressing their thumbs into <user2>'s eye sockets, letting the blood stream down their cheeks.",
			"<user1> knew they wouldn't stand a chance, so they hung themselves before the fight could begin.",
			"<user2> got caught in an explosion at an Ariana Grande concert.",
			"<user2> got lost on their way to the duel and ended up on a cultist camp, getting sacrificed to the \"Dark Lord\".",
			"<user1> started running. <user2> was close behind, wildly swinging an axe. <user1> tripped on a rock and tumbled to the ground, accepting their fate as an axe embedded itself in their chest.",
			"<user1> was too busy watching TV to notice <user2> climbing through the window, brandishing a 9MM Glock 29, aimed right at <user1>'s head.",
			"<user2> tested the limits of the human body by wrapping both hands around <user1>'s neck, and violently twisting it to one side, snapping it like a twig."
		];
		
		battlemsg = battlemsg[Math.floor(Math.random() * battlemsg.length)];
		
		
		if (winner == 1) {
			loser = 2;
			battlemsg = battlemsg.replace(/<user1>/g, msg.author);
			battlemsg = battlemsg.replace(/<user2>/g, target);
		} else if (winner == 2) {
			loser = 1;
			battlemsg = battlemsg.replace(/<user2>/g, msg.author);
			battlemsg = battlemsg.replace(/<user1>/g, target);
		}
		
		msg.channel.send(target + ", " + msg.author + " has challenged you to a duel! Accept the duel with `" + prefix + "accept`.");
		
		const collector = msg.channel.createCollector(
			m => m.content.startsWith(prefix + "accept"),
			{ maxMatches: 1, time: 30000 }
		);
		collector.on('collect', (msg, collected) => {
			if (msg.author != target) {
				return;
			}
			msg.channel.send(battlemsg);
		});
		collector.on('end', collected => {
			console.log(collected.length);
			if (collected.length == undefined) {
				msg.channel.send(target + " wimped out and didn't respond!");
				return;
			}
		});
	}
	if (msg.content.startsWith(prefix + "ascii")) {
		var line = msg.content.split(' ');
		line = line[0] + " ";
		var word = msg.content.slice(msg.content.indexOf(prefix + 'ascii') + line.length);
		
		figlet(word, function(err, data) {
			if (err) {
				console.log('Something went wrong...');
				console.dir(err);
				return;
			}
			if (data.length > 443) {
				msg.channel.send("String given is too long!");
				return;
			}
			msg.channel.send("```"+data+"```");
		});
	}
	if (msg.content.startsWith(prefix + "horses")) {
		var lane1 = ': =========:horse_racing: : Jim';
		var lane2 = ': =========:horse_racing: : Brad';
		var lane3 = ': =========:horse_racing: : Kevin';
		var lane4 = ': =========:horse_racing: : Carl';
		var place1 = 12;
		var place2 = 12;
		var place3 = 12;
		var place4 = 12;
		var move1;
		var move2;
		var move3;
		var move4;
		var msgid = 12;
		var move;

		function replaceIndex(string, at, repl) {
		   return string.replace(/\S/g, function(match, i) {
				if( i === at ) return repl;

				return match;
			});
		}

		msg.channel.send("LET THE RACES BEGIN:\n" + lane1 + "\n" + lane2 + "\n" + lane3 + "\n" + lane4).then((sent) => {msgid = sent.id; moveHorses()});
		
		function moveHorses() {
			move = setInterval(function() {
				move1 = randomInt(1,4);
				move2 = randomInt(1,4);
				move3 = randomInt(1,4);
				move4 = randomInt(2,5);
				if (move1 == 3) {
					lane1 = lane1.replace(/:horse_racing:/g, '=');
					lane1 = replaceIndex(lane1, place1 - 1, ':horse_racing:');
					place1 -= 1;
				}
				if (move2 == 2) {
					lane2 = lane2.replace(/:horse_racing:/g, '=');
					lane2 = replaceIndex(lane2, place2 - 1, ':horse_racing:');
					place2 -= 1;
				}
				if (move3 == 1) {
					lane3 = lane3.replace(/:horse_racing:/g, '=');
					lane3 = replaceIndex(lane3, place3 - 1, ':horse_racing:');
					place3 -= 1;
				}
				if (move4 == 4) {
					lane4 = lane4.replace(/:horse_racing:/g, '=');
					lane4 = replaceIndex(lane4, place4 - 1, ':horse_racing:');
					place4 -= 1;
				}
				
				msg.channel.fetchMessage(msgid).then(message => {message.edit("LET THE RACES BEGIN:\n" + lane1 + "\n" + lane2 + "\n" + lane3 + "\n" + lane4);});
				if (place1 == 2) {
					msg.channel.send(":tada: **Jim wins the race!** :tada:");
					clearInterval(move);
				} else if (place2 == 2) {
					msg.channel.send(":tada: **Brad wins the race!** :tada:");
					clearInterval(move);
				} else if (place3 == 2) {
					msg.channel.send(":tada: **Kevin wins the race!** :tada:");
					clearInterval(move);
				} else if (place4 == 2) {
					msg.channel.send(":tada: **Carl wins the race!** :tada:");
					clearInterval(move);
				}
			}, 1000);
		}
	}
	if (msg.content.startsWith(prefix + "zodiac")) {
		var args = msg.content.split(' ');
		if (msg.content.includes("/") || msg.content.includes(" ")) {
			msg.channel.send("Make sure you follow the correct syntax.");
			return;
		}
		
		var month = Number(args[1]);
		var day = Number(args[2]);
		var sign = mzsi(month, day);
		var strength = "**Strengths:** ";
		var strengths = sign.about.keywords.strength;
		var weaknesses = sign.about.keywords.weakness;
		var weakness = "**Weaknesses:** ";
		
		for (var s = 0; s < strengths.length; s++) {
			if (strengths.length == 1) {
				strength += strengths[s] + ".";
			} else if (s < strengths.length - 1) {
				strength += strengths[s] + ", ";
			} else {
				strength += "and " + strengths[s] + ".";
			}
		}
		for (var w = 0; w < weaknesses.length; w++) {
			if (weaknesses.length == 1) {
				weakness += weaknesses[w] + ".";
			} else if (w < weaknesses.length - 1) {
				weakness += weaknesses[w] + ", ";
			} else {
				weakness += "and " + weaknesses[w] + ".";
			}
		}
		
		msg.channel.send("**Date:** "+month+"/"+day+"\n**Zodiac Name:** "+sign.name+"\n**Symbol:** "+sign.symbol+"\n"+strength+"\n"+weakness);
	}
	if(msg.content.startsWith(prefix + 'ow')) {
		var args = msg.content.split(' ');
		var tag = args[1].replace('#', '-');
		//// Search for a player ( you must have the exact username, if not Blizzard api will return a not found status) 
		owjs
			.getOverall('pc', 'us', tag)
			.then((data) => {
				var rank = data['profile'].rank;
				var tier = data['profile'].tier;
				var level = data['profile'].level;
				var compElims = data['competitive']['global'].eliminations_average;
				var compDeaths = data['competitive']['global'].deaths_average;
				var compDamage = data['competitive']['global'].damage_done;
				var compKillstreak = data['competitive']['global'].kill_streak_best;
				
				if (compElims == undefined) {
					compElims = "N/A";
				}
				if (compDeaths == undefined) {
					compDeaths = "N/A";
				}
				if (compDamage == undefined) {
					compDamage = "N/A";
				}
				if (compKillstreak == undefined) {
					compKillstreak = "N/A";
				}
				//console.log(data);
				if (isNaN(rank)) {
					rank = "N/A";
				}
				if(level.length == 1) {
					level = "0" + level.toString();
				}
				if (tier == 0) {
					tier = "";
				}
				msg.channel.send("", {embed: {
					color: 1352973,
					author: {
						name: 'Overwatch stats for ' + args[1]
					},
					description: '--------------\n',
					fields: [
						{
						name: 'Level: ',
						value: tier.toString() + level.toString()
						},
						{
						name: 'Rank: ',
						value: rank
						},
						{
						name: 'Quickplay Stats: ',
						inline: true,
						value: '**Elimination Average:** ' + data['quickplay']['global'].eliminations_average.toString() + '\n**Death Average:** ' + data['quickplay']['global'].deaths_average.toString() + '\n**Damage Done:** ' + data['quickplay']['global'].damage_done.toString() + '\n**Best Killstreak:** ' + data['quickplay']['global'].kill_streak_best.toString()
						},
						{
						name: 'Competitive Stats: ',
						inline: true,
						value: '**Elimination Average:** ' + compElims.toString() + '\n**Death Average:** ' + compDeaths.toString() + '\n**Damage Done:** ' + compDamage.toString() + '\n**Best Killstreak:** ' + compKillstreak.toString()
						},
						{
						name: 'Medal Stats: ',
						value: '**Total Medals:** ' + data['quickplay']['global'].medals.toString() + '\n**Gold Medals:** ' + data['quickplay']['global'].medals_gold.toString() + '\n**Silver Medals:** ' + data['quickplay']['global'].medals_silver.toString() + '\n**Bronze Medals:** ' + data['quickplay']['global'].medals_bronze.toString()
						}
					],
					thumbnail: {
						url: data['profile'].avatar
					}
				}});
			})
			.catch(function(e) {
				//if (e.toString().includes(''))
				console.log(e);
			});
	}
	if (msg.content.startsWith(beta + "puzzle")) {
		var puzzle = '';
		var puzzles = casual.catch_phrase;
		console.log(puzzles);
		var num = randomInt(1,10);
		var charcode;
		
		var args = puzzles.split('');
		
		for (var i = 0; i < args.length; i++) {
			charcode = (puzzles[i].charCodeAt() + num);
			if (args[i] == " ") {
				puzzle += " ";
			} else {
				puzzle += String.fromCharCode(charcode);
			}
		}
		msg.channel.send(puzzle);
		
		const collector = msg.channel.createCollector(
			m => m.content.startsWith(puzzles),
			{ maxMatches: 1, time: 3000000 }
		);
		collector.on('collect', (msg, collected) => {
			msg.channel.send("Correct!");
		});
		collector.on('end', collected => {
		});
	}
	if (msg.content.startsWith(prefix + "join")) {
		msg.reply('Sent you a DM.');
		msg.author.send('Have any questions about the bot or just want to get info on updates before they\'re released?\n**Join the official server:**\ndiscord.gg/dEMZZMe');
	}
	if (msg.content.startsWith(prefix + "ftoc")) {
		var args = msg.content.split(' ');
		
		var Faren = Number(args[1]);
		
		var Celc = (Faren - 32) / 1.8;
		var Celc =  Math.floor(Celc);
		
		msg.channel.send("Farenheit to Celsius: \n`" + Faren +"F°` = `" + Celc + "C°`");
	}
	if (msg.content.startsWith(prefix + "ctof")) {
		var args = msg.content.split(' ');
		
		var Celc = Number(args[1]);
		
		var Faren = (Celc * 1.8) + 32;
		var Faren = Math.floor(Faren);
		
		msg.channel.send("Celsius to Farenheit: \n`" + Celc + "C°` = `" + Faren +"F°`");
	}
	if (msg.content.startsWith(prefix + "slots")) {
		var user = msg.author.id;
		var curtime = moment();
		var settime = slots.get(user);
		var time;
		var nexttime;
		var timeuntil = moment(settime).diff(moment(), 'seconds');
		if (slots.get(user) == undefined || timeuntil < 0) {
			time = moment();
			nexttime = moment(time).add(20, 'seconds');
			slots.set(msg.author.id, nexttime);
		} else {
			time = slots.get(user);
			nexttime = moment(time).add(20, 'seconds');
			timeuntil = moment(nexttime).diff(moment(), 'seconds');
			timeuntil = Number(timeuntil) - 20;
			msg.channel.send(":alarm_clock: | This slot addiction of yours is a problem. Relax!\nYou have **" + timeuntil + " seconds** until you can play again.").then((sent) => {setTimeout(function() {sent.delete(); msg.delete();}, 5000)});
			return;
		}
		
		
		var slotOptions = [":pear:", ":pear:", ":pear:", ":pear:", ":pear:", ":pear:", ":pear:", ":pear:", ":cherries:", ":cherries:", ":cherries:",":cherries:", ":cherries:", ":lemon:", ":lemon:", ":lemon:", ":lemon:", ":grapes:", ":grapes:", ":grapes:", ":grapes:", ":grapes:", ":grapes:", ":crown:", ":crown:"];
		var slot1 = slotOptions[Math.floor(Math.random() * slotOptions.length)];
		var slot2 = slotOptions[Math.floor(Math.random() * slotOptions.length)];
		var slot3 = slotOptions[Math.floor(Math.random() * slotOptions.length)];
		var chance = randomInt(1,5);
		var status = "LOSS";
		var gained = "";
		
		getMoney(userId, function(err, result) {
			var amount = result.rows[0].money;
			if (err) {
				console.log(err);
			}
			if (Number(amount) - 100 < 0) {
				msg.channel.send("You don't have enough coins! Wait until your next payday to get some more. :smile:");
			} else {
				subMoney(userId, 100, function(err, result) {
				if (err) {
					console.log(err);
				}
				if (slot1 == ":pear:" && slot2 == ":pear:" && slot3 == ":pear:") {
					addMoney(userId, 75, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					status = " WIN ";
					gained = "**Payout: 100C**";
					
				} else if (slot1 == ":cherries:" && slot2 == ":cherries:" && slot3 == ":cherries:") {
					addMoney(userId, 800, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					status = " WIN ";
					gained = "**Payout: 800C**";
					
				} else if (slot1 == ":lemon:" && slot2 == ":lemon:" && slot3 == ":lemon:") {
					addMoney(userId, 1000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					status = " WIN ";
					gained = "**Payout: 1000C**";
					
				} else if (slot1 == ":grapes:" && slot2 == ":grapes:" && slot3 == ":grapes:") {
					addMoney(userId, 500, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					status = " WIN ";
					gained = "**Payout: 500C**";
					
				} else if (slot1 == ":crown:" && slot2 == ":crown:" && slot3 == ":crown:") {
					addMoney(userId, 4000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					status = " WIN ";
					gained = "**Payout: 4000C**";
				}
				msg.channel.send(`**╔═══[SLOTS]═══╗**\n\n**▻** ${slot1}  **║**  ${slot2}  **║**  ${slot3} **◅**\n\n**╚═══  [${status}] ═══╝**\n${gained}`);
			});
			}
		});
	}
	if (msg.content.startsWith("=areduct")) {
		if (msg.author.id != "192711002117242880") {
			msg.author.send("No.");
			msg.delete();
			return;
		} else {
			msg.delete();
			var target = msg.mentions.users.first();
			target = target.id;
			setMoney(target, 500, function(err, result) {
				if (err) {
					console.log(err);
				}
			});
		}
	}
	if (msg.content.startsWith(prefix + "heist")) {
		var chance = randomInt(1, 6);
		var amount = randomInt(150, 300);
		var user = msg.author.id;
		
		var curtime = moment();
		var settime = timeout.get(user);
		var time;
		var nexttime;
		var timeuntil = moment(settime).diff(moment(), 'seconds');
		if (timeout.get(user) == undefined || timeuntil < 0) {
			time = moment();
			nexttime = moment(time).add(15, 'seconds');
			timeout.set(msg.author.id, nexttime);
		} else {
			time = timeout.get(user);
			nexttime = moment(time).add(15, 'seconds');
			timeuntil = moment(nexttime).diff(moment(), 'seconds');
			timeuntil = Number(timeuntil) - 15;
			msg.channel.send(":alarm_clock: | Woah! The police might still be after you!\nYou must wait **" + timeuntil + " seconds** until you can use that command again.").then((sent) => {setTimeout(function() {sent.delete(); msg.delete();}, 5000)});
			return;
		}
		
		if (chance == 2) {
			msg.reply("Attempting to rob the bank...").then((sent) => {setTimeout(() =>{sent.edit("Robbed the bank successfully and gained " + amount + " Coins.")}, 4000)});
			addMoney(userId, amount, function(err, result) {
				if (err) {
					console.log(err);
				}
			});
		} else {
			msg.reply("Attempting to rob the bank...").then((sent) => {setTimeout(() =>{sent.edit("Your attempt was short lived. **You got caught!**\nYou lost 75 Coins to your bail fee.")}, 4000)});
			subMoney(userId, 75, function(err, result) {
				if (err) {
					console.log(err);
				}
			});
		}
	}
	if (msg.content.startsWith("beta test")) {
		var user = msg.author.id;
		var curtime = moment();
		var time;
		var nexttime;
		if (timeout.get(user) == undefined) {
			time = moment();
			nexttime = moment(time).add(10, 'seconds');
			console.log("Key does not exist");
			timeout.set(msg.author.id, nexttime);
		} else {
			time = timeout.get(user);
			nexttime = moment(time).add(10, 'seconds');
			var timeuntil = moment(nexttime).diff(moment(), 'seconds');
			msg.channel.send(":clock: | Woah! The police might still be after you!\nYou must wait " + timeuntil + " seconds until you can use that command again.");
			return;
		}
	}
	if (msg.content.startsWith(prefix + "work")) {
		var args = msg.content.split(' ');
		var job = args[1];
		var pay;
		var chance = randomInt(1, 7);
		
		getWork(userId, function(err, result) {
			if (err) {
				console.log(err);
			}
			var paydaydate = Number(result.rows[0].work) * 1000;
			paydaydateISO = moment(paydaydate).toISOString();
			
			var date = moment();
			var nextdate = moment(paydaydate).add(6, 'hours');
			
			var difference = moment(date).diff(moment(paydaydate), 'minutes');
			var timeuntil = moment(nextdate).diff(date, 'hours', true);
			timeuntil = Math.round(timeuntil * 100) / 100;
			
			if (difference > 360) {
				var curdate = Math.floor(moment() / 1000);
				setWork(userId, curdate, function(err, result) {
					if (err) {
						console.log(err);
					}
				 });
				
				if (job.toLowerCase() == "miner") {
					pay = randomInt(125,200);
					if (chance == 4) {
						msg.channel.send("You descended into the coal mines and discovered more than just coal. Your findings are worth "+pay+" Coins!");
						addMoney(userId, pay, function(err, result) {
							if (err) {
								console.log(err);
							}
						});
					} else {
						msg.channel.send("The mine collapsed before you could get much done. The boss was too happy. No Coins today!");
					}
				} else if (job.toLowerCase() == "waiter") {
					pay = randomInt(100,150);
					if (chance == 4 || chance == 2 || chance == 6) {
						msg.channel.send("You were voted number one in customer service at the restaurant today! You made **"+pay+" Coins** for your efforts.");
						addMoney(userId, pay, function(err, result) {
							if (err) {
								console.log(err);
							}
						});
					} else {
						msg.channel.send("You were all over the place! Each group of people you sat a table left because you took so long. No money today.");
					}
				} else if (job.toLowerCase() == "stripper") {
					pay = randomInt(100,150);
					if (chance == 4 || chance == 5 || chance == 1) {
						msg.channel.send("You got pinched *and* tipped. Your hips must've been on point, because you made **"+pay+" Coins** today.");
						addMoney(userId, pay, function(err, result) {
							if (err) {
								console.log(err);
							}
						});
					} else {
						msg.channel.send("You must've not bounced that booty hard enough, because your clients did *not* like your style.");
					}
				} else if (job.toLowerCase() == "clown") {
					pay = randomInt(20, 50);
					if (chance != 6) {
						msg.channel.send("You apparently kept kids entertained successfully. Even if it's a meager **"+pay+" Coins**, you should still be proud!");
						addMoney(userId, pay, function(err, result) {
							if (err) {
								console.log(err);
							}
						});
					} else {
						msg.channel.send("Uh oh, one kid started crying then they *all* started crying. I don't think you're going to be getting any money today...");
					}
				} else if (job.toLowerCase() == "priest") {
					pay = randomInt(30, 75);
					people = randomInt(12, 25);
					if (chance != 2 || chance != 5) {
						msg.channel.send("You shouted out your wondrous words to the skies above and blessed "+people+" new people into your religion. Now you can take that **"+pay+" Coins** in donations you got.");
						addMoney(userId, pay, function(err, result) {
							if (err) {
								console.log(err);
							}
						});
					} else {
						msg.channel.send("The Lord Jesus was not very pleased with your work; no one donated! Better luck next time.");
					}
				} else if (job.toLowerCase() == "memer") {
					pay = randomInt(5, 16);
					people = randomInt(12, 25);
					if (chance != 1) {
						msg.channel.send("You made a meme and it went viral! Now you can reap the "+pay+" Coins in ad revenue.");
						addMoney(userId, pay, function(err, result) {
							if (err) {
								console.log(err);
							}
						});
					} else {
						msg.channel.send("That meme and this job was a joke. You made absolutely nothing.");
					}
				} else {
					msg.channel.send("Whoops! You didn't specify a valid job.");
					return;
				}
				return;
			} else if (difference <= 360) {
				msg.channel.send(":office::alarm_clock: | You have **"+timeuntil+"** hour(s) before you can work again.");
				return;
			}
		});
	}
	if (msg.content.startsWith(prefix + "jobs")) {
		msg.channel.send("```\nAVAILABLE JOBS:\n-Miner\n-Waiter\n-Stripper\n-Clown\n-Priest\n-Memer\nFORMAT: -work <job>```");
	}
});

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};

function isEven(n) {
   return n % 2 == 0;
}

function isOdd(n) {
   return Math.abs(n % 2) == 1;
}

bot.login('MzEzMzAzNjU1NjU2ODQ5NDEw.C_nr9w.VCjneeveovhq8OvTTqcHEraMv3Q');

/*app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});*/

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.server.listen(process.env.PORT || 4000);
console.log('DANbot is listening on port ' + app.server.address().port + '!');

//====DATABASE FUNCTIONS====//
function addUser(user, money, cb) {
    query(`INSERT INTO bank(user_id, money) VALUES ('${user}', '${money}') ON CONFLICT (user_id) DO NOTHING`, function(err, result) {
        if (err)
            cb(err, null);
        //console.log(result);
        cb(null, result);
    });
}

function getUser(user, cb) {
    query(`SELECT (EXISTS(SELECT * FROM bank WHERE user_id = '${user}'))::int`, function(err, result) {
        if (err) {
            cb(err, null);
        }
        cb(null, result);
    });
}

function getTime(user, cb) {
    query(`SELECT payday FROM bank WHERE user_id = '${user}'`, function(err, result) {
        if (err) {
            cb(err, null);
        }
        cb(null, result);
    });
}

function setTime(user, date, cb) {
    query(`UPDATE bank SET payday = '${date}' WHERE user_id = '${user}'`, function(err, result) {
        if (err)
            cb(err, null);
        //console.log(result);
        cb(null, result);

    });
}

function getWork(user, cb) {
    query(`SELECT work FROM bank WHERE user_id = '${user}'`, function(err, result) {
        if (err) {
            cb(err, null);
        }
        cb(null, result);
    });
}

function setWork(user, date, cb) {
    query(`UPDATE bank SET work = '${date}' WHERE user_id = '${user}'`, function(err, result) {
        if (err)
            cb(err, null);
        //console.log(result);
        cb(null, result);

    });
}

function addMoney(user, mAmount, cb) {
    query(`UPDATE bank SET money = money + '${mAmount}' WHERE user_id = '${user}'`, function(err, result) {
        if (err)
            cb(err, null);
        //console.log(result);
        cb(null, result);

    });
}

function subMoney(user, mAmount, cb) {
    query(`UPDATE bank SET money = money - '${mAmount}' WHERE user_id = '${user}'`, function(err, result) {
        if (err)
            cb(err, null);
        //console.log(result);
        cb(null, result);

    });
}

function setMoney(user, mAmount, cb) {
    query(`UPDATE bank SET money = '${mAmount}' WHERE user_id = '${user}'`, function(err, result) {
        if (err)
            cb(err, null);
        //console.log(result);
        cb(null, result);

    });
}

function getMoney(user, cb) {
    query(`SELECT money FROM bank WHERE user_id = '${user}'`, function(err, result) {
        if (err) {
            cb(err, null);
        }
        cb(null, result);
    });
}


//====IRRELEVANT STUFF====//

//io.sockets.emit('trades', {accept: totalTradesAccepted, deny: totalTradesDenied});

/*if (msg.content.startsWith(prefix + "social")) {
		message = msg;
		user = msg.author.username;
		server = msg.guild.name;
		var args = msg.content.split(" ");
		var args = args[0] + "  ";
		post = msg.content.slice(msg.content.indexOf('.giraffe') + args.length);
		if (!post) {
			msg.channel.send("Send a valid message.");
			return;
		} else if (post.toLowerCase().includes("fag") || post.toLowerCase().includes("fuck you") || post.toLowerCase().includes("cunt") || post.toLowerCase().includes("kys") || post.toLowerCase().includes("kill yourself")) {
			msg.channel.send("Be nice! You're talking on a public chat.");
			return;
		} 
		
		msg.channel.send("Sending a message to everyone...\n`" + post + "`").then((sent) => {setTimeout(() =>{sent.edit("Sent message:\n`" + post + "`")},3000)});
		setTimeout(function() {
			var postchannel;
			var postchannel2;
			
			for (const guild of bot.guilds.values()) {
				if (guild.channels.find("name", "bot_commands")) {
					postchannel = guild.channels.find("name", "bot_commands");
					postchannel.send("```\nMSG from " + user + " in the server \"" + server + "\":\n\"" + post  + "\"\n```");
				} else if (guild.channels.find("name", "bot_spam")) {
					postchannel = guild.channels.find("name", "bot_spam");
					postchannel.send("```\nMSG from " + user + " in the server \"" + server + "\":\n\"" + post  + "\"\n```");
				}
			}
		}, 3000);
	}
	*/
