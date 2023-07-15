from django.db import models

class User(models.Model):
    first_name = models.CharField("First Name", max_length=30)
    last_name = models.CharField("Last Name", max_length=30)
    email = models.EmailField(default='missing', max_length=50)
    address = models.CharField("Address", max_length=100)
    password = models.CharField("Password",default="missing",max_length=30)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def __str__(self):
        return self.email
    
class UserRoute(models.Model):
    latitude = models.CharField("Latitude", max_length=30)
    longitude = models.CharField("Longitude", max_length=30)
    distance = models.CharField("Distance",max_length=30)

    def __str__(self):
        return self.email