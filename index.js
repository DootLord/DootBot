// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const request = require("xhr-request");

const scryfallAPIURL = "https://api.scryfall.com/cards/";
const randomURL = "random?q=is%3Afunny+lang%3Aen+order%3Aedhrec&unique=cards&as=grid&order=random";
const sidURL = "https://i.imgur.com/zLZer7q.png";
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, "MessageContent", "GuildMessages"] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (message) => {

    // Non-generic commands
    switch(message.content.toLowerCase()) {
        case 'hey Doot Bot!':
            message.reply("FUCK YOU " + message.author.username + "!");
            break;
        case 'give me a random card!':
        case '!!random':
            const imageData = await getRandomImage();
            message.reply(imageData.image_uris.normal);
            break;
        case "show me sid!":
            message.reply(sidURL);
            break;
        case "Vote for this card by reacting with :thumbsup: or :thumbsdown:":
            addVoteEmojis(message)
            break;
    }

    // Display / Vote Commands
    if(message.content.startsWith("!!")) {
        if(message.content.startsWith("!!!")) {
            handleCardVote(message.content.substring(3), message);
            return;
        }
        const imageData = await getImage(message.content.substring(2));
        console.log(imageData);

        if(imageData.status === 404) {
            message.reply("I got no idea what that card is bruh");
            return;
        }

        message.reply(imageData.image_uris.normal);
    }
});


function addVoteEmojis(message) {
    message.react("👍");
    message.react("👎");
}

async function handleCardVote(cardName, message) {
    const imageData = await getImage(cardName);

    message.reply(imageData.image_uris.normal);
    message.reply("Vote for this card by reacting with :thumbsup: or :thumbsdown:");

}

async function getRandomImage() {
    return new Promise((resolve, rej) => {
        request(scryfallAPIURL + randomURL, {
        
        }, function(err, data) {
            if (err) throw err
    
            resolve( JSON.parse(data));
        });
    });
}

async function getImage(cardName) {
    let escapedCardName = cardName.replace(/['"’]+/g, '');

    console.log("CaRDNAME: ",  escapedCardName);
    const url = scryfallAPIURL + "named?exact=" + escapedCardName;
    return new Promise((resolve, reject) => {
        request(url, {}, function(err, data) {
            if (err) throw err
    
            resolve(JSON.parse(data));
        });
    });
} 
// Log in to Discord with your client's token
client.login(token);

