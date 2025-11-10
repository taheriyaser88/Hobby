# راهنمای Deploy پروژه روی VPS

این راهنما نحوه deploy کردن پروژه Hobby روی VPS را توضیح می‌دهد.

## پیش‌نیازها

- VPS با دسترسی root
- Docker و Docker Compose نصب شده روی VPS
- اتصال SSH به VPS

## نحوه استفاده

### 1. آپلود فایل deploy.sh روی VPS

```bash
# از سیستم محلی
scp deploy.sh root@YOUR_VPS_IP:/root/
```

### 2. اتصال به VPS

```bash
ssh root@YOUR_VPS_IP
```

### 3. اجرای اسکریپت

```bash
cd /root
chmod +x deploy.sh
./deploy.sh develop
```

### پارامترها

- `develop`: نام شاخه Git که می‌خواهید deploy کنید
- می‌توانید از هر شاخه‌ای استفاده کنید (مثلاً `main`، `feature/new-feature`)

## چه اتفاقی می‌افتد؟

1. **Clone/Update**: پروژه از GitHub clone یا update می‌شود
2. **Docker Compose Down**: کانتینرهای قبلی متوقف می‌شوند
3. **Nginx Config**: فایل پیکربندی Nginx ایجاد می‌شود
4. **Update Docker Compose**: docker-compose.yml برای production تنظیم می‌شود
5. **Build & Deploy**: کانتینرها build و اجرا می‌شوند
6. **Health Check**: وضعیت سرویس‌ها بررسی می‌شود

## ساختار سرویس‌ها

```
Internet
   |
   v
Port 80 -> Nginx (Reverse Proxy)
   |
   +---> Backend (localhost:8080)
   |
   +---> Frontend (localhost:81)
   |
   +---> MySQL (Internal)
   |
   +---> Redis (Internal)
```

## دستورات مفید

### مشاهده لاگ‌ها

```bash
# همه سرویس‌ها
docker-compose logs -f

# فقط backend
docker-compose logs -f backend

# فقط frontend
docker-compose logs -f frontend

# فقط nginx
docker-compose logs -f nginx
```

### متوقف کردن سرویس‌ها

```bash
cd /root/hobby
docker-compose down
```

### راه‌اندازی مجدد

```bash
cd /root/hobby
docker-compose restart
```

### حذف کامل

```bash
cd /root/hobby
docker-compose down -v  # حذف volumes هم
```

## تنظیم SSL با Certbot (آینده)

برای تنظیم SSL می‌توانید از دستورات زیر استفاده کنید:

```bash
# نصب certbot
apt install certbot python3-certbot-nginx -y

# گرفتن SSL certificate
certbot --nginx -d yourdomain.com

# آپدیت nginx.conf برای auto-renewal
certbot renew --dry-run
```

## مدیریت دیتابیس

### Backup

```bash
docker exec hobby-mysql mysqldump -u hobby_user -phobby_password hobby_db > backup.sql
```

### Restore

```bash
docker exec -i hobby-mysql mysql -u hobby_user -phobby_password hobby_db < backup.sql
```

## آدرس‌های دسترسی

- **Frontend**: `http://YOUR_VPS_IP`
- **Backend API**: `http://YOUR_VPS_IP/api/`
- **Health Check**: `http://YOUR_VPS_IP/health`

## عیب‌یابی

### بررسی وضعیت کانتینرها

```bash
docker-compose ps
docker ps -a
```

### بررسی لاگ‌های خطا

```bash
docker-compose logs --tail=100
```

### دسترسی به داخل کانتینر

```bash
# Backend
docker exec -it hobby-backend /bin/bash

# MySQL
docker exec -it hobby-mysql mysql -u root -p

# Nginx
docker exec -it hobby-nginx /bin/sh
```

## نکات مهم

1. تمام سرویس‌ها داخل Docker اجرا می‌شوند
2. Backend فقط از localhost قابل دسترسی است (جهت امنیت)
3. Frontend از پورت 81 به localhost متصل است
4. Nginx روی پورت 80 به عنوان Reverse Proxy عمل می‌کند
5. پورت 80 باید آزاد باشد
6. فایل `.env` برای متغیرهای محیطی قابل استفاده است

## پشتیبانی

در صورت بروز مشکل، لاگ‌های Docker را بررسی کنید:
```bash
cd /root/hobby
docker-compose logs
```



