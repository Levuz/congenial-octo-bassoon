from django.urls import path
from . import views

urlpatterns = [
    path("start/", views.start_test, name="test-start"),
    path("submit/", views.submit_test, name="test-submit"),
    path("results/<uuid:uuid>/", views.get_results, name="test-results"),
]