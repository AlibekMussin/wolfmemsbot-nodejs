const form = document.querySelector('#upload-form');

const acceptButton = item.querySelector('.buttons button.accept-button');
acceptButton.addEventListener('click', async () => {
  const button = event.target;
  const item = button.closest('.grid-item');
  console.log('accepted');
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