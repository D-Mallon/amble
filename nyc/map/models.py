from django.db import models

# Create your models here.
class Route(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()

