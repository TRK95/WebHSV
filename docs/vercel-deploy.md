# Deploy demo len Vercel

Repo nay co 3 app rieng:

- `Web`: Next.js public site, co the deploy len Vercel.
- `CMS`: React/Webpack admin site, co the deploy len Vercel nhu static frontend.
- `Server`: Express API, khong phai Next/Vercel app hien tai. Nen host rieng bang Render/Railway/Fly.io hoac chuyen sang serverless truoc khi dua len Vercel.

## 1. Web tren Vercel

Tao project Vercel tu GitHub repo va chon:

- Root Directory: `Web`
- Build Command: `npm run build`
- Output: de Vercel tu nhan dien Next.js

Environment variables:

```env
NEXT_PUBLIC_ENDPOINT=https://<backend-url>
NEXT_PUBLIC_API_ENDPOINT=https://<backend-url>
NEXT_PUBLIC_API_ENDPOINT_UPLOAD=https://<backend-url>
NEXT_PUBLIC_TOKEN=dev-token
NEXT_PUBLIC_SAMESITE=false
NEXT_PUBLIC_APP_NAME=WebHSV
NEXT_PUBLIC_MODE=light-mode
```

## 2. CMS tren Vercel

Tao project Vercel thu hai va chon:

- Root Directory: `CMS`
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variables:

```env
API_ENDPOINT=https://<backend-url>
API_ENDPOINT_UPLOAD=https://<backend-url>
API_ENDPOINT_REDIRECT=https://<web-vercel-url>
TOKEN=dev-token
PATH_NAME=/
NODE_OPTIONS=--openssl-legacy-provider
```

## 3. Backend

Backend dang doc Mongo Atlas qua `Server/.env.development` local. Khi host backend, dat cac bien tu `Server/.env.example`.

Google Cloud Storage hien chua cau hinh vi bucket chua tao duoc. Cac API upload len Cloud Storage se can bo sung cac bien `GCLOUD_STORAGE_*` sau khi billing/bucket san sang.

Luu y: dependency MongoDB cua backend kha cu. Tren may local hien tai, `mongodb+srv://...` bi loi voi Node moi, nen dang dung single-host `mongodb://...` de demo. Khi deploy backend lau dai, nen nang `mongoose/mongodb` hoac chay bang Node LTS cu hon phu hop voi project.
