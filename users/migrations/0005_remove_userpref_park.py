# Generated by Django 4.0.10 on 2023-07-20 12:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_userpref_park'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userpref',
            name='park',
        ),
    ]