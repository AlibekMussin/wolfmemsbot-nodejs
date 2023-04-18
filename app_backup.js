const axios = require('axios');
const { Telegraf } = require('telegraf')
const fs = require('fs');
const mongoose = require('mongoose');

require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const { Schema } = mongoose;

const MemeRequestSchema = new Schema({
  image_url: {
    type: String,
    required: true
  },
  user_id: Number,  
});

const MemeRequest = mongoose.model('MemeRequest', MemeRequestSchema);
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
    userId=ctx.message.from.id;

    ctx.telegram.getFileLink(fileId).then(url => {    
        axios({url, responseType: 'stream'}).then(response => {
            const fileStream = fs.createWriteStream(filePath);
            response.data.pipe(fileStream);
            fileStream.on('finish', async () => {
              try {
                const newRequest = new MemeRequest({ image_url: filePath, user_id: userId });
                const result = await newRequest.save();
                console.log(result);
                ctx.reply('Файл сохранен');
              } catch (error) {
                console.log(error);
              }
            });
            fileStream.on('error', error => {
                console.error(error);
                ctx.reply('Ошибочка вышла');
            });
        }).catch(error => {
            console.error(error);
            ctx.reply('Ошибка при загрузке файла');
        });
    }).catch(error => {
        console.error(error);
        ctx.reply('Ошибка при получении ссылки на файл');
    });
});
  
bot.launch()
