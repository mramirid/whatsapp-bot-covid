from flask_mysqldb import MySQL

global mysql

def init_connection(new_mysql):
    global mysql
    mysql = new_mysql

def get_nasional():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM nasional")
    data = cur.fetchall()
    cur.close()

    return data

def get_prov_byname(name):
    pass

def get_today_prov_byname(name):
    pass

def get_yesterday_prov_byname(name, mysql):
    pass