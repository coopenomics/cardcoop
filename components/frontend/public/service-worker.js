self.addEventListener('push', (event) => {
  const data = event.data.json()
  console.log('data: ', data)
  console.log('event: ', event)
  const title = data.title || 'Новое уведомление'
  const options = {
    body: data.body || 'У вас есть новое сообщение!',
    // icon: data.icon || 'default-icon.png'
  }
  console.log('self.notfi', self.registration)
  self.registration.showNotification(title, options)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('https://e39a-77-222-115-181.ngrok-free.app'))
})
