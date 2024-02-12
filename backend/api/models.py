from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Employees(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    salary = models.CharField(max_length=50)
    phone = models.CharField(max_length=10)
    def __str__(self):
        return "%s %s %s" %(self.first_name, self.last_name, self.phone)
    
