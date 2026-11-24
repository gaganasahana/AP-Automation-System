from django.db import models

from django.db import models

class Invoice(models.Model):
    invoice_id = models.CharField(max_length=50)
    vendor = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    invoice_date = models.DateField()
    status = models.CharField(max_length=20, default='Pending')

    def __str__(self):
        return self.invoice_id
