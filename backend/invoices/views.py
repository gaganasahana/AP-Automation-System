from django.shortcuts import render

import pytesseract
from PIL import Image
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Invoice

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


@csrf_exempt
def invoice_list(request):

    if request.method == 'GET':
        invoices = Invoice.objects.all()

        data = []

        for invoice in invoices:
            data.append({
                'id': invoice.invoice_id,
                'vendor': invoice.vendor,
                'amount': str(invoice.amount),
                'status': invoice.status,
                'date': str(invoice.invoice_date)
            })

        return JsonResponse(data, safe=False)

    if request.method == 'POST':
        body = json.loads(request.body)

        invoice = Invoice.objects.create(
            invoice_id=body['id'],
            vendor=body['vendor'],
            amount=body['amount'],
            invoice_date=body['date'],
            status='Pending'
        )

        return JsonResponse({'message': 'Invoice added successfully'})


@csrf_exempt
def invoice_delete(request, invoice_id):

    if request.method == 'DELETE':
        Invoice.objects.filter(invoice_id=invoice_id).delete()

        return JsonResponse({'message': 'Invoice deleted successfully'})
