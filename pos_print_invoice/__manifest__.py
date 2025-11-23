{
    'name': 'POS Print Invoice',
    'version': '16.0.1.0.0',
    'summary': 'Add a button to print the invoice directly from the final receipt screen of the Point of Sale.',
    'author': 'Yosmari Rausseo',
    'category': 'Point of Sale',
    'depends': ['point_of_sale', 'l10n_ve_account_report'],
    'data': [
        'report/pos_invoice_report.xml',
        'report/report_free_form_invoice.xml'
    ],
    'assets': {
        'point_of_sale.assets': [
            'pos_print_invoice/static/src/js/ReceiptScreen.js',
            'pos_print_invoice/static/src/xml/ReceiptScreen.xml',
        ],
    },
    'installable': True,
    'application': False,
    'images': [
        'static/description/icon.png',
    ],
}