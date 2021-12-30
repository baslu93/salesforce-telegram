let nforce = require('nforce');
let faye = require('faye');
let request = require('request');

// Subscribe to Platform Events
let subscribeToPlatformEvents = () => {
    var client = new faye.Client(org.oauth.instance_url + '/cometd/52.0/');
    client.setHeader('Authorization', 'OAuth ' + org.oauth.access_token);
    var subscription = client.subscribe('/event/TelegramMessage__e', function (message) {
        console.log('[EVENT RECEIVED]');
        request.post(
            {
                url: 'https://api.telegram.org/bot' + message.payload.BotId__c + '/sendMessage',
                formData: {
                    chat_id: message.payload.ChatId__c,
                    parse_mode: message.payload.ParseMode__c,
                    text: message.payload.Text__c
                }
            },
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log('[MESSAGE DELIVERED]');
                    console.log(body);
                } else {
                    console.error('[TELEGRAM CALLOUT FAILED]');
                }
            }
        );
    });

    subscription.callback(function(){
        console.log('[SUBSCRIBE SUCCEEDED]');
    });

    subscription.errback(function(error){
        console.error('[SUBSCRIBE FAILED]', error);
    });

    client.on('transport:down', function () {
        console.error('[CONNECTION DOWN]');
    });
};

// Connect to Salesforce
let SF_CLIENT_ID = process.env.SF_CLIENT_ID;
let SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET;
let SF_USER_NAME = process.env.SF_USER_NAME;
let SF_USER_PASSWORD = process.env.SF_USER_PASSWORD;
let SF_ENVIRONMENT = process.env.SF_ENVIRONMENT || 'sandbox'; // default to sandbox if env variable not set

let org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    environment: SF_ENVIRONMENT,
    redirectUri: 'http://localhost:3000/oauth/_callback',
    mode: 'single',
    autoRefresh: true
});

org.authenticate({ username: SF_USER_NAME, password: SF_USER_PASSWORD }, err => {
    if (err) {
        console.error('[AUTH ERROR]');
        console.error(err);
    } else {
        console.log('[AUTH OK]');
        console.log(org.oauth.instance_url);
        subscribeToPlatformEvents();
    }
});