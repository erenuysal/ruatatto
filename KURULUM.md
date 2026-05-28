# Netlify Kurulum Rehberi (ruatatto.com)

Site eski halinde kaliyorsa genelde 2 sebep vardir:
1. GitHub'a yeni kod gitmemistir
2. Netlify ortam degiskenleri eklenmemistir

## Adim 1 — GitHub'a push

Eski statik site ile yeni Next.js sitesi farkli gecmise sahip.
Bu yuzden ilk push'ta `--force` gerekebilir (sadece bir kez).

```powershell
cd C:\Users\seper\Desktop\Projeler\RuaTattoo
git push --force-with-lease origin main
```

## Adim 2 — Netlify ortam degiskenleri

Netlify → ruatatto.com → Site configuration → Environment variables

Asagidaki 4 degiskeni ekle:

| Degisken | Deger |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qzcpfuwzpbjbwuyngcpn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API Keys → **Publishable key** (tam kopyala) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API Keys → **Secret key** |
| `ADMIN_PASSWORD` | Admin panel sifren (ornek: `RuaAdmin2026!`) |

Kaydettikten sonra: **Deploys → Trigger deploy → Deploy site**

## Adim 2b — Build ayari (deploy hatasi aldiysan)

Hata: `Your publish directory cannot be the same as the base directory`

Eski statik site ayari kalmis. Next.js icin publish directory **bos** olmali.

Netlify → ruatatto.com → **Project configuration** → **Build & deploy** → **Build settings** → **Edit settings**

| Alan | Deger |
|------|-------|
| Build command | `npm run build` |
| Publish directory | **BOS BIRAK** (sil, `.` veya `/` yazma) |
| Base directory | Bos birak |

Kaydet → **Deploys → Trigger deploy → Deploy site**

`@netlify/plugin-nextjs` publish klasorunu otomatik ayarlar; elle yazma.

Deploy yine kirmizi olursa: **Deploys → Deploy settings → Clear cache and deploy site**


Supabase → Storage → `portfolio` bucket'i public olmali.
Yoksa Storage'dan olustur ve public yap.

## Adim 4 — Test

- Site: https://ruatatto.com
- Randevu: https://ruatatto.com/randevu
- Admin: https://ruatatto.com/admin

## Yerel test

`.env.local` dosyasindaki `NEXT_PUBLIC_SUPABASE_ANON_KEY` alanina
Supabase'deki **tam publishable key**'i yapistir, sonra:

```powershell
npm run dev
```
