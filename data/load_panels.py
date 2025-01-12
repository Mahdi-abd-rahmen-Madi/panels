import os 
from django.contrib.gis.utils import LayerMapping
from django.contrib.gis.gdal import DataSource
from panels_api.models import panels

panels_mapping = {
    'superficie': 'superficie',
    'surface_ut': 'surface_ut',
    'production': 'production',
    'insee': 'insee',
    'nom': 'nom',
    'prod': 'prod',
    'prod_class': 'prod_class',
    'geom': 'POLYGON',
}

def import_data(verbose=True):
    file= os.getcwd() + '/data/France.gpkg'
    data_source = DataSource(file)
    panels_layer = data_source[0].name

    panels_layer_mapping = LayerMapping(
        panels, file, panels_mapping, layer= panels_layer,
    )   
    panels_layer_mapping.save(strict=True, verbose=verbose)