const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('open', () => {
  socket.send(
    JSON.stringify({
      route: 'weather',
      data: {
        lat: 51.5074,
        long: -0.1278,
      },
    }),
  );
});

socket.addEventListener('message', (event) => {
  console.log('Message from the server: ', event.data);
});

socket.addEventListener('close', () => {
  console.log('WebSocket connection closed');
});

socket.addEventListener('error', (error) => {
  console.error('WebSocket error:', error);
});
