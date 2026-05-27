# RuaTattoo — Modern Dövmeci Web Sitesi

Melike Kipritçi için modern dövmeci portfolyo sitesi. Next.js, Supabase ve Netlify ile çalışır.

## Özellikler

- **Modern ana site** — koyu tema, mor vurgu, mobil uyumlu galeri
- **Yönetim paneli** (`/admin`) — üyelik yok, tek şifre ile giriş
- **Telefondan görsel yükleme** — Small / Medium / Big / Eserlerim kategorilerine
- **Randevu sistemi** (`/randevu`) — müsait gün/saat gösterimi, online talep
- **GitHub + Netlify** — push ile otomatik deploy

## Hızlı Başlangıç

### 1. Supabase Kurulumu

1. [supabase.com](https://supabase.com) üzerinde ücretsiz proje oluştur
2. **SQL Editor** → `supabase/schema.sql` dosyasını çalıştır
3. **Storage** → `portfolio` bucket'ının public olduğunu doğrula
4. **Settings → API** bölümünden anahtarları kopyala

### 2. Ortam Değişkenleri

`.env.example` dosyasını `.env.local` olarak kopyala ve doldur:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
```

### 3. Yerel Geliştirme

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin
- Randevu: http://localhost:3000/randevu

### 4. GitHub'a Push

```bash
git init
git add .
git commit -m "Modern RuaTattoo sitesi"
git branch -M main
git remote add origin https://github.com/KULLANICI/ruatatto.git
git push -u origin main
```

### 5. Netlify Deploy

1. [Netlify Dashboard](https://app.netlify.com) → **Add new site** → **Import from Git**
2. GitHub reposunu bağla
3. Build ayarları otomatik algılanır (`netlify.toml` mevcut)
4. **Site configuration → Environment variables** bölümüne `.env.local` değerlerini ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
5. Deploy et — `ruatatto.com` domain'in zaten Netlify'da, yeni repoya yönlendir

## Yönetim Paneli Kullanımı

`/admin` adresine git → admin şifreni gir.

| Sekme | Ne yaparsın? |
|-------|-------------|
| **Görseller** | Kategori seç, telefondan fotoğraf yükle veya sil |
| **Randevular** | Gelen talepleri onayla, iptal et veya sil |
| **Müsaitlik** | Haftalık çalışma saatleri, kapalı günler/saatler |

## Eski Görseller

Mevcut sitedeki görseller `public/images/` klasöründe. Supabase'e yükledikten sonra galeri otomatik oradan çeker. Eski statik görseller yedek/fallback olarak kalır.

Eksik görselleri eski repodan kopyala:

```
public/images/Bigs/
public/images/Dones/
public/images/Mediums/
public/images/Minimals/
public/images/hero.jpg
public/images/bio.jpg
```

## Teknik Yapı

```
src/
├── app/           # Sayfalar ve API route'ları
├── components/    # UI bileşenleri
└── lib/           # Supabase, auth, randevu mantığı
supabase/
└── schema.sql     # Veritabanı şeması
```

## İletişim Bilgileri (sitede kullanılan)

- Instagram: https://www.instagram.com/melikekipritci.ink/
- WhatsApp: +90 538 416 0167
- Konum: Kdz. Ereğli
