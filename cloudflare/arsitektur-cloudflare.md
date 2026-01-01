# Arsitektur Cloudflare Tunnel — Karrierin

## Overview
Arsitektur ini menggantikan penggunaan Ngrok dengan
Cloudflare Tunnel untuk meningkatkan keamanan, stabilitas,
dan kesiapan produksi (production-ready).

---

## Arsitektur Lama (Ngrok)
User / Telegram / WebApp
↓
Ngrok
↓
n8n (localhost)

yaml
Salin kode

**Kekurangan:**
- URL berubah-ubah
- Kurang aman
- Tidak scalable
- Tidak cocok production

---

## Arsitektur Baru (Cloudflare Tunnel)
User / Telegram / WebApp
↓
Cloudflare DNS + WAF
↓
Cloudflare Tunnel
↓
cloudflared (local agent)
↓
n8n (localhost:5678)

yaml
Salin kode

---

## Komponen Utama
- **Cloudflare DNS**: Manajemen domain & routing
- **Cloudflare Tunnel**: Koneksi aman tanpa expose port
- **WAF (Firewall Rules)**: Proteksi HTTP request
- **n8n**: Workflow automation engine
- **WebApp (Vercel)**: Frontend client
- **Telegram Bot**: External trigger

---

## Keamanan yang Ditambahkan
- Tidak ada IP publik
- SSL otomatis
- Firewall HTTP method
- Source restriction (Telegram & Vercel)
- DDoS protection bawaan Cloudflare

---

## Endpoint Publik
- n8n UI  
  `https://n8n.karrierin.site`
- Webhook  
  `https://webhook.karrierin.site`

---

## Kesimpulan
Integrasi Cloudflare Tunnel membuat sistem Karrierin:
- Lebih aman
- Lebih stabil
- Siap untuk deployment jangka panjang