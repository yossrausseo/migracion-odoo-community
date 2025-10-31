/*odoo.define('pos_show_dual_currency.models', function (require) {
    "use strict";

    const { models } = require('point_of_sale.models');

    const PosModel = models.PosModel;

    PosModel.prototype.models.push(
        {
            model: 'pos.payment.method',
            fields: ['is_dollar_payment'],
            // loaded: function (self, isDollarPayments) {
            //     // Acciones después de cargar is_dollar_payment, si es necesario
            // },
        },
        {
            model: 'pos.config',
            fields: ['show_currency_rate'],
            // loaded: function (self, showCurrencyRates) {
            //     // Acciones después de cargar show_currency_rate, si es necesario
            // },
        }
    );
});*/