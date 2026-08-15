# Vercel Deployment & Database Migration Guide
## Otajon Jahongirov — Full-Stack Studio Platform

Bu qo'llanma platformani **Vercel** serverless arxitekturasiga **Cloud PostgreSQL** (Supabase, Neon yoki Vercel Postgres) orqali muammosiz deploy qilish bo'yicha bosqichma-bosqich yo'riqnoma.

---

### 1. Vercel nima uchun SQLite (`file:./dev.db`) ni qo'llamaydi?
Vercel serverless (stateless) muhit hisoblanadi, ya'ni har bir API so'rovi alohida vaqtinchalik konteynerda ishlaydi va mahalliy fayllar doimiy saqlanmaydi. Shu sababli Vercel'da **PostgreSQL** bulutli ma'lumotlar bazasi ishlatiladi.

---

### 2. Bepul Cloud PostgreSQL bazasini olish (1 daqiqa)

Quyidagi bepul xizmatlardan birini tanlang (Tavsiya etiladi: **Supabase** yoki **Neon**):

#### A Variant: [Supabase](https://supabase.com) (Eng qulay)
1. Supabase.com saytiga kiring va bepul hisob oching.
2. **New Project** tugmasini bosing va loyihaga nom bering.
3. **Project Settings -> Database -> Connection string** bo'limiga o'tib, **URI (Session Pooler)** havolasini nusxalang.
   * Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

#### B Variant: [Neon.tech](https://neon.tech) (Juda tez)
1. Neon.tech saytida yangi PostgreSQL bazasini yarating.
2. Berilgan `postgresql://...` havolasini nusxalang.

---

### 3. Vercel'ga yuklash (Deploy) qilish bosqichlari

1. Kodni **GitHub** repozitoriyingizga yuklang (`git push`).
2. [Vercel.com](https://vercel.com) saytiga kiring va **"Add New Project"** tugmasini bosib, GitHub repozitoriyingizni import qiling.
3. **Environment Variables** (Muhit o'zgaruvchilari) bo'limiga quyidagilarni kiriting:

| O'zgaruvchi nomi | Qiymati | Izoh |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Supabase yoki Neon'dan olingan havola |
| `JWT_SECRET` | `otj_super_secret_jwt_key_2026_luxury_studio_a3e635_9876543210` | Autentifikatsiya kaliti |
| `ADMIN_DEFAULT_EMAIL` | `admin@otj.studio` | Admin login |
| `ADMIN_DEFAULT_PASSWORD` | `Admin@Otj2026!` | Admin parol |
| `ADMIN_DEFAULT_NAME` | `Otajon Jahongirov` | Admin ismi |
| `NEXT_PUBLIC_SITE_URL` | `https://sizning-sayt.vercel.app` | Vercel beradigan domen |

4. **Deploy** tugmasini bosing!
   * `package.json` faylidagi `postinstall: "prisma generate"` skripti Vercel'da avtomatik ishga tushadi.

---

### 4. Bazani 1 ta buyruq bilan to'ldirish (Database Seed)

Vercel'dagi bazangizga barcha loyihalar, xizmatlar, statistika va admin foydalanuvchisini yuklash uchun terminalda:

```bash
# PostgreSQL rejimiga o'tish
npm run db:postgres

# Bazaga jadvallarni yuklash
npx prisma db push

# Boshlang'ich barcha loyiha va ma'lumotlarni bazaga kiritish
npm run db:seed
```

---

### 5. Responsivlik & Gadjetlar Moslashuvchanligi

Platforma quyidagi barcha qurilmalar va ekran o'lchamlari uchun to'liq optimallashtirilgan:
* 📱 **Smartfonlar (320px — 480px)**: iPhone SE, iPhone 13/14/15/16, Samsung Galaxy, Pixel. (Kompakt paddinglar, qulay hamburger mobil menyu, tegiladigan 44px+ tugmalar).
* 📱 **Katta smartfonlar & Phabletlar (480px — 768px)**: Katta ekranli telefonlar.
* 💻 **Planshetlar (768px — 1024px)**: iPad Mini, iPad Air, iPad Pro, Android tablets (2-ustunli responsive gridlar).
* 🖥️ **Noutbuk & Desktoplar (1024px — 1920px)**: MacBook, Full HD monitorlar (Silliq glassmorph panellar, yonma-yon boshqaruv).
* 📺 **4K & Katta TV Ekranlar (2560px — 3840px+)**: Ultrawide va 4K ekranlarda maksimal kenglik chegarasi (`max-w-7xl`, `2xl:text-[84px]`) bilan matn va elementlar buzilmasdan chiroyli markazda turadi.
