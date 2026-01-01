# Cloudflare Firewall Rules — Karrierin

Dokumen ini menjelaskan aturan keamanan (WAF) yang digunakan
pada integrasi Cloudflare Tunnel untuk n8n Karrierin.

---

## Rule 1 — Block Non-Allowed HTTP Methods

**Tujuan:**  
Mencegah request berbahaya dengan method selain GET & POST.

**Expression:**
not http.request.method in {"GET" "POST"}


**Action:** Block

---

## Rule 2 — Allow Only Trusted Sources (Telegram & Vercel)

**Tujuan:**  
Membatasi akses webhook hanya dari layanan terpercaya.

**Allowed Sources:**
- Telegram Bot API
- Vercel WebApp

**Expression:**


(ip.src in {149.154.160.0/20 91.108.4.0/22}
or http.user_agent contains "vercel")


**Action:** Allow

---

## Catatan Keamanan Tambahan
- Semua trafik masuk melalui Cloudflare Tunnel (tanpa expose port publik)
- Proxy Cloudflare aktif (orange cloud)
- n8n tidak dapat diakses langsung via IP

---

**Status:** Aktif & terverifikasi