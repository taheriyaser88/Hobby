# Event Manager UI

این پروژه، یک اپلیکیشن Angular است که از روی صفحات HTML تبدیل شده است.

## ویژگی‌ها

- صفحه لندینگ
- صفحه ورود/ثبت‌نام
- داشبورد
- مدیریت رویدادها (لیست و جزئیات)
- مدیریت تسک‌ها با Kanban
- آنالیتیکس با Chart.js
- اتصال به Google Calendar

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js (نسخه 16 یا بالاتر)
- npm یا yarn

### نصب

ابتدا وابستگی‌ها را نصب کنید:

```bash
npm install
```

### اجرا

برای اجرای پروژه در حالت development:

```bash
npm start
# یا
ng serve
```

سپس به آدرس http://localhost:4200 بروید.

اگر می‌خواهید روی پورت دیگری اجرا کنید:

```bash
ng serve --port 4201
```

## Build

برای ساخت نسخه production:

```bash
npm run build
```

خروجی در پوشه `dist/event-manager-ui` قرار می‌گیرد.

## ساختار پروژه

```
src/
├── app/
│   ├── components/
│   │   ├── landing/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── events/
│   │   └── event-detail/
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app-routing.module.ts
└── styles.css
```

## نکات

- این پروژه از Angular 17 استفاده می‌کند
- فونت Vazirmatn برای نمایش فارسی
- Chart.js برای نمودارها
- تمام UIهای اصلی بدون تغییر از HTML های اولیه منتقل شده

## مسیرها

- `/` - صفحه اصلی (Landing)
- `/login` - ورود/ثبت‌نام
- `/dashboard` - داشبورد
- `/events` - لیست رویدادها
- `/events/:id` - جزئیات رویداد

## نسخه

Version 1.0.0

