import csv
import os 
from loadapp.models import Records

def run():
    file = open('C:/Users/corma/COMP47360/loaddata/scripts/2021_Weather_sql.csv')
    read_file=csv.reader(file)

    Records.objects.all().delete() #deletes any previous values in the table

    count = 1 # #Avoids headers

    for record in read_file:
        if count == 1:
            pass
        else:
            #print(record)
            # Records.objects.create(time = record[0],
            #     temperature = record[1],
            #     humidity = record[2],
            #     wind_speed = record[3],
            #     percipitation = record[4],
            #     description = record[5],
            #     date = record[6])
            
            Records.objects.create(
                time = record[0],
                temperature = record[1],
                humidity = record[2],
                wind_speed = record[3],
                percipitation = record[4],
                description = record[5],
                date = record[6])
        count += 1

