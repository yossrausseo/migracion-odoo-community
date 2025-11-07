{
    'name': 'POS Patient Selection',
    'version': '16.0.1.0.0',
    'summary': 'Adds a button in the POS to select a patient and create new ones.',
    'author': 'Yosmari Rausseo',
    'license': 'AGPL-3',
    'category': 'Sales/Point of Sale',
    'depends': [
        'base', 
        'gamification',
        'point_of_sale', 
        'product',
        'pos_sale', 
        'basic_hms',
        'steam_hms'
    ],
    'assets': {
        'point_of_sale.assets': [
            # Archivos XML para las plantillas de la interfaz
            'pos_patient_selection/static/src/css/style.css',
            'pos_patient_selection/static/src/js/pos_load_data.js',
            'pos_patient_selection/static/src/js/pos_screen.js',
            #'pos_patient_selection/static/src/js/pos_popup.js',
            #'pos_patient_selection/static/src/js/screens.js',
            # Archivos JavaScript para la lógica de la interfaz
            #'pos_patient_selection/static/src/xml/pos_popup_templates.xml',
            'pos_patient_selection/static/src/xml/pos_screen_templates.xml',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}