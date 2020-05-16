import requests
import json


def fetchUpdateStatistik():
    response = (requests.get('https://api.kawalcorona.com/indonesia/provinsi/'))
    provinces = []

    for provinsi in response:
        newProvinsi = {
            "kode_provinsi"     : provinsi['atributes']['Kode_Provi']
        }

        provinces = newProvinsi

    return provinces