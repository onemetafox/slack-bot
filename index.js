const SlackBot = require('slackbots');
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()
const time_space = 10000;
const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name: 'Whale Bot'
})

// Start Handler

const params = {};

params.min_value = 500000;
params.currency = "btc";
params.api_key = process.env.API_KEY;
params.transaction_type = "transfer";

bot.on('start', () => {
    setInterval(()=>{
        params.start = Math.floor(Date.now() / 1000) - 3600;
        params.end = params.start + time_space
        axios.get('https://api.whale-alert.io/v1/transactions', {params})
        .then(res => {
            const transactions = res.data.transactions;
            transactions.forEach(transaction => {
                const filter = {
                    icon_emoji: ':robot_face:'
                }
                bot.postMessageToChannel(
                    'random',
                    transaction.amount + " #BTC ("+transaction.amount_usd+"USD)  transferred \n from <https://blockchair.com/bitcoin/address/"+transaction.from.address+"|"+transaction.from.address+"> \n to <https://blockchair.com/bitcoin/address/"+transaction.to.address+"|"+transaction.to.address+"> \n <https://blockchair.com/bitcoin/transaction/"+transaction.hash+"| transaction>"  ,
                    filter
                );
                return;
            });
        })
    }, 50000)
    
})
