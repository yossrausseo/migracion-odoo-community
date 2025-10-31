odoo.define('pos_show_dual_currency.PaymentScreen', function(require) {
    'use strict';

    const NumberBuffer = require('point_of_sale.NumberBuffer');

    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');

    const PosShowDualCurrencyPaymentScreen = (PaymentScreen) =>
        class extends PaymentScreen {
            constructor() {
                super(...arguments);
            }

            _updateSelectedPaymentline() {
                let show_currency_rate = this.env.pos.config.show_currency_rate
                let rate_company = this.env.pos.config.rate_company;
                if(this.selectedPaymentLine && !this.selectedPaymentLine.payment_method.is_dollar_payment){
                    super._updateSelectedPaymentline()
                }
                else{
                    if (this.paymentLines.every((line) => line.paid)) {
                        this.currentOrder.add_paymentline(this.env.pos.payment_methods[0]);
                    }
                    if (!this.selectedPaymentLine) return; // do nothing if no selected payment line
                    // disable changing amount on paymentlines with running or done payments on a payment terminal
                    if (
                        this.payment_interface &&
                        !['pending', 'retry'].includes(this.selectedPaymentLine.get_payment_status())
                    ) {
                        return;
                    }
                    if (NumberBuffer.get() === null) {
                        this.deletePaymentLine({ detail: { cid: this.selectedPaymentLine.cid } });
                    } 
                    /* else {
                        let val= NumberBuffer.getFloat()
                        val= val* this.env.pos.config.show_currency_rate;
                        this.selectedPaymentLine.set_amount(val);
                    } */
                    else {
                        let	price_other_currency = NumberBuffer.getFloat();
                        if(this.selectedPaymentLine.payment_method.is_dollar_payment){
                            if(rate_company > show_currency_rate){
                                price_other_currency = (price_other_currency * rate_company)/show_currency_rate;
                            }
                            else if(rate_company < show_currency_rate){
                                price_other_currency = price_other_currency * rate_company;
                            }
                        }
                        this.selectedPaymentLine.set_amount(price_other_currency);
                    }

                }
            }
        };

    Registries.Component.extend(PaymentScreen, PosShowDualCurrencyPaymentScreen);

    return PaymentScreen;
});
