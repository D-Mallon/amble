# Generated by Django 4.2.2 on 2023-07-09 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_userroute_hour'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='id',
        ),
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(default='missing', max_length=50, primary_key=True, serialize=False),
        ),
    ]
