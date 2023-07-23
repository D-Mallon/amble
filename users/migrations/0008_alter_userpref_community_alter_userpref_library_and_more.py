# Generated by Django 4.0.10 on 2023-07-20 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_userpref_community_alter_userpref_library_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userpref',
            name='community',
            field=models.CharField(max_length=300, null=True, verbose_name='Community Centres'),
        ),
        migrations.AlterField(
            model_name='userpref',
            name='library',
            field=models.CharField(max_length=300, null=True, verbose_name='Libraries'),
        ),
        migrations.AlterField(
            model_name='userpref',
            name='museum',
            field=models.CharField(max_length=300, null=True, verbose_name='Museums & Art Galleries'),
        ),
        migrations.AlterField(
            model_name='userpref',
            name='park',
            field=models.CharField(max_length=300, null=True, verbose_name='Parks'),
        ),
        migrations.AlterField(
            model_name='userpref',
            name='park_node',
            field=models.CharField(max_length=300, null=True, verbose_name='Other Park Nodes'),
        ),
        migrations.AlterField(
            model_name='userpref',
            name='walking_node',
            field=models.CharField(max_length=300, null=True, verbose_name='Other Walking Nodes'),
        ),
        migrations.AlterField(
            model_name='userpref',
            name='worship',
            field=models.CharField(max_length=300, null=True, verbose_name='Places of Worship'),
        ),
    ]
