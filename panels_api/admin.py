from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from .models import panels







class panelsAdmin(LeafletGeoAdmin):
    list_display = ('nom','insee','superficie', 'surface_ut', 'production', 'prod', 'prod_class',)


admin.site.register(panels, panelsAdmin)