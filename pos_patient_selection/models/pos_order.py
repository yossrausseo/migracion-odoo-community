# -*- coding: utf-8 -*-

from odoo import api, fields, models
from  odoo.exceptions import UserError

import logging
_logger = logging.getLogger(__name__)

class PosOrder(models.Model):
    _inherit = 'pos.order'
    
    """ @api.model
    def create_from_ui(self, order, draft=False):
        if order:
            # Create pos.order  
            var = super(PosOrder, self).create_from_ui(order, draft=False)            
            if var:
                # Get pos order object
                pos_order = self.env['pos.order'].search([('pos_reference', '=', var[0].get('pos_reference'))], limit=1)
            # Process salesperson from order lines  
            lines = order[0].get('data').get('lines') 
            for line in lines:
                #raise UserError(line[2].get('salesperson_id'))
                #raise UserError(line[2].get('sale_order_line_id')['salesperson_id'])
                pos_line = pos_order.lines.filtered(lambda l: l.product_id.id == line[2].get('product_id'))
                if line[2].get('sale_order_line_id'):
                    #pos_line.salesperson_id = line[2].get('sale_order_line_id')['salesperson_id']
                    # Get employee name
                    employee_name = line[2].get('sale_order_line_id')['salesperson_id']
                    # Search employee object 
                    employee = self.env['hr.employee'].search([('name', '=', employee_name)], limit=1)
                    # Set salesperson ID  
                    if employee:
                        pos_line.salesperson_id = employee.id
                    else:
                        pos_line.salesperson_id = False
                elif line[2].get('salesperson_id'):
                    pos_line.salesperson_id = line[2].get('salesperson_id')
                else:
                    pos_line.salesperson_id = False  
            return var """
