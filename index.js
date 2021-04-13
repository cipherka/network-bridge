const { telegram, mastodon } = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const Mastodon = require('mastodon-api');

const bot = new TelegramBot(telegram.token, { polling: true });
const M = new Mastodon(mastodon.client);

const listener = M.stream('streaming/user');    
listener.on('message', message => {
    if(message.event == 'notification' && mastodon.acct.includes(message.data.account.acct))
        return bot.sendMessage(telegram.chatID, `Mastodon [${message.data.account.display_name}] -> ${message.data.status.content.replace(/<([^>]+)>/ig, '')}\n${message.data.status.url}`);
});

listener.on('error', err => console.log(err));
listener.on('heartbeat', heartbeat => console.log(heartbeat));