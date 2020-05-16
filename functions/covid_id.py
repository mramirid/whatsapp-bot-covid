import requests
import json


def fetchUpdateStatistik():
    response = (requests.get('https://api.kawalcorona.com/indonesia/'))
    data = response.json()[0]
    return data