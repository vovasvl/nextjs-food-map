# Вступительное задание на позицию фронтенд-разработчика
![Image](https://github.com/user-attachments/assets/d9c5d7c9-2679-445a-97f9-9d6428a7f69f)

## Описание приложения
Food Map App - это интерактивное приложение для визуализации данных о заведениях общественного питания Москвы на карте. Приложение использует данные из API открытого портала данных Москвы и предоставляет пользователям возможность исследовать и фильтровать заведения по различным параметрам.

- 🎨 [Макет в Figma](https://www.figma.com/design/3Tkqh53l3bOmyOPK8SnPE4/Food-Map?node-id=0-1&t=aSJQE0jXSXVYGHaA-1)
- 🚀 [Деплой приложения](https://nextjs-food-map.vercel.app/)

## Стек технологий
- Next.js
- React-Leaflet
- Supercluster
- TypeScript
- Tailwind CSS
- Shadcn UI
  
## Как запустить приложение
Зарегистрируйтесь на [apidata.mos.ru](https://apidata.mos.ru) и получите API ключ.

### Настройка окружения 
Создайте файл `.env` в корне проекта и добавьте туда API ключ:

```API_KEY=your_api_key_here```

### Запуск приложения 
Для запуска необходимо скачать все зависимости и запустить сервер следующими командами:

```npm install```

```npm run dev```

После чего сайт будет доступен по ссылке http://localhost:3000

## Структура проекта
```
.
├── public/
│   └── статические файлы приложения
└── src/
    ├── app/
    │   ├── api/
    │   │   └── restaurants/
    │   │       └── route.ts - API-роут для работы с ресторанами
    │   ├── globals.css - глобальные стили
    │   ├── layout.tsx - основной лейаут приложения
    │   └── page.tsx - главная страница приложения
    ├── components/
    │   ├── ClusteredMarkers/
    │   │   └── index.tsx - компонент для кластеризации маркеров на карте
    │   ├── DynamicMap/
    │   │   └── index.tsx - динамический компонент карты
    │   ├── Map/
    │   │   └── index.tsx - основной компонент карты
    │   ├── MapFilterPanel/
    │   │   └── index.tsx - выдвижная панель фильтров для карты
    │   ├── RestaurantInfoPopover/
    │   │   └── index.tsx - компонент попапа с информацией о ресторане
    │   └── ...
    ├── contexts/
    │   ├── FilterPanelContext.tsx - контекст для управления состоянием панели фильтров
    │   └── MapMarkersContext.tsx - контекст для управления маркерами на карте
    ├── hooks/
    │   └── Здесь лежат кастомные хуки
    ├── lib/
    │   ├── fetchRestaurants.ts - клиент запрос к API для получения данных о ресторанах
    │   └── utils.ts - вспомогательные утилиты
    ├── providers/
    │   └── ClientSidebarProvider.tsx - провайдер для управления состоянием сайдбара (open/collapsed)
    ├── types/
    │   └── index.d.ts - типы TypeScript для проекта
 
```

