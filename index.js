// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const request = require("xhr-request");

const scryfallAPIURL = "https://api.scryfall.com/cards/";
const randomURL = "random?q=is%3Afunny+lang%3Aen+order%3Aedhrec&unique=cards&as=grid&order=random";
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, "MessageContent", "GuildMessages"] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.content === 'Hey Doot Bot!'){
        message.reply("FUCK YOU " + message.author.username + "!");
    }
    
    if (message.content === 'Give me a random card!'){
        const imageData = await getRandomImage();
        message.reply(imageData.image_uris.normal);
    }

    if(message.content.startsWith("!!")) {
        const imageData = await getImage(message.content.substring(2));
        console.log(imageData);
        message.reply(imageData.image_uris.normal);
    }
});

async function getRandomImage() {
    return new Promise((resolve, rej) => {
        request(scryfallAPIURL + randomURL, {
        
        }, function(err, data) {
            if (err) throw err
    
            resolve( JSON.parse(data));
        });
    });
}

async function getImage(imageName) {
    const url = scryfallAPIURL + "named?exact=" + imageName;
    console.log(url);
    console.log("Searching for:", imageName);
    return new Promise((resolve, reject) => {
        request(url, {
        
        }, function(err, data) {
            if (err) throw err
    
            resolve( JSON.parse(data));
        });
    });
} 
// Log in to Discord with your client's token
client.login(token);

