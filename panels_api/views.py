#from django.shortcuts import render

# Create your views here.

#viewsets are used to define the view behavior.

from rest_framework import viewsets
from .models import panels
from .serializers import panelsSerializer

class panelsViewSet(viewsets.ModelViewSet):
    queryset = panels.objects.all()
    serializer_class = panelsSerializer