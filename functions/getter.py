global mysql


def init_connection(new_mysql):
    global mysql
    mysql = new_mysql

################### Nasional ###################


def get_nasional():
    today = get_today_nasional()
    yesterday = get_yesterday_nasional()

    # Memgambil index array agar saat pemanggilan variabel mudah, tidak today[0] dst
    if len(today) > 1:
        positif = 1
        sembuh = 2
        meninggal = 3
        dalam_perawatan = 4
        datetime = 6
    
        # Penambahan masing2 kasus positif, sembuh & meninggal dari kemarin
        selisih_positif = today[positif] - yesterday[positif]
        selisih_sembuh = today[sembuh] - yesterday[sembuh]
        selisih_meninggal = today[meninggal] - yesterday[meninggal]
        selisih_perawatan = today[perawatan] - yesterday[perawatan]

        # Selisih total kasus dari kemarin
        total_yesterday = yesterday[positif] + yesterday[sembuh] + yesterday[meninggal]
        total_today = today[positif] + today[sembuh] + today[meninggal]
        selisih_total = total_today - total_yesterday

        message = ''

        if selisih_total > 0:
            message += 'Statistik kasus di {}\n\n'.format(today[nama_provinsi])  
            message += '- Positif: {} (+{})\n'.format(today[positif], abs(selisih_positif))
            message += '- Sembuh: {} (+{})\n'.format(today[sembuh], abs(selisih_sembuh))
            message += '- Meninggal: {} (+{})\n'.format(today[meninggal], abs(selisih_meninggal))
            message += '- Dalam perawatan: {} (+{})\n\n'.format(today[perawatan], abs(selisih_perawatan))
        else:
            message += 'Statistik kasus di {}\n\n'.format(today[nama_provinsi])  
            message += '- Positif: {}\n'.format(today[positif])
            message += '- Sembuh: {}\n'.format(today[sembuh])
            message += '- Meninggal: {}\n'.format(today[meninggal])
            message += '- Dalam perawatan: {}\n\n'.format(today[perawatan])

        message += 'Tetap jaga kesehatan dan apabila memungkinkan #DirumahAja\n\n'
        message += 'Pembaruan terakhir pada {}'.format(today[datetime])
    else:
        return False
    
    return message




def get_today_nasional():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM nasional WHERE DATE(created_at) = CURDATE()")
    data = cur.fetchall()
    cur.close()
    return data


def get_yesterday_nasional():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM nasional WHERE DATE(created_at) = CURDATE()-1")
    data = cur.fetchall()
    cur.close()
    return data


################### End of Nasional ###################


################### Provinsi ###################


def get_prov_byname(name):
    today = get_today_prov_byname(name)
    yesterday = get_yesterday_prov_byname(name)

    if len(today) > 0:
        # Index, mempermudah saja
        datetime = 0
        nama_provinsi = 1
        positif = 2
        sembuh = 3
        perawatan = 4
        meninggal = 5

        # Penambahan masing2 kasus positif, sembuh & meninggal dari kemarin
        selisih_positif = today[positif] - yesterday[positif]
        selisih_sembuh = today[sembuh] - yesterday[sembuh]
        selisih_meninggal = today[meninggal] - yesterday[meninggal]
        selisih_perawatan = today[perawatan] - yesterday[perawatan]

        # Selisih total kasus dari kemarin
        total_yesterday = yesterday[positif] + yesterday[sembuh] + yesterday[meninggal]
        total_today = today[positif] + today[sembuh] + today[meninggal]
        selisih_total = total_today - total_yesterday

        message = ''

        if selisih_total > 0:
            message += 'Statistik kasus di {}\n\n'.format(today[nama_provinsi])  
            message += '- Positif: {} (+{})\n'.format(today[positif], abs(selisih_positif))
            message += '- Sembuh: {} (+{})\n'.format(today[sembuh], abs(selisih_sembuh))
            message += '- Meninggal: {} (+{})\n'.format(today[meninggal], abs(selisih_meninggal))
            message += '- Dalam perawatan: {} (+{})\n\n'.format(today[perawatan], abs(selisih_perawatan))
        else:
            message += 'Statistik kasus di {}\n\n'.format(today[nama_provinsi])  
            message += '- Positif: {}\n'.format(today[positif])
            message += '- Sembuh: {}\n'.format(today[sembuh])
            message += '- Meninggal: {}\n'.format(today[meninggal])
            message += '- Dalam perawatan: {}\n\n'.format(today[perawatan])

        message += 'Tetap jaga kesehatan dan apabila memungkinkan #DirumahAja\n\n'
        message += 'Pembaruan terakhir pada {}'.format(today[datetime])
    else:
        return False

    return message


def get_today_prov_byname(name):
    cur = mysql.connection.cursor()
    cur.execute('''SELECT 
                    pengambilan_provinsi.updated_at, 
                    nama_provinsi, 
                    positif, 
                    sembuh, 
                    dalam_perawatan, 
                    meninggal 
                FROM pengambilan_provinsi 
                LEFT JOIN detail_pengambilan_provinsi 
                ON pengambilan_provinsi.id = detail_pengambilan_provinsi.id_pengambilan_provinsi 
                WHERE DATE(pengambilan_provinsi.created_at) = CURDATE() AND nama_provinsi LIKE '%{}%\''''.format(name))
    data = cur.fetchone()
    cur.close()
    return data


def get_yesterday_prov_byname(name):
    cur = mysql.connection.cursor()
    cur.execute('''SELECT 
                    pengambilan_provinsi.updated_at, 
                    nama_provinsi, 
                    positif, 
                    sembuh, 
                    dalam_perawatan, 
                    meninggal 
                FROM pengambilan_provinsi 
                LEFT JOIN detail_pengambilan_provinsi 
                ON pengambilan_provinsi.id = detail_pengambilan_provinsi.id_pengambilan_provinsi 
                WHERE DATE(pengambilan_provinsi.created_at) = CURDATE()-1 AND nama_provinsi LIKE '%{}%\''''.format(name))
    data = cur.fetchone()
    cur.close()
    return data


################### End of Provinsi ###################
