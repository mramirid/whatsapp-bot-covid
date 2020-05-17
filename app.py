from flask import Flask, render_template, request, url_for, redirect
from flask_mysqldb import MySQL
from twilio.twiml.messaging_response import MessagingResponse

import json
import datetime

import functions.covid_id as covid_id
import functions.covid_prov as covid_prov
import functions.getter as getter

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'whatsapp_bot_covid'
mysql = MySQL(app)


@app.route('/')
def test():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM nasional")
    data = cur.fetchall()
    cur.close()
    # print(json.dumps(data))
    return render_template('home.html', datas=data)

    # result = covid_prov.fetchUpdateStatistik()
    # return result

# Test Dump Array
@app.route('/test')

def dump():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM nasional")
    data = cur.fetchall()
    cur.close()

    def myconverter(o):
        if isinstance(o, datetime.datetime):
            return o.__str__()

    datas = json.dumps(data, default=myconverter)

    return str(data[0]) #ganti 'datas' kalo pengen liat seluruh datanya


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


@app.route('/sms', methods=['POST'])
def sms_reply():
    """Repond to incoming calls with a simple text message"""
    # Fetch the message
    msg = request.form.get('Body')

    # Create reply
    resp = MessagingResponse()
    resp.message("You said: {}".format(msg))

    return str(resp)


# Ubah menjadi debug=False ketika akan dideploy ke hosting
if __name__ == "__main__":
    app.run(debug=True)