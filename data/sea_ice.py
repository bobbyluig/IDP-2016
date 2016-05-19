import requests
import json
import csv
from datetime import date, timedelta
from collections import OrderedDict

start = 1979
end = 2015
db = '{}.json'


def create(region):
    url = 'http://nsidc.org/data/tools/arctic-sea-ice-chart/api/daily_extents.json?year={}&&hemisphere={}'
    dictionary = {}

    for year in range(start, end + 1):
        data = requests.get(url.format(year, region))
        data = data.json()
        dictionary[str(year)] = data

        print('Completed query for {}.'.format(year))

    with open(db.format(region), 'w') as file:
        json.dump(dictionary, file)


def analyze(region):
    print('Analyzing {} data.'.format(region))

    avg = []

    with open(db.format(region), 'r') as file:
        dictionary = json.load(file)

    for year in range(start, end + 1):
        data = dictionary[str(year)]
        length = len(data)

        total = sum(doy['extent'] for doy in data)
        average = total / length

        avg.append(OrderedDict({'year': year, 'extent': average}))

    return avg


def coalesce(region):
    print('Coalescing {} data.'.format(region))

    c = []

    with open(db.format(region), 'r') as file:
        dictionary = json.load(file)

    for year in range(start, end + 1):
        start_date = date(year, 1, 1)

        for data in dictionary[str(year)]:
            doy = int(data['doy'])
            extent = data['extent']
            current_date = start_date + timedelta(doy - 1)

            c.append(OrderedDict({'date': current_date.isoformat(), 'extent': extent}))

    return c


def write_csv(iterable, filename):
    with open('{}.csv'.format(filename), 'w', newline='') as f:
        fieldnames = list(iterable[0].keys())
        writer = csv.DictWriter(f, fieldnames)

        writer.writeheader()
        writer.writerows(iterable)