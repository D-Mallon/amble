# Generated by Django 4.2.2 on 2023-07-09 17:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_userroute_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userroute',
            name='email',
        ),
    ]