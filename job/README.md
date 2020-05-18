# Cron Job

File ./request.php merupakan file cron job untuk mendapatkan data kasus covid19 dari API secara berkala lalu dicatat ke dalam database. Silahkan anda coba sendiri cara konfigurasi cron job-nya. 

> *INGAT* kalau anda pemula buat konfigurasi cron job, anda bakal dihadapkan error require. Solusinya untuk setiap file cron job, requirenya harus relatif dari direktori home cpanel:
```/home/nama_user/nama_projek/direktori_ke_file/file.php```

Kalau anda pingin jalanin manual tanpa cron job, silahkan buka saja file ./request.php ini di url browser (php web server nyalakan).