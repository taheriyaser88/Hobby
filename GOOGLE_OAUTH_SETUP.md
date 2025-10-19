# راهنمای تنظیم Google OAuth

برای فعال کردن Google OAuth در پروژه، مراحل زیر را دنبال کنید:

## 1. ایجاد Google OAuth Credentials

1. به [Google Cloud Console](https://console.cloud.google.com/) بروید
2. یک پروژه جدید ایجاد کنید یا پروژه موجود را انتخاب کنید
3. به بخش "APIs & Services" > "Credentials" بروید
4. روی "Create Credentials" کلیک کنید و "OAuth client ID" را انتخاب کنید
5. Application type را "Web application" انتخاب کنید
6. Authorized redirect URIs را اضافه کنید:
   - `http://localhost:8080/login/oauth2/code/google`

## 2. تنظیم Backend

در فایل `hobby-backend/src/main/resources/application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_ACTUAL_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_ACTUAL_CLIENT_SECRET
```

## 3. تنظیم Frontend (اختیاری)

در فایل `hobby-frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  googleClientId: 'YOUR_ACTUAL_CLIENT_ID'
};
```

## 4. تست کردن

1. Backend را اجرا کنید: `mvn spring-boot:run`
2. Frontend را اجرا کنید: `ng serve`
3. به `http://localhost:4200/login` بروید
4. روی "Continue with Google" کلیک کنید

## نکات مهم

- مطمئن شوید که redirect URI دقیقاً `http://localhost:8080/login/oauth2/code/google` باشد
- Client ID و Client Secret را در فایل‌های environment قرار دهید
- برای production، URLs را به domain اصلی تغییر دهید
