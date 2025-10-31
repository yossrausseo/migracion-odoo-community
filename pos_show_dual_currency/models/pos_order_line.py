from collections import defaultdict
from datetime import timedelta
from itertools import groupby

from odoo import api, fields, models, _, Command
from odoo.exceptions import AccessError, UserError, ValidationError
from odoo.tools import float_is_zero, float_compare
from odoo.osv.expression import AND, OR
from odoo.service.common import exp_version

class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    tax_today = fields.Float(string='Tasa', digits=(12, 4))
    subtotal_neto_usd = fields.Float(string='Subtotal neto USD', compute='_compute_subtotal_neto_usd', store=True, digits=(12, 2))
    subtotal_incl_usd = fields.Float(string='Subtotal USD', compute='_compute_subtotal_incl_usd', store=True, digits=(12, 2))

    @api.model
    def create(self, values):
        if 'tax_today' not in values:  # Verifica si se proporciona un valor para 'tax_today'
            values['tax_today'] = self.env['res.currency.rate'].search([('name', '<=', fields.Date.today()), ('currency_id', '=', 2)], limit=1).inverse_company_rate
        return super(PosOrderLine, self).create(values)

    @api.depends('price_subtotal', 'tax_today')
    def _compute_subtotal_neto_usd(self):
        for line in self:
            if line.tax_today != 0:
                line.subtotal_neto_usd = line.price_subtotal / line.tax_today
            else:
                line.subtotal_neto_usd = 0.0

    @api.depends('price_subtotal_incl', 'tax_today')
    def _compute_subtotal_incl_usd(self):
        for line in self:
            if line.tax_today != 0:
                line.subtotal_incl_usd = line.price_subtotal_incl / line.tax_today
            else:
                line.subtotal_incl_usd = 0.0