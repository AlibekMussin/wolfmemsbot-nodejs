const express = require('express');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { Telegraf } = require('telegraf');

app.use('/static', express.static(__dirname + '/public'));

const memeRoutes = require('./routes/memeRoutes');

const MemeRequest = require('./models/MemeRequest');
const path = require('path');

require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to memesDB');
});

const bot = new Telegraf(process.env.BOT_TOKEN);
// console.log(process.env.BOT_TOKEN);
bot.command('auf', (ctx) => {
  ctx.reply('Вот тебе рандомный мем:');
  MemeRequest.countDocuments({ status: 'APPROVED' }).exec()
    .then((count) => {
      const random = Math.floor(Math.random() * count);
      return MemeRequest.findOne({ status: 'APPROVED' }).skip(random).exec();
    })
    .then((memeRequest) => {
      // Получаем URL картинки из объекта memeRequest
      if (memeRequest && memeRequest.status === 'APPROVED') {
        const imageUrl = 'http://localhost:3000/'+memeRequest.image_url;
        // console.log('imageUrl:',imageUrl);
        // Отправляем запрос на получение изображения по URL-адресу
        return axios.get(imageUrl, { responseType: 'arraybuffer' });
      }
      else {
        throw new Error('Не удалось найти рандомный мем. Вызовите еще раз команду /auf');
      }
    })
    .then((response) => {
      // Преобразуем полученный буфер в формат base64
      const imageData = Buffer.from(response.data).toString('base64');
      // Отправляем изображение пользователю через телеграм бота
      ctx.replyWithPhoto({ source: Buffer.from(imageData, 'base64') });
    })
    .catch((err) => {
      console.error(err);
      ctx.reply('Произошла ошибка при получении рандомного мема. Попробуйте еще раз вызвать команду /auf');
    });
});

bot.start((ctx) => {  
  ctx.reply('Приветствую.');
  ctx.reply('Чтобы получить рандомный мем, пришли команду /auf.');
  ctx.reply('Если хочешь прислать свой мем, выбери картинку с мемом на своём компьютере, а в подписи напиши /send_meme и отправь нам.');    
});


bot.on('photo', async (ctx) => {
  // console.log('test:',ctx.message);
  if (ctx.message.caption === '/send_meme') {
    const photo = ctx.message.photo;
    const fileId = photo[photo.length - 1].file_id;
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${fileId}`;
    const filePath = `images/${fileId}.jpg`;

    try {
      const newRequest = new MemeRequest({ image_url: filePath, user_id: ctx.from.id });
      const result = await newRequest.save();
      console.log(result);
      ctx.reply(`Файл сохранен. Заявка на сохранение мема принята. Её id: ${result._id} `);
    } catch (error) {
      console.log(error);
      ctx.reply('Ошибка при сохранении файла');
    }

    ctx.telegram
      .getFileLink(fileId)
      .then((url) => {
        axios({ url, responseType: 'stream' }).then((response) => {
          const fileStream = fs.createWriteStream(filePath);
          response.data.pipe(fileStream);
          fileStream.on('finish', () => {
            console.log('File saved');
          });
          fileStream.on('error', (error) => {
            console.error(error);
          });
        });
      })
      .catch((error) => {
        console.error(error);
        ctx.reply('Ошибка при загрузке файла');
      });
  }
  else {
    // Если это не команда "send_meme", отправляем сообщение о том, что фото не было сохранено
    ctx.reply('Это фото не было сохранено. Чтобы сохранить фото, отправьте команду /send_meme в сообщении с фото.');
  }
});

app.use('/app', memeRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')));


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

bot.launch();