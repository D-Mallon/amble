# Generated by Django 4.2.2 on 2023-06-17 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loadapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='records',
            name='time',
        ),
        migrations.AlterField(
            model_name='records',
            name='date',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='records',
            name='description',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='records',
            name='humidity',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='records',
            name='percipitation',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='records',
            name='temperature',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='records',
            name='wind_speed',
            field=models.IntegerField(),
        ),
    ]