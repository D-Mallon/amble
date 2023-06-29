from django.db import models

class User(models.Model):
    first_name = models.CharField("First Name", max_length=200)
    last_name = models.CharField("Last Name", max_length=200)
    email = models.EmailField()
    address = models.CharField("Address", max_length=20)
    password = models.CharField("Password",max_length=20)
    registrationDate = models.DateField("Registration Date", auto_now_add=True)

    def __str__(self):
        return self.name