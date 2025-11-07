# -*- coding: utf-8 -*-
from odoo import models

class PosSession(models.Model):
    _inherit = 'pos.session'

    def load_pos_data(self):
        """Load POS data and add `hr_employee` to the response dictionary.
        return: A dictionary containing the POS data.
        """
        patients = self.env['res.partner'].search([('is_patient', '=', True)])
        res = super(PosSession, self).load_pos_data()
        res['patients'] = patients.read(['id', 'name', 'identification'])
        return res