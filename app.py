from flask import Flask, render_template, request, url_for, redirect
from flask_mysqldb import MySQL
from twilio.twiml.messaging_response import MessagingResponse

import json
import datetime

import functions.getter as getter

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'whatsapp_bot_covid'
mysql = MySQL(app)

# init mysql connection
getter.init_connection(mysql)

@app.route('/nasional')
def test_nasional():
    data = getter.get_nasional()
    return render_template('home.html', datas=data)

@app.route('/provinsi')
def test_provinsi():
    def myconverter(o):
        if isinstance(o, datetime.datetime):
            return o.__str__()

    data = getter.get_prov_byname('jawa timur')
    datas = json.dumps(data, indent=4, sort_keys=True, default=myconverter)

    return str(datas) # ganti 'datas' kalo pengen liat seluruh datanya


@app.route('/insert')
def insert():
    connection = mysql.connection.cursor()
    dataApiNasional = covid_id.fetchUpdateStatistik()
    dataApiNasional['dalam_perawatan'] = dataApiNasional['positif'] - \
        (dataApiNasional['sembuh'] + dataApiNasional['meninggal'])

    connection.execute("INSERT INTO nasional VALUES (NULL, %s, %s, %s, %s, CURDATE(), CURDATE())", (
        dataApiNasional['positif'], dataApiNasional['sembuh'], dataApiNasional['meninggal'], dataApiNasional['dalam_perawatan']))
    mysql.connection.commit()

    return "Sukses"


@app.route('/chat', methods=['POST'])
def sms_reply():
    """Repond to incoming calls with a simple text message"""
    # Fetch the message
    msg = request.form.get('Body')
    
    resp = MessagingResponse()
    if msg == '/nasional':
        resp.message(msg)
    elif msg == '/cari':
        resp.message("prov")

    return str(resp)


# Ubah menjadi debug=False ketika akan dideploy ke hosting
if __name__ == "__main__":
    app.run(debug=True)