Django project that loads data into PostgreSQL


Key things to note:

Add
1. In 'settings.py'
'loadapp',
'django_extensions',

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'Weather',
        'USER': 'postgres',
        'PASSWORD': 'weather1234',
        'HOST': 'localhost'
    }
}

2. In models.py create a class called Records

  time = models.CharField(max_length = 100,default='No value')
    temperature = models.IntegerField()
    humidity = models.IntegerField()
    wind_speed = models.IntegerField()
    percipitation = models.FloatField()
    description = models.CharField(max_length = 100)
    date = models.CharField(max_length = 100)

    def __str__(self):
        return self.date, self.time

3. Create a load.py file withpath to the data file and some other stuff

 file = open('C:/Users/corma/COMP47360/loaddata/scripts/2021_Weather_sql.csv')

4. You'll need to run some command line instructions

python manage.py makemigrations loadapp
python manage.py migrate
ython manage.py runscript load