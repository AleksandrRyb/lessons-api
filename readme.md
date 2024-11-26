# Инструкция по запуску проекта

## Требования к программному обеспечению

Для запуска проекта вам потребуется следующее программное обеспечение:

- Node.js (версия 14 или выше)
- npm (обычно устанавливается вместе с Node.js)
- Docker и Docker Compose (для запуска в контейнерах)
- PostgreSQL (версия 13 или выше, если запускаете без Docker)

## Порты

При запуске через Docker, следующие порты должны быть доступны:

- 3000: для веб-приложения
- 5432: для базы данных PostgreSQL

Убедитесь, что эти порты не заняты другими приложениями на вашей системе.

## Запуск проекта с использованием Docker

1. Клонируйте репозиторий проекта:
2. Убедитесь, что у вас есть файл `test.sql` с дампом базы данных в корневой директории проекта.
3. Соберите и запустите контейнеры:
4. npm run docker:build npm run start:with-db

## Запуск проекта без Docker
1. Клонируйте репозиторий проекта:
2. Установите зависимости: npm install
3. Настройте базу данных PostgreSQL:
- Создайте новую базу данных
- Импортируйте дамп из файла `test.sql`:
-
4. Создайте файл `.env` в корневой директории проекта и добавьте следующую строку, заменив значения на ваши:
5. Запустите приложение: npm start