# salesforce-telegram

Salesforce-telegram enables you to send messages from Salesforce to Telegram using Platform events.

The code contains just the Integration layer's logic, which listens to the Salesforce EventBus using `nforce` and `faye`
and posts it on a Telegram chat via Bot API.

## Pre-deploy steps

Before deploying this on Heroku, you need to perform several tasks:

On Telegram:
- Talk to [BotFather](https://t.me/botfather) on Telegram to create a new bot
- Add the bot to your chat (search the bot in contacts &#8594; click on the header &#8594; click on add to groups)
- Get the chat_id (calling the [https://api.telegram.org/bot<BOT_TOKEN>/getUpdates](https://api.telegram.org/bot<BOT_TOKEN>/getUpdates))

On Salesforce:
- Create a Platform Event named TelegramMessage
- Create all the fields specified in the table below:


| Label         | API Name      | Type      |Possible  values |
| ------------- | ------------- |-----------|-----------------|
| Text          | Text__c       | Text(255) |-                |
| Parse mode    | ParseMode__c  | Text(8)   |Markdown, HTML   |
| Chat id       | ChatId__c     | Text(10)  |                 |
| Bot id        | BotId__c      | Text(50)  |                 |

## Dracarys!

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/baslu93/salesforce-telegram)
