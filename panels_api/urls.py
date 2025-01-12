from rest_framework.routers import DefaultRouter
from .views import panelsViewSet

router = DefaultRouter()

router.register(
    prefix="api/V1/panels",
    viewset = panelsViewSet,
    basename = "panels"
)

urlpatterns = router.urls