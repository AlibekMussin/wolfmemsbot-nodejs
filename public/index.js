const form = document.querySelector('#upload-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fileInput = document.querySelector('#file-input');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/upload', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const meme = await response.json();
    const memeContainer = document.querySelector('#meme-container');
    const img = document.createElement('img');
    img.src = meme.url;
    memeContainer.appendChild(img);
  } else {
    alert('Ошибка при загрузке файла');
  }
});

const acceptButton = item.querySelector('.buttons button.accept');
acceptButton.addEventListener('click', async () => {
  const response = await fetch(`/memes/${meme._id}/accept`, { method: 'POST' });
  if (response.ok) {
    item.remove();
  } else {
    console.log(response.status);
  }
});

const declineButton = item.querySelector('.buttons button.decline');
declineButton.addEventListener('click', async () => {
  const response = await fetch(`/memes/${meme._id}/decline`, { method: 'POST' });
  if (response.ok) {
    item.remove();
  } else {
    console.log(response.status);
  }
});