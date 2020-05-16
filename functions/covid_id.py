import requests
import json


def fetchUpdateStatistik():
    response = (requests.get('https://api.kawalcorona.com/indonesia/'))
    data = response.json()[0]

    return {
        "positif"   :int(data['positif'].replace(",", "")),
        "sembuh"    :int(data['sembuh'].replace(",", "")),
        "meninggal" :int(data['meninggal'].replace(",", ""))
    }

# def getTodayData():

