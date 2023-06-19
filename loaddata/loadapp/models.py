from django.db import models

# Create your models here.

class Records(models.Model):
    # time = models.CharField(max_length = 100)
    # temperature = models.CharField(max_length = 100)
    # humidity = models.CharField(max_length = 100)
    # wind_speed = models.CharField(max_length = 100)
    # percipitation = models.CharField(max_length = 100)
    # description = models.CharField(max_length = 100)
    # date = models.CharField(max_length = 100)

    time = models.CharField(max_length = 100,default='No value')
    temperature = models.IntegerField()
    humidity = models.IntegerField()
    wind_speed = models.IntegerField()
    percipitation = models.FloatField()
    description = models.CharField(max_length = 100)
    date = models.CharField(max_length = 100)

    def __str__(self):
        return self.date, self.time