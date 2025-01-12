from rest_framework import viewsets
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import panels

class panelsSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = panels
        geo_field = 'geom'
        fields = '__all__'


 # serializers are used to convert complex data types to native python data types that can then be rendered into JSON, XML or other content types.       