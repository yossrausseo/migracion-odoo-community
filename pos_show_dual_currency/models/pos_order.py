from odoo import api, fields, models, _
from odoo.exceptions import UserError

class PosOrder(models.Model):
    _inherit = "pos.order"

    tax_today = fields.Float(string='Tasa', digits=(12, 4))
    total_amount_usd = fields.Float(string='Total USD', compute='_compute_total_amount_usd', store=True, digits=(12, 2))

    
    @api.model
    def create(self, values):
        if 'tax_today' not in values:  # Verifica si se proporciona un valor para 'tax_today'
            values['tax_today'] = self.env['res.currency.rate'].search([('name', '<=', fields.Date.today()), ('currency_id', '=', 2)], limit=1).inverse_company_rate
        return super(PosOrder, self).create(values)
    

    @api.depends('amount_total', 'tax_today')
    def _compute_total_amount_usd(self):
        for order in self:
            if order.tax_today != 0:
                order.total_amount_usd = order.amount_total / order.tax_today
            else:
                order.total_amount_usd = 0.0
            
    # @api.constrains('amount_total','os_rate')
    # def constraints_os_rate(self):
    #     for item in self:
    #         item.os_currency_amount = item.amount_total / item.os_rate
    #     for pay in item.payment_ids:
    #         pay.constraints_os_rate()