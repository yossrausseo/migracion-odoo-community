# -*- coding: utf-8 -*-
from odoo import models, fields, api

class PosOrder(models.Model):
    _inherit = 'pos.order'

    @api.model
    def get_invoice_id(self, pos_order_name):
        """
        Busca un pedido del POS por su nombre (ej: Pedido 00042-003-0014)
        y devuelve el ID de su factura asociada, si existe.
        """
        # Buscamos el pedido en el backend. limit=1 para asegurar un solo resultado.
        order = self.env['pos.order'].search([('pos_reference', '=', pos_order_name)], limit=1)
        print('order', order)
        # Verificamos si se encontró el pedido y si tiene una factura enlazada.
        if order and order.state == 'invoiced':
            invoice = self.env['account.move'].search([('ref', '=', order.name)], limit=1)
            print('invoice', invoice)
            return invoice.id
        
        # Si no se encuentra nada, devolvemos 0.
        return 0
    
    