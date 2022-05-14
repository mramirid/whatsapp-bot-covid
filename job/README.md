# Cron Job untuk Whatsapp Bot COVID

File [request.php](./request.php) merupakan file yang dijalankan oleh *cron job*. File tersebut berisi kode untuk mendapatkan data statistik COVID19 dari API kawalcorona secara berkala, kemudian data statistik yang diambil akan dicatat ke dalam *database*.

Kemungkinan saat anda melakukan konfigurasi *cron job* di cPanel, anda akan menemukan error require. Solusinya adalah untuk setiap file *cron job* requirenya harus relatif dari direktori home cPanel, contoh: `/home/nama_user/nama_projek/direktori_ke_file/require.php`

## Pembaharuan Data Statistik Tanpa Cron Job

Silahkan jalankan langsung file [request.php](./request.php) melalui URL di browser jika anda ingin menjalankan pembaharuan data statistik secara manual tanpa *cron job*.
