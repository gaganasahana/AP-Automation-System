from django.urls import path
from . import views

urlpatterns = [
    path('invoices/', views.invoice_list),
    path('invoices/<str:invoice_id>/', views.invoice_delete),
]