const axios = require('axios');
const { Telegraf } = require('telegraf')
const fs = require('fs');
const bot = new Telegraf('6053282892:AAH8rr6X0SLB5FYMYModG3UylGzVX10Ot2Q');


bot.start((ctx) => ctx.reply('Привет! Для отправки мема введите команду /send_meme'));
bot.help((ctx) => ctx.reply('Send me a message and I will reply!'))
// bot.on('message', (ctx) => ctx.reply('You said: ' + ctx.message.text))


bot.command('send_meme', (ctx) => {
    ctx.reply('Пришлите мем:');
  });
  
  bot.on('photo', (ctx) => {
    const photo = ctx.message.photo;
    const fileId = photo[photo.length - 1].file_id;
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${fileId}`;
    // сохранение картинки на сервере
    const filePath = `images/${fileId}.jpg`;

    ctx.telegram.getFileLink(fileId).then(url => {    
        axios({url, responseType: 'stream'}).then(response => {
            return new Promise((resolve, reject) => {
                response.data.pipe(fs.createWriteStream(filePath)).on('finish', () => 
                    ctx.reply('Файл сохранен')
                ).on('error', e => 
                    ctx.reply('Ошибочка вышла'))
                    });
                })
    });

  });
  
bot.launch()
