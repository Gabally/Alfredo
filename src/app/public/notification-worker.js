self.addEventListener("push", ev => {
    const data = ev.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      image: data.image,
      vibrate: [300, 100, 400],
    });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.imgfile)
  );
});
