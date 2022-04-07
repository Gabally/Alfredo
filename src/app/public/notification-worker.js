self.addEventListener("install", (evt) => {
  self.skipWaiting();
});

self.addEventListener("push", (ev) => {
    self.registration.update();
    const { title, body, icon, image } = ev.data.json();
      ev.waitUntil(self.registration.showNotification(title, {
        body: body,
        icon: icon,
        image: image,
        vibrate: [300, 100, 400],
      })
    );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.image)
  );
});
