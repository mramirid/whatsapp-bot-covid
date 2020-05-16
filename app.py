from flask import Flask, render_template, request, url_for, redirect
from twilio.twiml.messaging_response import MessagingResponse
from flask_mysqldb import MySQL
import functions.covid_id as cid
import json

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'whatsapp_bot_covid'
mysql = MySQL(app)


@app.route('/')
def hello():
    # cur = mysql.connection.cursor()
    # cur.execute("SELECT * FROM nasional")
    # data = cur.fetchall()
    # cur.close()
    # return render_template('home.html', datas=data)

    result = cid.fetchUpdateStatistik()
    return str(result['positif'])

@app.route('/insert')
def insert():
    cur = mysql.connection.cursor()
    dataApiNasional = cid.fetchUpdateStatistik()
    
    dataApiNasional['dalam_perawatan'] = dataApiNasional['positif'] - (dataApiNasional['sembuh'] + dataApiNasional['meninggal'])
    cur.execute("INSERT INTO nasional VALUES (NULL, %s, %s, %s, %s, CURDATE(), CURDATE())", (dataApiNasional['positif'], dataApiNasional['sembuh'], dataApiNasional['meninggal'], dataApiNasional['dalam_perawatan']))
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


if __name__ == "__main__":
    app.run(debug=True)
