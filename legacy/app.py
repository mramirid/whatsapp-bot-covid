from flask import Flask, render_template, request, url_for, redirect
from flask_mysqldb import MySQL
from twilio.twiml.messaging_response import MessagingResponse
from datetime import datetime

import functions.getter as getter
import json

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'whatsapp_bot_covid'
mysql = MySQL(app)

# init mysql connection
getter.init_connection(mysql)


@app.route('/')
def base():
    return 'LANJUTKAN'


def myconverter(o):
    if isinstance(o, datetime):
        return o.__str__()


@app.route('/nasional')
def test_nasional():
    data = getter.get_nasional()
    datas = json.dumps(data, indent=4, sort_keys=True, default=myconverter)
    return str(datas)


@app.route('/provinsi')
def test_provinsi():
    data = getter.get_prov_byname('jawa timur')
    datas = json.dumps(data, indent=4, sort_keys=True, default=myconverter)
    return str(datas)


@app.route('/chat', methods=['POST'])
def sms_reply():
    # Ambil pesan dari chat
    message = request.form.get('Body').lower().strip()

    # Jika pesan bukan command, abaikan
    if message[0] != '/':
        return

    response = ''
    chat_response = MessagingResponse()
    words = message.split()

    if words[0] == '/halo':
        response = "Halo juga\n\n"
        response += "Saya adalah bot yang didesain untuk memberikan info kasus COVID-19 baik secara nasional maupun berdasarkan provinsi.\n"
        response += "Sumber data didapatkan dari API yang disediakan oleh kawalcorona - https://kawalcorona.com/api/\n"
        response += "Ketikkan '/help' untuk mendapatkan informasi mengenai fitur yang diprogram untuk saya\n\n"
    elif words[0] == '/nasional':
        response = getter.get_nasional()
    elif words[0] == '/cari':
        if len(words) > 1:
            nama_prov = ' '.join(words[1:])
            result = getter.get_prov_byname(nama_prov)
            response = result if result else 'Provinsi tidak ditemukan'
        else:
            response += 'Pastikan anda sudah memasukan nama provinsi'
    elif words[0] == '/help':
        response = 'List command:\n\n'
        response += '1. /halo -> Perkenalan bot\n'
        response += '2. /nasional -> Kasus COVID-19 di Indonesia\n'
        response += '3. /cari [nama_provinsi] -> Mencari kasus COVID-19 berdasarkan provinsi\n'
        response += 'Misal: /cari jawa timur\n\n'
        response += 'Versi 1.0 - 17/05/2020 20.00'
    else:
        response = 'Maaf perintah tidak dikenali, ketik /help untuk mengetahui fitur'

    chat_response.message(response)

    return str(chat_response)


# Ubah menjadi debug=False ketika akan dideploy ke hosting
if __name__ == "__main__":
    app.run(debug=True)
