const Discord = require('discord.js');
const bot = new Discord.Client();
const express = require('express');
var app = express();
var http = require('http');
var request = require("request");
app.server = http.createServer(app);
var mzsi = require('mzsi');
var owjs = require('overwatch-js');
var bodyParser = require('body-parser');
var casual = require('casual');
var query = require('./lib/db.js');
var moment = require('moment');
moment().format();
var Canvas = require('canvas');
var fs = require('fs');
var util = require('util');
var urban = require('urban');
var YodaSpeak = require('yoda-speak');
var yoda = new YodaSpeak("JoyWrItwf0msh4CsAQnOQvfQBjGSp1tXrrNjsnQ6u6NhddvO6T");
const {PubgAPI, PubgAPIErrors} = require('pubg-api-redis');
const api = new PubgAPI({
  apikey: '0ab2b8a9-599d-44b1-93bf-f5ef84680935'
});

var acronym = require("acronym");
var path = require("path");
var figlet = require('figlet');
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();

var markov = require('markov');
var m = markov(1);
var pos = require('pos');
var jackpot = 0;

//===COLLECTIONS===//
var timeout = new Discord.Collection();
var slots = new Discord.Collection();
var rob = new Discord.Collection();
var social = new Discord.Collection();
var horseBets = new Discord.Collection();

const prefix = "-";
const beta = "beta ";
const port = "8080";
var post;
var user;
var server;
var message;
//var itemData = require("./json/itemData.json");

var streamList = [];

var totalUserCount;
totalUserCount = bot.users.size;
var cmdCount = 0;

/*var channel;
var adjectives = [];
var nouns = [];
var verbs = [];*/

bot.on("ready", () => {
    console.log(`Ready to server in ${bot.channels.size} channels on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
    bot.user.setGame("with "+bot.users.size +" friends | -help");
    totalUserCount = bot.users.size;
});

function isValid(str) { return /^[0-9A-Za-z\s]+$/.test(str); }

bot.on('message', msg => {
	var botuser;
	if (msg.content.startsWith(prefix)) {
		botuser = msg.channel.permissionsFor(bot.user.id);
		cmdCount += 1;
		if (!botuser.has("SEND_MESSAGES") || !botuser.has("READ_MESSAGES")) {
			return;
		}
	}
	
	/*if (!msg.content.startsWith(prefix) || isValid(msg.content) === true || msg.content.startsWith('-') == false) {
		if (bot.user.id == msg.author.id) {
			return;
		}
		if (msg.content.includes("]")) {
			return;
		} else if (msg.content.includes("@!")) {
			return;
		} else if (msg.content.includes("<")) {
			return;
		} else if (msg.content.includes(":")) {
			return;
		}
		fs.appendFile('json/msg.txt', msg.content+'\n');
	}
	
	if (msg.content.startsWith(prefix+"talk")) {
		var s = fs.createReadStream(__dirname + '/json/msg.txt');
		m.seed(s, function () {
			//console.log(m.fill("is").join(' '));
			var res = m.forward("the").join(' ');
			msg.channel.send(res);
		});
	}*/
	
	if (msg.content.startsWith(prefix + "cmdcount")) {
		msg.channel.send("**Commands sent since last restart: **"+cmdCount);
	}
	
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
		msg.author.send("`Full Command List`\n```cs\n-ping\n\t# Ping the bot.\n-who\n\t# Find out info about the bot.\n-insult <user>\n\t# Insult someone.\n-conch <question>\n\t# Ask the magic conch shell a question.\n-spooky <user>\n\t# Check how spooky someone is.\n-avatar <user>\n\t# Get the avatar of someone.\n-slap <user>\n\t# Slap someone!\n-add\n\t# Add this bot to your own server.\n-duel <user>\n\t# Duel someone in the server.\n-ascii <text>\n\t# Convert text into ASCII lettering.\n-horses\n\t# Bet on some horse racing!\n-zodiac <month INT> <day INT>\n\t# Get info about your zodiac sign.\n-ow <battle tag>\n\t# Get info about your Overwatch profile.\n-pubg <nickname>\n\t# Get info about your PUBG stats.\n-ftoc <number>\n\t# Convert Farenheit to Celsius\n-ctof <number>\n\t# Convert Celsius to Farenheit\n-join\n\t# Join the DAN's Support Server\n-donate\n\t# Donate to keep the bot running.\n====SOCIAL STREAM====\n-social open\n\t# Start a Social Stream (Server-Owner only command)\n-social close\n\t# Close a Social Stream (Server-Owner only command)\n-social send <message>\n\t# Send a message to other servers.\n-streamlist\n\t# Check how many servers have a Social Stream open.\n====MONEY====\n-top <number>\n\t# Check the leaderboards and see who's the richest!\n-payday\n\t# Collect your daily paycheck!\n-balance\n\t# Check your bank account balance.\n-work <job>\n\t# Work a job for some extra Coins. Use -jobs to check the available jobs.\n-slots\n\t# Test your luck, pull the lever.\n-heist\n\t# Attempt a bank heist!\n-house\n\t# Check on your house.\n-realestate\n\t# Check what's up for sale!\n-buy <number>\n\t# Purchase a house.```");
		msg.channel.send("The command list has been DMed to you. :)");
	}
	if (msg.content.startsWith(prefix + "donate")) {
		msg.author.send("You can donate to the bot here: https://www.patreon.com/dan_bot");
		msg.channel.send("A link has been DMed to you. Thanks for considering! :)");
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
		var arg = msg.content.split(' ');
		var target = msg.mentions.users.first();
		
		if (target == undefined) {
			msg.reply("Make sure you specify a target!");
			return;
		} else {
			var targetid = msg.mentions.users.first().id;
		}
		var winner = randomInt(1,3);
		var loser;
		
		if(arg[1] == undefined) {
			msg.reply("Make sure you specify a target!");
			return;
		} else if(target.id == msg.author.id) {
			msg.reply("You can't duel yourself!");
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
			if (msg.author.id == target.id) {
				msg.channel.send(battlemsg);
			} else {
				return;
			}
		});
		collector.on('end', collected => {
			if (collected.size <= 0) {
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
	/*if (msg.content.startsWith(prefix + "horses")) {
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
		var champ;
		var userAmount;
		
		var horse;
		var betMax = 500;
		
		var User = function(un, horsebet) {
			this.username = un,
			this.horse = horsebet
		}
		
		var users = [];
		var winners = [];

		function replaceIndex(string, at, repl) {
		   return string.replace(/\S/g, function(match, i) {
				if( i === at ) return repl;

				return match;
			});
		}
		
		msg.channel.send("LET THE RACES BEGIN:\n" + lane1 + "\n" + lane2 + "\n" + lane3 + "\n" + lane4+"\nPlace your bets with -bet <horse name> <amount>.\nYou have 60 seconds to bet.").then((sent) => {msgid = sent.id});
		
		getMoney(userId, function(err, result) {
			var userMoney = result.rows[0].money;
			if (err) {
				console.log(err);
			}
		
		const collector = msg.channel.createMessageCollector(
			m => m.content.startsWith(prefix + "bet"),
				{ maxMatches: 10000, time: 15000 }
			);
			collector.on('collect', (msg, collected) => {
				args = msg.content.split(" ");
				horse = args[1].toLowerCase();
				userAmount = args[2];
				horseBets.forEach(function(bet, id, horseBets) {
					if (msg.author.id === id) {
						console.log("yes");
						userAmount = 0;
						msg.channel.send("You already bet money!");
						return;
					} else {
						console.log("no");
						subMoney(id, bet.split('/')[1], function(err, result) {
							if (err) {
								console.log(err);
							}
						});
					}
				});
				if (horse !== "carl" && horse !== "kevin" && horse !== "brad" && horse !== "jim") {
					msg.channel.send("That horse isn't racing!");
					return;
				}
				if (userAmount <= 0) {
					msg.channel.send("Invalid amount!");
					return;
				} 
				if (horse === undefined || userAmount === undefined) {
					msg.channel.send("You're missing an argument!");
					return;
				}
				if (userAmount > userMoney) {
					msg.channel.send("You don't have enough money to bet that much.");
					return;
				}
				if (userAmount > betMax) {
					msg.channel.send("You can't bet above 500 Coins.");
					return;
				}
				horseBets.set(msg.author.id, horse+"/"+userAmount);
			});
			collector.on('end', collected => {
				moveHorses();
				horseBets.forEach(function(bet, id, horseBets) {
					users.push(new User(id, bet.split('/')[0]));
					jackpot += Number(bet.split('/')[1]);
				});
				horseBets.clear();
			});
		});
		
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
				
				msg.channel.fetchMessage(msgid).then(message => {message.edit("LET THE RACES BEGIN:\n" + lane1 + "\n" + lane2 + "\n" + lane3 + "\n" + lane4+"\nBets are closed.\nJackpot is "+jackpot+" Coins.");});
				
				if (place1 == 2) {
					msg.channel.send(":tada: **Jim wins the race!** :tada:");
					clearInterval(move);
					champ = "jim";
					endRace(champ);
				} else if (place2 == 2) {
					msg.channel.send(":tada: **Brad wins the race!** :tada:");
					clearInterval(move);
					champ = "brad";
					endRace(champ);
				} else if (place3 == 2) {
					msg.channel.send(":tada: **Kevin wins the race!** :tada:");
					clearInterval(move);
					champ = "kevin";
					endRace(champ);
				} else if (place4 == 2) {
					msg.channel.send(":tada: **Carl wins the race!** :tada:");
					clearInterval(move);
					champ = "carl";
					endRace(champ);
				}
			}, 1000);
			
			function endRace(champ) {
				var winnerStr = "";
				var yourGive;
				for (var i = 0; i < users.length; i++) {
					if (users[i].bet == champ) {
						winners.push(users[i].username);
					}
				}
				for (var i = 0; i < winners.length; i++) {
					winnerStr += bot.users.get(winners[i]).username +", ";
				}
				if (users.length == 0) {
					msg.channel.send("No one bet on a horse, so no one wins!");
					return;
				} else if (winners.length == 0) {
					msg.channel.send("No one won, so the jackpot has not been claimed yet.");
					return;
				} else {
					var winnerEarns = Number(jackpot) / Number(winners.length);
					console.log(winnerEarns);
					msg.channel.send("Congrats to "+winnerStr+"you win "+winnerEarns+" Coins!");
					for (var i = 0; i < winners.length; i++) {
						addMoney(winners[i], winnerEarns, function(err, result) {
							console.log(result);
							if (err) {
								console.log(err);
							}
						});
					}
					jackpot = 0;
				}
			}
		}
	}*/
	if (msg.content.startsWith(prefix + "zodiac")) {
		var args = msg.content.split(' ');
		if (msg.content.includes("/")) {
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
		var arg = args[1];
		if (arg == undefined) {
			msg.reply("Make sure you define a valid Battletag!");
			return;
		}
		var tag = args[1].replace('#', '-');
		//// Search for a player ( you must have the exact username, if not Blizzard api will return a not found status) 
		owjs
			.getOverall('pc', 'us', tag)
			.then((data) => {
				var rank = data['profile'].rank;
				var tier = data['profile'].tier;
				var level = data['profile'].level;
				var compElims = data['competitive']['global'].eliminations;
				var compDeaths = data['competitive']['global'].deaths;
				var compDamage = data['competitive']['global'].all_damage_done;
				var compKillstreak = data['competitive']['global'].kill_streak_best;
				var compHealing = data['competitive']['global'].healing_done;
				var compSolo = data['competitive']['global'].solo_kills;
				var compWon = data['competitive']['global'].games_won;
				var compLost = data['competitive']['global'].games_lost;
				
				var quickTotalMed = data['quickplay']['global'].medals;
				var compTotalMed = data['competitive']['global'].medals;
				var quickGoldMed = data['quickplay']['global'].medals_gold;
				var compGoldMed = data['competitive']['global'].medals_gold;
				var quickSilvMed = data['quickplay']['global'].medals_silver;
				var compSilvMed = data['competitive']['global'].medals_silver;
				var quickBronzMed = data['quickplay']['global'].medals_bronze;
				var compBronzMed = data['competitive']['global'].medals_bronze;
				
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
						value: '**Games Won:** '+data['quickplay']['global'].games_won.toString()+'\n**Total Eliminations:** ' + data['quickplay']['global'].eliminations.toString() + '\n**Total Solo Kills:** '+data['quickplay']['global'].solo_kills.toString()+'\n**Total Deaths:** ' + data['quickplay']['global'].deaths.toString() + '\n**Damage Done:** ' + data['quickplay']['global'].all_damage_done.toString() + '\n**Best Killstreak:** ' + data['quickplay']['global'].kill_streak_best.toString() + '\n**Total Healing Done:** ' + data['quickplay']['global'].healing_done.toString()
						},
						{
						name: 'Competitive Stats: ',
						inline: true,
						value: '**Games Won:** '+compWon+'\n**Games Lost:** '+compLost+'\n**Total Eliminations:** ' + compElims.toString() + '\n**Total Solo Kills:** '+compSolo.toString()+'\n**Total Deaths:** ' + compDeaths.toString() + '\n**Damage Done:** ' + compDamage.toString() + '\n**Best Killstreak:** ' + compKillstreak.toString() + '\n**Total Healing Done:** ' + compHealing
						},
						{
						name: 'Medal Stats: ',
						value: '**Total Medals:** ' + Number(quickTotalMed + compTotalMed).toString() + '\n**Gold Medals:** ' + Number(quickGoldMed + compGoldMed).toString() + '\n**Silver Medals:** ' + Number(quickSilvMed + compSilvMed).toString() + '\n**Bronze Medals:** ' + Number(quickBronzMed + compBronzMed).toString()
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
				msg.reply("That user does not exist.");
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
			nexttime = moment(time).add(10, 'seconds');
			slots.set(msg.author.id, nexttime);
		} else {
			time = slots.get(user);
			nexttime = moment(time).add(10, 'seconds');
			timeuntil = moment(nexttime).diff(moment(), 'seconds');
			timeuntil = Number(timeuntil) - 10;
			msg.channel.send(":alarm_clock: | This slot addiction of yours is a problem. Relax!\nYou have **" + timeuntil + " seconds** until you can play again.").then((sent) => {setTimeout(function() {sent.delete(); msg.delete();}, 5000)});
			return;
		}
		
		
		var slotOptions = [":pear:", ":lemon:", ":pear:", ":cherries:", ":pear:", ":lemon:", ":pear:", ":cherries:", ":grapes:", ":cherries:",":pear:", ":cherries:", ":cherries:", ":grapes:", ":lemon:", ":pear:", ":crown:", ":lemon:", ":grapes:", ":grapes:", ":grapes:", ":pear:", ":grapes:", ":grapes:", ":crown:"];
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
					addMoney(userId, 200, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					status = " WIN ";
					gained = "**Payout: 200C**";
					
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
					addMoney(userId, 600, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					status = " WIN ";
					gained = "**Payout: 600C**";
					
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
	if (msg.content.startsWith("=aradd")) {
		if (msg.author.id != "192711002117242880") {
			msg.author.send("No.");
			msg.delete();
			return;
		} else {
			msg.delete();
			var target = msg.mentions.users.first();
			target = target.id;
			var amount = msg.content.split(' ')[1];
			addMoney(target, amount, function(err, result) {
				if (err) {
					console.log(err);
				}
			});
		}
	}
	if (msg.content.startsWith(prefix + "heist")) {
		var chance = randomInt(1, 6);
		var amount = randomInt(300, 500);
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
	if (msg.content.startsWith("bbeta test")) {
		var jobPays = {minerHi: 275, minerLo: 200, stripperHi: 150, stripperLo: 100, waiterHi: 150, waiterLo: 100, priestHi: 75, priestLo: 30, clownHi: 50, clownLo: 20, memerHi: 16, memerLo: 5};
		
		for (i in jobPays) {
			jobPays[i] *= 2;
			console.log("hi");
		}
	}
	if (msg.content.startsWith(prefix + "work")) {
		var args = msg.content.split(' ');
		var job = args[1];
		var pay;
		var chance = randomInt(1, 7);
		
		var jobs = ['miner', 'stripper', 'waiter', 'priest', 'clown', 'memer', 'chef', 'hobo', 'robber', 'cop'];
		
		var jobPays = {
			minerHi: 450,
			minerLo: 300,
			stripperHi: 150,
			stripperLo: 100,
			waiterHi: 150,
			waiterLo: 100,
			priestHi: 75,
			priestLo: 30,
			clownHi: 50,
			clownLo: 20,
			memerHi: 16,
			memerLo: 5,
			chefHi: 170,
			chefLo: 80,
			hoboHi: 10,
			hoboLo: 2,
			copHi: 300,
			copLo: 200
		};
		
		var houseNum;
		
		getHouse(userId, function(err, result) {
			if (err) {
				console.log(err);
			}
			houseNum = result.rows[0].house;
			
			if (houseNum == 1) {
				for (i in jobPays) {
					jobPays[i] *= 1.1;
				}
			}
			if (houseNum == 2) {
				for (i in jobPays) {
					jobPays[i] *= 1.2;
				}
			}
			if (houseNum == 3) {
				for (i in jobPays) {
					jobPays[i] *= 1.4;
				}
			}
			if (houseNum == 4) {
				for (i in jobPays) {
					jobPays[i] *= 1.6;
				}
			}
			if (houseNum == 5) {
				for (i in jobPays) {
					jobPays[i] *= 1.8;
				}
			}
			if (houseNum == 6) {
				for (i in jobPays) {
					jobPays[i] *= 2;
				}
			}
			if (houseNum == 7) {
				for (i in jobPays) {
					jobPays[i] *= 2.2;
				}
			}
			if (houseNum == 8) {
				for (i in jobPays) {
					jobPays[i] *= 2.4;
				}
			}
			if (houseNum == 9) {
				for (i in jobPays) {
					jobPays[i] *= 2.6;
				}
			}
			if (houseNum == 10) {
				for (i in jobPays) {
					jobPays[i] *= 2.8;
				}
			}
			if (houseNum == 11) {
				for (i in jobPays) {
					jobPays[i] *= 3;
				}
			}
			if (houseNum == 12) {
				for (i in jobPays) {
					jobPays[i] *= 3.2;
				}
			}
			if (houseNum == 13) {
				for (i in jobPays) {
					jobPays[i] *= 3.4;
				}
			} else {
				for (i in jobPays) {
					jobPays[i] *= 1;
				}
			}
		
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
				if (job == undefined) {
					msg.channel.send("Whoops! You didn't specify a valid job.");
					return;
				}
				if (!jobs.includes(job.toLowerCase())) {
					msg.channel.send("Whoops! You didn't specify a valid job.");
					return;
				} else {
					var curdate = Math.floor(moment() / 1000);
					setWork(userId, curdate, function(err, result) {
						if (err) {
							console.log(err);
						}
					 });
					
					if (job.toLowerCase() == "miner") {
						pay = randomInt(jobPays.minerLo, jobPays.minerHi);
						if (chance == 4) {
							msg.channel.send("You descended into the coal mines and discovered more than just coal. Your findings are worth "+pay+" Coins!");
							addMoney(userId, pay, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						} else {
							msg.channel.send("The mine collapsed before you could get much done. The boss was not too happy. No Coins today!");
						}
					} else if (job.toLowerCase() == "waiter") {
						pay = randomInt(jobPays.waiterLo, jobPays.waiterHi);
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
						pay = randomInt(jobPays.stripperLo, jobPays.stripperHi);
						if (chance == 4 || chance == 5 || chance == 1 || chance == 2) {
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
						pay = randomInt(jobPays.clownLo, jobPays.clownHi);
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
						pay = randomInt(jobPays.priestLo, jobPays.priestHi);
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
						pay = randomInt(jobPays.memerLo, jobPays.memerHI);
						people = randomInt(12, 25);
						if (chance != 1) {
							msg.channel.send("You made a meme and it went viral! Now you can reap the **"+pay+" Coins** in ad revenue.");
							addMoney(userId, pay, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						} else {
							msg.channel.send("That meme and this job was a joke. You made absolutely nothing.");
						}
					} else if (job.toLowerCase() == "chef") {
						pay = randomInt(jobPays.chefLo, jobPays.chefHi);
						if (chance != 1 || chance != 6 || chance != 3) {
							msg.channel.send("Your food is mega overpriced, but the customers love it! Who would pay **"+pay+" Coins** for food though?");
							addMoney(userId, pay, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						} else {
							msg.channel.send("Someone left the stove on, everything is gross and burned! Your customers say they're never returning.");
						}
					} else if (job.toLowerCase() == "hobo") {
						pay = randomInt(jobPays.hoboLo, jobPays.hoboHi);
						if (chance != 2) {
							msg.channel.send("You might be poor, but you made **"+pay+" Coins** from walking the streets and begging for cash.");
							addMoney(userId, pay, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						} else {
							msg.channel.send("You begged to the wrong people and got mugged in a back alley way. You lost **"+pay+" Coins**.");
							subMoney(userId, pay, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						}
					} else if (job.toLowerCase() == "cop") {
						pay = randomInt(jobPays.copLo, jobPays.copHi);
						if (chance == 6 || chance == 1) {
							msg.channel.send("You stopped the bad guys and saved the day! Here's **"+pay+" Coins** in appreciation.");
							addMoney(userId, pay, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						} else {
							msg.channel.send("Something went wrong and you got shot. A lot. You had to pay **"+pay+" Coins** to cover your medical bill.");
							subMoney(userId, pay, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						}
					}
					return;
				}
			} else if (difference <= 360) {
				msg.channel.send(":office::alarm_clock: | You have **"+timeuntil+"** hour(s) before you can work again.");
				return;
			}
		});
		});
	}
	if (msg.content.startsWith(prefix + "jobs")) {
		msg.channel.send("```\nAVAILABLE JOBS:\n-Miner\n-Cop\n-Waiter\n-Stripper\n-Chef\n-Clown\n-Priest\n-Memer\n-Hobo\n\nFORMAT: -work <job>```");
	}
	if (msg.content.startsWith(prefix + "top")) {
		var arg = msg.content.split(" ")[1];
		getTop(function(err, result) {
            if (err) {
                console.log(err);
            }
            var topMsg = "";
            
            if (arg == "2") {
				for (i = 10; i < 20; i++) {
					var userid = result.rows[i].user_id;
					var user = bot.users.get(userid);
					if (user === undefined) {
						user = "User does not exist"
					} else {
						user = user.username;
					}
					var coins = result.rows[i].money;
					var ii = i + 1;
					topMsg += "`["+ii+"]` **>"+user+"** with a total of **"+coins+" Coins.**\n";
				}
			}else {
				for (i = 0; i < 10; i++) {
					var userid = result.rows[i].user_id;
					var user = bot.users.get(userid);
					if (user === undefined) {
						user = "User does not exist"
					} else {
						user = user.username;
					}
					var coins = result.rows[i].money;
					var ii = i + 1;
					topMsg += "`["+ii+"]` **>"+user+"** with a total of **"+coins+" Coins.**\n";
				}
			}
            
            msg.channel.send("`-The Richest Users-`\n" + topMsg);
        });
	}
	if (msg.content.startsWith(prefix + "house")) {
		var bw;
		var bh;
		var bx;
		var by;
		var bgSky = "lightblue";
		var bgGround = "#48a52c";
		var bgCloud = "#f2f2f2";
		var houseNum;
		
		getHouse(userId, function(err, result) {
            if (err) {
                console.log(err);
            }
            
            houseNum = result.rows[0].house;
            
            console.log(houseNum);
            
            if (result.rows[0].house == undefined) {
				console.log("Nothing there.");
				msg.reply("Bought you some land. Type -house again to see it!");
				setHouse(userId, 0, function(err, result) {
					if (err) {
						console.log(err);
					}
				});
				return;
			}
			if (houseNum == 1) {
				bx = 65;
				by = 55;
				bw = 150;
				bh = 150;
			} else if (houseNum == 2) {
				bx = 75;
				by = 75;
				bw = 120;
				bh = 120;
			} else if (houseNum == 3) {
				bx = 65;
				by = 60;
				bw = 145;
				bh = 145;
			} else if (houseNum == 4) {
				bx = 50;
				by = 25;
				bw = 170;
				bh = 170;
			} else if (houseNum == 5) {
				bx = 50;
				by = 25;
				bw = 170;
				bh = 170;
			} else if (houseNum == 6) {
				bx = 30;
				by = 5;
				bw = 210;
				bh = 210;
			} else if (houseNum == 7) {
				bx = 30;
				by = 5;
				bw = 215;
				bh = 215;
			} else if (houseNum == 8) {
				bx = 30;
				by = 5;
				bw = 215;
				bh = 215;
			} else if (houseNum == 9) {
				bx = 40;
				by = 5;
				bw = 205;
				bh = 205;
				bgSky = "black";
				bgGround = "darkgrey";
				bgCloud = "#333333";
			} else if (houseNum == 10) {
				bx = 40;
				by = 0;
				bw = 205;
				bh = 205;
				bgSky = "black";
				bgGround = "darkgrey";
				bgCloud = "#333333";
			} else if (houseNum == 11) {
				bx = 0;
				by = 0;
				bw = 205;
				bh = 205;
				bgSky = "black";
				bgGround = "darkgrey";
				bgCloud = "#333333";
			} else if (houseNum == 12) {
				bx = 40;
				by = 0;
				bw = 205;
				bh = 205;
				bgSky = "black";
				bgGround = "darkgrey";
				bgCloud = "#333333";
			} else if (houseNum == 13) {
				bx = 40;
				by = 10;
				bw = 205;
				bh = 205;
				bgSky = "black";
				bgGround = "black";
				bgCloud = "#333333";
			}
			drawHouse();
        });
        
		function drawHouse() {
			var Image = Canvas.Image;
			var canvas = new Canvas(280, 220);
			var ctx = canvas.getContext('2d');
			var img = new Image();
			
			ctx.beginPath();
			ctx.rect(0, 0, 280, 200);
			ctx.fillStyle = bgSky;
			ctx.fill();
			//Sun
			ctx.beginPath();
			ctx.arc(5, 5, 40, 0, 2*Math.PI);
			ctx.fillStyle = "yellow";
			ctx.fill();
			//Cloud
			ctx.beginPath();
			ctx.arc(150, 70, 30, 0, 2*Math.PI);
			ctx.fillStyle = bgCloud;
			ctx.fill();
			
			ctx.beginPath();
			ctx.arc(190, 60, 40, 0, 2*Math.PI);
			ctx.fillStyle = bgCloud;
			ctx.fill();
				
			ctx.beginPath();
			ctx.arc(230, 70, 30, 0, 2*Math.PI);
			ctx.fillStyle = bgCloud;
			ctx.fill();
			//Ground
			ctx.beginPath();
			ctx.rect(0, 160, 300, 80);
			ctx.fillStyle = bgGround;
			ctx.fill();
			//Building Shadow
			/*ctx.beginPath();
			ctx.rect(200, 140, 70, 30);
			ctx.fillStyle = "#3a8c21";
			ctx.fill();*/
			
			if (houseNum != 0) {
				img.onload = function() {
					ctx.drawImage(img, bx, by, bw, bh);
				}
				img.onerror = function(err) {
					console.log(err);
				}
				img.src = fs.readFileSync(path.join(__dirname, 'houses/h'+houseNum+'.png'));
			}
			
			var houseImg = canvas.toBuffer();
			
			msg.channel.send("**"+msg.author.username+ "'s** house:", {files: [{attachment: houseImg, name: "house.png"}] });
		}
	}
	if(msg.content.startsWith(prefix + "buy")) {
		var args = msg.content.split(" ");
		var arg = args[1];
		var price;
		
		getHouse(userId, function(err, result) {
			if (err) {
				console.log(err);
			}
			if (arg == result.rows[0].house) {
				msg.reply("You've already purchased that house.");
				return;
			} else {
				buyHouse();
			}
		});
		function buyHouse() {
		if (arg == undefined || /^\d+$/.test(arg) == false) {
			msg.reply("Make sure you specify a valid house number.");
			return;
		}
		if (arg == 1) {
			price = 3000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 3000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Ooh, a Cardboard Box! Well, I guess you have to start SOMEwhere. Deducted 3,000 Coins from your balance.");
					subMoney(userId, 3000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 1, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 2) {
			price = 6000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 6000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Man, now you can *really* fit in with all those poor people. Deducted 6,000 Coins from your balance");
					subMoney(userId, 6000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 2, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 3) {
			price = 8000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 8000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Time to go live in the woods by yourself! Deducted 8,000 Coins from your balance.");
					subMoney(userId, 8000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 3, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 4) {
			price = 12000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 12000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Wow. Your first actual house. Please don't trash it. Deducted 12,000 Coins from your balance.");
					subMoney(userId, 12000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 4, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 5) {
			price = 15000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 15000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Dang, you're really moving up in the world aren't you? Deducted 15,000 Coins from your balance.");
					subMoney(userId, 15000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 5, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 6) {
			price = 18000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 18000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Man, for an expensive house this place sure is ugly. Deducted 18,000 Coins from your balance.");
					subMoney(userId, 18000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 6, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 7) {
			price = 23000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 23000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("If I didn't know any better I'd say you just bought the White House's rejected brother. Deducted 23,000 Coins from your balance.");
					subMoney(userId, 23000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 7, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 8) {
			price = 30000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 30000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("What are you doing buying an expensive house like this? Reach for the stars! Deducted 30,000 Coins from your balance.");
					subMoney(userId, 30000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 8, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 9) {
			price = 40000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 40000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("When I said \"Reach for the stars\", I didn't think you'd take it literally. Deducted 40,000 Coins from your balance.");
					subMoney(userId, 40000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 9, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 10) {
			price = 50000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 50000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Yeesh, somewhere in the universe an alien race is ***very*** angry. Deducted 50,000 Coins from your balance.");
					subMoney(userId, 50000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 10, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 11) {
			price = 65000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 65000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Congrats, you've done it. You managed to convice NASA to lend you a satellite. Are you proud? Deducted 65,000 Coins from your balance.");
					subMoney(userId, 65000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 11, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 12) {
			price = 85000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 85000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("I guess you really like space. Hopefully NASA won't notice that this one is gone from their collection, right? Deducted 85,000 Coins from your balance.");
					subMoney(userId, 85000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 12, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else if (arg == 13) {
			price = 110000;
			getMoney(userId, function(err, result) {
				if (err) {
					console.log(err);
				}
				var money = result.rows[0].money;
				if (money < 110000) {
					msg.reply("Sorry! You don't have enough money to purchase this house.");
				} else {
					msg.reply("Just when I thought a regular house was enough for you. Don't worry about the race that you enslaved to conquer this thing, they're all dead. Deducted 110,000 Coins from your balance.");
					subMoney(userId, 110000, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
					setHouse(userId, 13, function(err, result) {
						if (err) {
							console.log(err);
						}
					});
				}
			});
		} else {
			msg.reply("Make sure you specify a valid house number.");
			return;
		}
		}
	}
	if(msg.content.startsWith(prefix + "realestate")) {
		msg.channel.send("```Purchasable Houses:\n[1] Cardboard Box: 3,000 Coins\n[2] Ghetto Hut: 6,000 Coins\n[3] Log Cabin: 8,000 Coins\n[4] Brick House: 12,000 Coins\n[5] Cottage: 15,000 Coins\n[6] Federal Colonial: 18,000 Coins\n[7] Neoclassical: 23,000 Coins\n[8] Art Deco: 30,000 Coins\n[9] Space Hut: 40,000 Coins\n[10] UFO: 50,000 Coins\n[11] Satellite: 65,000 Coins\n[12] Spaceship: 85,000 Coins\n[13] Planet: 110,000 Coins\n\nTo purchase a house do -buy <number>. Where <number> is the number of the house on this list. \n\nNOTE: All purchases are non-refundable.\nIf you buy a house and then buy another one to replace it, you will have to still pay full price. Even if you've bought it before.```");
	}
	if (msg.content.startsWith(prefix + "changelog")) {
		var change = "Added -house, -buy, and -realestate commands. All three commands are still in BETA.";
		msg.channel.send("```Most recent DAN update: \n\n>" + change + "```");
	}
	if (msg.content.startsWith(prefix + "streamlist")) {
		var list = "";
		for(var i = 0; i < streamList.length; i++) {
			list += "> " + streamList[i] + "\n";
		}
		if (list === "") {
			msg.channel.send("**0** servers open in Social Stream.");
		} else {
			msg.channel.send("**"+streamList.length+"** servers open in Social Stream:\n```"+list+"```");
		}
	}
	if (msg.content.startsWith(prefix + "social")) {
		var filter = ["nigger", "nigga", "n igga", "ni gga", "nig ga", "nigg a", "n igger", "ni gger", "nig ger", "nigg er", "nigge r", "n!gga", "n!gger", "n!gg@", "n!gg3r", "nigg3r", "nigg@"];
		user = msg.author.username;
		server = msg.guild.name;
		var args = msg.content.split(" ");
		message = args[0] + args[1] + "  ";
		post = msg.content.slice(message.length);
		var newpost;
		var swearCount = 0;
		//console.log(msg.guild.ownerID);
		var msgGuild = msg.guild.id;
		var streamChnl = msg.channel.id;
		if (args[1] == "open") {
			if (msg.member.hasPermission("MANAGE_MESSAGES") == false) {
				setTimeout(function() {
						msg.delete();
					}, 3000);
					msg.channel.send("", {embed: {
						color: 14357524,
						fields: [
							{
							name: 'Social Stream Error',
							value: "Only the owner or a mod of the server can open a Social Stream"
							},
						]
					}}).then((sent) => {setTimeout(() =>{sent.delete()}, 3000)});
					return;
			}
			streamList.push(msg.guild.name);
			if (social.get(msgGuild) == undefined) {
				social.set(msgGuild, streamChnl);
				msg.channel.send("", {embed: {
					color: 16774912,
					fields: [
						{
						name: 'Social Stream',
						value: "Opened"
						},
					]
				}});
			} else {
				if (social.get(msgGuild) == msg.channel.id) {
					msg.channel.send("", {embed: {
						color: 14357524,
						fields: [
							{
							name: 'Social Stream',
							value: "is already open here"
							},
						]
					}}).then((sent) => {setTimeout(() =>{sent.delete()}, 3000)});
				} else {
					setTimeout(function() {
						msg.delete();
					}, 3000);
					var chnlId = social.get(msgGuild);
					msg.channel.send("", {embed: {
						color: 14357524,
						fields: [
							{
							name: 'Social Stream',
							value: "is open on "+msg.guild.channels.get(chnlId)
							},
						]
					}}).then((sent) => {setTimeout(() =>{sent.delete()}, 3000)});
				}
			}
		}
		if (args[1] == "send" && social.get(msgGuild) != undefined) {
			for(var i = 0; i < filter.length; i++) {
				if (post.includes(filter[i])) {
					swearCount++;
					post = post.replace(filter[i], "dude");
				} else if (swearCount === 0) {
					post = post;
				}
			}
			if (msg.channel.id != social.get(msgGuild)) {
				msg.delete();
				return;
			}
			social.forEach(function(channel, guild) {
				if (channel == msg.channel.id) {
					bot.channels.get(channel).send("", {embed: {
						color: 16774912,
						fields: [
							{
							name: 'Sent your message to Social Stream: ',
							value: "\""+post+"\""
							},
						]
					}});
				} else {
					bot.channels.get(channel).send("", {embed: {
						color: 16774912,
						fields: [
							{
							name: 'Message from Social Stream:',
							value: msg.author.username+" says \""+post+"\""
							},
						],
						footer: {
							text: 'Sent from '+msg.guild.name
						}
					}});
				}
			});
		} else if (args[1] == "send" && social.get(msgGuild) == undefined) {
			setTimeout(function() {
				msg.delete();
			}, 3000);
			msg.channel.send("", {embed: {
				color: 14357524,
				fields: [
					{
					name: 'A Social Stream has not been opened yet.',
					value: "Have the owner do \"-social open\" in a channel."
					},
				]
			}}).then((sent) => {setTimeout(() =>{sent.delete()}, 3000)});
		}
		if (args[1] == "close" && social.get(msgGuild) != undefined) {
			if (msg.author.id != msg.guild.ownerID) {
				setTimeout(function() {
						msg.delete();
					}, 3000);
					msg.channel.send("", {embed: {
						color: 14357524,
						fields: [
							{
							name: 'Social Stream Error',
							value: "Only the owner of the server can close a Social Stream"
							},
						]
					}}).then((sent) => {setTimeout(() =>{sent.delete()}, 3000)});
					return;
			}
			var index = streamList.indexOf(msg.guild.name);
			if (index > -1) {
				streamList.splice(index, 1);
			}
			social.delete(msgGuild);
			msg.channel.send("", {embed: {
				color: 12893700,
				fields: [
					{
					name: 'Social Stream',
					value: "Closed"
					},
				]
			}});
		} else if (args[1] == "close" && social.get(msgGuild) == undefined) {
			msg.channel.send("", {embed: {
				color: 12893700,
				fields: [
					{
					name: 'You have to open a Social Stream',
					value: "in order to close one"
					},
				]
			}});
		}
		if (args[1] == undefined) {
			return;
		}
	}
	/*if (msg.content.startsWith(prefix + "rob")) {
		var target = msg.mentions.users.first().id;
		if (target == undefined) {
			msg.channel.send("Make sure you define a valid target!");
			return;
		}
		if (target == msg.author.id) {
			msg.channel.send("Don't rob yourself. It's pointless.");
			return;
		}
		var youramount;
		var theiramount;
		var chance;
		var take;
		
		var user = msg.author.id;
		var curtime = moment();
		var settime = slots.get(user);
		var time;
		var nexttime;
		var timeuntil = moment(settime).diff(moment(), 'minutes');
		if (rob.get(user) == undefined || timeuntil < 0) {
			time = moment();
			nexttime = moment(time).add(10, 'minutes');
			rob.set(msg.author.id, nexttime);
		} else {
			time = rob.get(user);
			nexttime = moment(time).add(10, 'minutes');
			timeuntil = moment(nexttime).diff(moment(), 'minutes');
			timeuntil = Number(timeuntil) - 10;
			msg.channel.send(":alarm_clock: | You can't rob someone for another "+timeuntil+" minutes.").then((sent) => {setTimeout(function() {sent.delete(); msg.delete();}, 5000)});
			return;
		}
		
		getMoney(userId, function(err, result) {
			youramount = result.rows[0].money;
			if (err) {
				console.log(err);
			}
			getMoney(target, function(err, result) {
				theiramount = result.rows[0].money;
				if (err) {
					console.log(err);
				}
				robThem();
			});
		});
		
		function robThem() {
			var person = msg.mentions.users.first().username;
			if (Number(theiramount) - 50 < 0) {
				msg.channel.send("This person doesn't have enough Coins to rob them!");
			} else {
				if (youramount < theiramount) {
					chance = randomInt(1,5);
					take = randomInt(50, 150);
					if (chance == 2 || chance == 4) {
						if (Number(theiramount) - take < 0) {
							var newtheir = theiramount - theiramount;
							take = theiramount;
							msg.channel.send("You successfully robbed "+person+" of "+take+" Coins!");
							addMoney(userId, take, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
							subMoney(target, take, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						} else {
							var newtheir = theiramount - take;
							msg.channel.send("You successfully robbed "+person+" of "+take+" Coins!");
							addMoney(userId, take, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
							subMoney(target, newtheir, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						}
					} else {
						msg.channel.send("You tried to rob them of some Coins but failed horribly!");
						return;
					}
				} else if (theiramount <= youramount) {
					chance = randomInt(1,11);
					take = randomInt(1, 149);
					
					if (chance == 2 || chance == 4 || chance == 7) {
						if (Number(theiramount) - take < 0) {
							var newtheir = theiramount - theiramount;
							take = theiramount;
							msg.channel.send("You successfully robbed "+person+" of "+take+" Coins!");
							addMoney(userId, take, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
							subMoney(target, take, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						} else {
							var newtheir = theiramount - take;
							msg.channel.send("You successfully robbed "+person+" of "+take+" Coins!");
							addMoney(userId, take, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
							subMoney(target, newtheir, function(err, result) {
								if (err) {
									console.log(err);
								}
							});
						}
					} else {
						msg.channel.send("You tried to rob them of some Coins but failed horribly!");
						return;
					}
				}
			}
		}
	}*/
	if (msg.content.startsWith(prefix + "ud")) {
		var query = msg.content.split(" ")[1];
		var query1 = msg.content.slice(msg.content.indexOf(prefix+'ud') + 4);
		
		if (query1 == undefined) {
			msg.channel.send("You didn't define a valid search term.");
		} else {
			var search = urban(query1);
			search.first(function(json) {
				if (json == undefined) {
					msg.channel.send("That word can't be found! Try something else.");
				} else {
					msg.channel.send("Word: **"+query+"**\nDefinition: **"+json.definition+"**");
				}
			});
		}
	}
	if (msg.content.startsWith(prefix + "yoda")) {
		var arg = msg.content.slice(msg.content.indexOf(prefix+"yoda") + 6);
		
		if (arg == undefined) {
			msg.reply("Please specify a valid message.");
		}
		
		yoda.convert(arg,
		function(err, result) {
			if (!err) {
				msg.channel.send(result.toString());
			} else {
				console.log(err);
			}
		})
	}
	if (msg.content.startsWith(prefix + "pubg")) {
		var nick = msg.content.slice(msg.content.indexOf(prefix + "pubg") + 6);
		
		if (nick == undefined) {
			msg.reply("Make sure you specify a nickname.");
			return;
		}
		
		api.profile.byNickname(nick)
			.then((data) => {
				var stats = data["Stats"][0].Stats;
				var totalRounds = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalRounds += Number(JSON.stringify(data["Stats"][i].Stats[3].ValueInt));
				}
				var totalWins = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalWins += Number(JSON.stringify(data["Stats"][i].Stats[4].ValueInt));
				}
				var totalLosses = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalLosses += Number(JSON.stringify(data["Stats"][i].Stats[8].ValueInt));
				}
				var totalKills = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalKills += Number(JSON.stringify(data["Stats"][i].Stats[21].ValueInt));
				}
				var totalAssists = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalAssists += Number(JSON.stringify(data["Stats"][i].Stats[22].ValueInt));
				}
				var totalHeadshots = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalHeadshots += Number(JSON.stringify(data["Stats"][i].Stats[25].ValueInt));
				}
				var totalMoveDistance = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalMoveDistance += Math.floor(Number(JSON.stringify(data["Stats"][i].Stats[41].ValueDec)));
				}
				var totalWalkDistance = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalWalkDistance += Math.floor(Number(JSON.stringify(data["Stats"][i].Stats[39].ValueDec)));
				}
				var totalRideDistance = 0;
				for (var i = 0; i < data["Stats"].length; i++) {
					totalRideDistance += Math.floor(Number(JSON.stringify(data["Stats"][i].Stats[40].ValueDec)));
				}
				console.log(totalWalkDistance);
				msg.channel.send("", {embed: {
					color: 1352973,
					author: {
						name: 'PUBG stats for ' + nick + '.'
					},
					description: '--------------\n',
					fields: [
						{
						name: 'Kill Stats: ',
						value: '**Total Kills:** '+totalKills+'\n**Total Assists:** '+totalAssists+'\n**Total Headshots:** '+totalHeadshots
						},
						{
						name: 'Round Stats: ',
						inline: true,
						value: '**Total Rounds:** '+totalRounds+'\n**Total Wins:** '+totalWins+'\n**Total Losses:** '+totalLosses
						},
						{
						name: 'Movement Stats: ',
						inline: true,
						value: '**Total Distance Moved:** '+totalMoveDistance+'km\n**Total Walk Distance:** '+totalWalkDistance+'km\n**Total Ride DIstance:** '+totalRideDistance+'km'
						}
					],
					thumbnail: {
						url: data['Avatar']
					}
				}});
			})
			.catch(function(reason) {
				msg.channel.send("That profile does not exist!");
				console.log(reason);
			});
	}
	/*if (msg.content.startsWith(prefix+"store")) {
		console.log(JSON.stringify(itemData[0].setName));
		
		var items = [];
		var selected;
		var setNum;
		var colNum;
		var rarityNum;
		var item
		var rarity = ["common", "common", "common", "common", "common", "rare", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common"];
		
		var itemRarity;
		var itemCollectible;
		var itemSet;
		
		function Item(c_set, c_collectible, is_rare) {
			this.c_set = c_set;
			this.c_collectible = c_collectible;
			this.is_rare = is_rare;
		}
		
		var auctionItems = [];
		for (var i = 0; i < 6; i++) {
			setNum = randomInt(0, 4);
			colNum = randomInt(0, 10);
			rarityNum = rarity[Math.floor(Math.random() * rarity.length)];
			switch (rarityNum) {
				case 'common':
					rarityNum = 0;
					break;
				case 'rare':
					rarityNum = 1;
					break;
				default:
					rarityNum = 0;
			}
			item = setNum.toString() + colNum.toString() + rarityNum.toString();
			items.push(item);
		}
		for (var i = 0; i < items.length; i++) {
			selected = items[i].split("");
			switch (selected[0]) {
				case '0':
					itemSet = "Abstracts";
					break;
				case '1':
					itemSet = "Pixels";
					break
				case '2':
					itemSet = "Emojis";
					break;
				case '3':
					itemSet = "Wolves";
					break;
				default:
					itemSet = "Abstracts";
			}
			switch (selected[1]) {
				case '0':
					itemCollectible = 1;
					break;
				case '1':
					itemCollectible = 2;
					break;
				case '2':
					itemCollectible = 3;
					break;
				case '3':
					itemCollectible = 4;
					break;
				case '4':
					itemCollectible = 5;
					break;
				case '5':
					itemCollectible = 6;
					break;
				case '6':
					itemCollectible = 7;
					break;
				case '7':
					itemCollectible = 8;
					break;
				case '8':
					itemCollectible = 9;
					break;
				case '9':
					itemCollectible = 10;
					break;
			}
			switch (selected[2]) {
				case '0':
					itemRarity = "common";
					break;
				case '1':
					itemRarity = "rare";
					break;
			}
			auctionItems.push(new Item(itemSet, itemCollectible, itemRarity));
		}
		//console.log(auctionItems);
		//msg.channel.send("The Auction has some new Collectibles for you today.\n```"+auctionmsg+"```");
		drawScreen();
		
		function drawScreen() {
			var Image = Canvas.Image;
			var canvas = new Canvas(400, 270);
			var ctx = canvas.getContext('2d');
			var img = new Image();
			var c1 = new Image();
			var c2 = new Image();
			var c3 = new Image();
			var c4 = new Image();
			var c5 = new Image();
			var c6 = new Image();
			
			img.onload = function() {
				ctx.drawImage(img, 0, 0, 400, 270);
			}
			img.onerror = function(err) {
				console.log(err);
			}
			img.src = fs.readFileSync(path.join(__dirname, 'collectibles/onlinestore.png'));
			
			c1.onload = function() {
				ctx.drawImage(c1, 36, 48, 70, 70);
			}
			c1.onerror = function(err) {
				console.log(err);
			}
			c1.src = fs.readFileSync(path.join(__dirname, 'collectibles/'+auctionItems[0].c_set+'/'+auctionItems[0].c_collectible+'_'+auctionItems[0].is_rare+'.png'));
			
			ctx.fillStyle = "black";
			ctx.textAlign = "center";
			ctx.fillText("hi", 36, 55); 
			
			c2.onload = function() {
				ctx.drawImage(c2, 166, 48, 70, 70);
			}
			c2.onerror = function(err) {
				console.log(err);
			}
			c2.src = fs.readFileSync(path.join(__dirname, 'collectibles/'+auctionItems[1].c_set+'/'+auctionItems[1].c_collectible+'_'+auctionItems[1].is_rare+'.png'));
			
			c3.onload = function() {
				ctx.drawImage(c3, 300, 48, 70, 70);
			}
			c3.onerror = function(err) {
				console.log(err);
			}
			c3.src = fs.readFileSync(path.join(__dirname, 'collectibles/'+auctionItems[2].c_set+'/'+auctionItems[2].c_collectible+'_'+auctionItems[2].is_rare+'.png'));
			
			
			c4.onload = function() {
				ctx.drawImage(c4, 36, 160, 70, 70);
			}
			c4.onerror = function(err) {
				console.log(err);
			}
			c4.src = fs.readFileSync(path.join(__dirname, 'collectibles/'+auctionItems[3].c_set+'/'+auctionItems[0].c_collectible+'_'+auctionItems[0].is_rare+'.png'));
			
			c5.onload = function() {
				ctx.drawImage(c5, 166, 160, 70, 70);
			}
			c5.onerror = function(err) {
				console.log(err);
			}
			c5.src = fs.readFileSync(path.join(__dirname, 'collectibles/'+auctionItems[4].c_set+'/'+auctionItems[1].c_collectible+'_'+auctionItems[1].is_rare+'.png'));
			
			c6.onload = function() {
				ctx.drawImage(c6, 300, 160, 70, 70);
			}
			c6.onerror = function(err) {
				console.log(err);
			}
			c6.src = fs.readFileSync(path.join(__dirname, 'collectibles/'+auctionItems[5].c_set+'/'+auctionItems[2].c_collectible+'_'+auctionItems[2].is_rare+'.png'));
			
			var screen = canvas.toBuffer();
			
			msg.channel.send("The Online Store has new Collectibles today!", {files: [{attachment: screen, name: "danScreen.png"}] });
		}
	}
	if (msg.content.startsWith(prefix+"inventory")) {
		updateItem(userId, 2, 5, 1, 1, function(err, result) {
			if (err) {
				console.log(err);
			}
		});
	}*/
	if (msg.content.startsWith("-kc")) {
		var user = msg.content.split(" ")[1].toLowerCase();
		if (user == undefined) {
			msg.channel.send("Make sure you specify a KC username.");
			return;
		}
		var found;
		var cardCount = 0;
		var url = "https://clay.io/api/mittens/v1/users?accessToken=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJ1c2VySWQiOiJiODc1YzBlYi1iNjkxLTRhNTktYjM4MS0yZDJlZGQ0ZTQ2ODQiLCJzY29wZXMiOlsiKiJdLCJpYXQiOjE0OTE4NzUxNDEsImlzcyI6ImNsYXkiLCJzdWIiOiJiODc1YzBlYi1iNjkxLTRhNTktYjM4MS0yZDJlZGQ0ZTQ2ODQifQ.kwTlBS3u9d-pJwTyupd_XPs5VT6kZ1uhO1_8ibZ75hrIpI3096Iv2gIMukIgX4zPT5bmGoFK9PL4XjbPw2m6zw&clientVersion=1&username=";
		
		request({
			url: url+user,
			json: true
		}, function (error, response, result) {
			if (result.length == 0) {
					msg.channel.send("That user can't be found.");
					return;
				}
			if (!error && response.statusCode === 200) {
				for(var i = 0; i < result.length; i++) {
					if(result[i].username == user) {
						found = result[i];
					}
				}
				if (found.itemIds.length != 0) {
					for(var i = 0; i < found.itemIds.length; i++) {
						if (found.itemIds[i].count != 0) {
							cardCount += found.itemIds[i].count;
						}
					}
				} else {
					cardCount = 0;
				}
				if (found['dailyData'].userId == undefined) {
					msg.channel.send(`KC Data for ***${user}***:\n**Rank:** ${commas(found.rank)}\n**Gold:** ${commas(found.gold)}\n**Total Cards:** ${commas(cardCount)}\n**Total CP:** ${commas(found.weeklyCp)}`);
				} else {
					msg.channel.send(`KC Data for ***${user}***:\n**Rank:** ${commas(found.rank)}\n**Gold:** ${commas(found.gold)}\n**Total Cards:** ${commas(cardCount)}\n**Total CP:** ${commas(found.weeklyCp)}\n**Trade Link:** https://kittencards.clay.juegos/newTrade/to/${found['dailyData'].userId}`);
				}
			}
		})
	}
});

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function makeId() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 5; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
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

app.get('/ajax', function(req, res) {
    res.send({
		totalUsers: totalUserCount
	});
});

app.server.listen(process.env.PORT || 4000);
console.log('DANbot is listening on port ' + app.server.address().port + '!');

//====DATABASE FUNCTIONS====//
function updateItem(user, c_set, collectible, isRare, amount, cb) {
	query(`SELECT user_id, c_set, set_collectible, is_rare FROM items WHERE user_id = '${user}' AND c_set = '${c_set}' AND set_collectible = '${collectible}' AND is_rare = '${isRare}'`, function(err, result) {
        if (err) {
            cb(err, null);
        }
        cb(null, result);
        var hasSet = result.rows[1];
        var hasCollectible = result.rows[1];
        var isRare = result.rows[1];
        if(hasSet != undefined && hasCollectible != undefined && isRare != undefined) {
			query(`UPDATE items SET amount = '${amount}' WHERE user_id = '${user}' AND c_set = '${c_set}' AND set_collectible = '${collectible}' AND is_rare = '${isRare}'`, function(err, result) {
				if (err)
					cb(err, null);
				cb(null, result);
			});
		} else if(hasSet == undefined && hasCollectible == undefined && isRare == undefined) {
			query(`INSERT INTO items(user_id, c_set) VALUES ('${user}', '${c_set}', '${collectible}', '${isRare}', '${amount}')`, function(err, result) {
				if (err)
					cb(err, null);
				cb(null, result);
			});
		}
    });
}

function getTop(cb) {
    query(`SELECT money, user_id FROM bank ORDER BY money DESC LIMIT 25`, function(err, result) {
        if (err)
            cb(err, null);
        //console.log(result);
        cb(null, result);

    });
}

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

function getHouse(user, cb) {
    query(`SELECT house FROM bank WHERE user_id = '${user}'`, function(err, result) {
        if (err) {
            cb(err, null);
        }
        cb(null, result);
    });
}

function setHouse(user, num, cb) {
    query(`UPDATE bank SET house = '${num}' WHERE user_id = '${user}'`, function(err, result) {
        if (err)
            cb(err, null);
        //console.log(result);
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
