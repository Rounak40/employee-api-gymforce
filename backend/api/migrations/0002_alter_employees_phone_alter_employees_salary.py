# Generated by Django 5.0.2 on 2024-02-12 13:26

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="employees",
            name="phone",
            field=models.CharField(max_length=10),
        ),
        migrations.AlterField(
            model_name="employees",
            name="salary",
            field=models.CharField(max_length=50),
        ),
    ]
