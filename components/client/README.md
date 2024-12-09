# CoopJS
CoopJS предоставляет удобный клиент для взаимодействия с блокчейном COOPJS и контроллером MONO, поддерживающий авторизацию через токен, типизированные запросы, мутации и подписки. Этот клиент построен с использованием graphql-zeus для автоматической генерации типов и библиотеки типов блокчейн транзакций cooptypes, и объединяет в себе всё необходимое для программной работы с платформой кооперативной экономики.

## Установка
Для установки выполните:

``` bash
pnpm install @coopenomics/coopjs
```

## Быстрый старт

### Импорт и инициализация клиента
Инициализируйте клиент с параметрами URL и начальными заголовками. После инициализации вы сможете использовать Query, Mutation, и Subscription для работы с GraphQL API.

```

import { createClient } from '@coopenomics/coopjs';

// Создание клиента с URL и заголовками
const client = createClient({
  baseUrl: 'http://127.0.0.1:2998/graphql', // URL для запросов и подписок
  headers: { 'Custom-Header': 'value' },
});
```

### Установка токена авторизации
Для аутентифицированных запросов установите токен с помощью setToken.

```
client.setToken('your_jwt_token');
```

### Выполнение запросов (Query)
Вы можете выполнять запросы с помощью Query. Все запросы типизированы на основе схемы GraphQL.

```
client.Query({
  getUser: {
    id: 1,
    name: true,
    email: true,
  },
}).then(response => {
  console.log(response.getUser);
});
```

### Выполнение мутаций (Mutation)
Для отправки мутаций используйте Mutation.

```
client.Mutation({
  createUser: {
    name: 'Alice',
    email: 'alice@example.com',
    id: true,
  },
}).then(response => {
  console.log(response.createUser);
});
```

### Использование подписок (Subscription)
Для реального времени используйте Subscription.

```
const unsubscribe = client.Subscription({
  newMessage: {
    content: true,
    sender: {
      name: true,
    },
  },
}).on(data => {
  console.log('Новое сообщение:', data);
});
```

Чтобы отписаться:
```
unsubscribe();
```

### Полная API структура
createClient(options): Инициализирует клиент с базовым URL, WebSocket URL, и дополнительными заголовками.
options.baseUrl (обязательный): URL GraphQL API для запросов и мутаций.
options.wsUrl (опциональный): URL WebSocket для подписок. По умолчанию создается из baseUrl.
options.headers (опциональный): Дополнительные заголовки, применяемые ко всем запросам.
setToken(token: string): Устанавливает заголовок Authorization для всех последующих запросов.
Query: Метод для выполнения GraphQL запросов (типизированный).
Mutation: Метод для выполнения GraphQL мутаций (типизированный).
Subscription: Метод для выполнения GraphQL подписок (типизированный).
Transaction: Метод для генерации транзакций

### Пример использования
```
import { createClient } from 'coopjs';

const client = createClient({
  baseUrl: 'http://127.0.0.1:2998/graphql',
  headers: { 'Custom-Header': 'value' },
});

client.setToken('your_jwt_token');

client.Query({
  getUser: {
    id: 1,
    name: true,
    email: true,
  },
}).then(response => console.log(response.getUser));

const unsubscribe = client.Subscription({
  newMessage: {
    content: true,
    sender: {
      name: true,
    },
  },
}).on(data => console.log('Новое сообщение:', data));

unsubscribe();
```

## Лицензия
Продукт Потребительского Кооператива "ВОСХОД" распространяется по лицензии BY-NC-SA 4.0.

Разрешено делиться, копировать и распространять материал на любом носителе и форме, адаптировать, делать ремиксы, видоизменять и создавать новое, опираясь на этот материал. При использовании, Вы должны обеспечить указание авторства, предоставить ссылку, и обозначить изменения, если таковые были сделаны. Если вы перерабатываете, преобразовываете материал или берёте его за основу для производного произведения, вы должны распространять переделанные вами части материала на условиях той же лицензии, в соответствии с которой распространяется оригинал. Запрещено коммерческое использование материала. Использование в коммерческих целях – это использование, в первую очередь направленное на получение коммерческого преимущества или денежного вознаграждения.

Юридический текст лицензии: https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.ru
