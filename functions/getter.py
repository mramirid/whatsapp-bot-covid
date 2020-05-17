global mysql

def init_connection(new_mysql):
    global mysql
    mysql = new_mysql

################### Nasional ###################

def get_nasional():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM nasional")
    data = cur.fetchall()
    cur.close()
    return data

def get_today_nasional():
    pass

def get_yesterday_nasional():
    pass

################### End of Nasional ###################

################### Provinsi ###################

def get_prov_byname(name):
    # Result index
    # 0: datetime, 2: kode_prov, 3: nama_prov, 
    # 4: positif, 5: sembuh, 6: perawatan, 7: meninggal
    today     = get_today_prov_byname(name)
    yesterday = get_yesterday_prov_byname(name)

    return today

def get_today_prov_byname(name):
    cur = mysql.connection.cursor()
    cur.execute('''SELECT pengambilan_provinsi.updated_at, 
                    kode_provinsi, 
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
    cur.execute('''SELECT pengambilan_provinsi.updated_at, 
                    kode_provinsi, 
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