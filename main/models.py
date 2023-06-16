<<<<<<< Updated upstream
from django.db import models

class Teacher(models.Model):
    name = models.CharField(max_length=80)
=======
from django.db import models

class Teacher(models.Model):
    name = models.CharField(max_length=80)
>>>>>>> Stashed changes
    age = models.IntegerField()