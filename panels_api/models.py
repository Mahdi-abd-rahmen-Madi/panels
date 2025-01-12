from django.contrib.gis.db import models

# Create your models here.


class panels(models.Model):
    superficie = models.FloatField()
    surface_ut = models.FloatField()
    production = models.FloatField()
    insee = models.CharField(max_length=20)
    nom = models.CharField(max_length=20)
    prod = models.IntegerField()
    prod_class = models.CharField(max_length=20)  #add , null=True if value can be 0
    geom = models.PolygonField(srid=4326)



#for faster data queries
class meta: 
    indexes = [
        models.Index(fields=['geom'], name='geom_index')
    ]

def __str__(self):
    return self.name
