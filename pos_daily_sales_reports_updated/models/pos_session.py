from odoo import api, fields, models, _, Command

class PosSession(models.Model):
    _inherit = "pos.session"

    tax_today = fields.Float(string="Tasa Sesión", store=True,
                             compute="_tax_today",
                             track_visibility='onchange', digits='Dual_Currency_rate')
    @api.depends('config_id')
    def _tax_today(self):
        for rec in self:
            rec.tax_today = 1 / rec.config_id.show_currency_rate
