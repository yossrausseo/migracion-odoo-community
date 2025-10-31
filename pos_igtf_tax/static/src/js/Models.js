/** @odoo-module **/

import { Orderline, Order, Product, Payment } from "point_of_sale.models";
import Registries from "point_of_sale.Registries";
var utils = require('web.utils');
var round_di = utils.round_decimals;

Registries.Model.extend(Product, (Parent) => class extends Parent {
    get isIgtfProduct() {
        const { x_igtf_product_id } = this.pos.config;

        return (x_igtf_product_id)
            ? x_igtf_product_id[0] === this.id
            : false;
    }
});

Registries.Model.extend(Payment, (Parent) => class extends Parent {
    get isForeignExchange() {
        return this.payment_method.x_is_foreign_exchange;
    }

    /* set_amount(value){
        var igtf_antes = this.order.x_igtf_amount;

        if(value == this.order.get_due()){
            super.set_amount(value);
        }else{
            if(value != igtf_antes){
                if(this.isForeignExchange){
                    super.set_amount(value * (1/this.pos.config.show_currency_rate));
                }else{
                    super.set_amount(value);
                }
            }
        }


        const igtfProduct = this.pos.config.x_igtf_product_id;
        if(!(igtfProduct || igtfProduct?.length)) return;
        if(!this.isForeignExchange) return;

        if(value == igtf_antes) return;
        this.order.removeIGTF();

        const price = this.order.x_igtf_amount;

        this.order.add_product(this.pos.db.product_by_id[igtfProduct[0]], {
            quantity: 1,
            price,
            lst_price: price,
        });
    } */
    /* set_amount(value){
        super.set_amount(value);
        var igtf_antes = this.order.x_igtf_amount;
        if(value == this.order.get_due()){
            this.order.assert_editable();
            this.amount = round_di(parseFloat(value) || 0, this.pos.currency.decimal_places);

        }
        else{
            if(value != igtf_antes){
                if(this.isForeignExchange){
                    //super.set_amount(value * (1/this.pos.config.show_currency_rate));
                    //value = value * (1/this.pos.config.show_currency_rate)
                    this.order.assert_editable();
                    this.amount = round_di(parseFloat(value) || 0, this.pos.currency.decimal_places);
                }else{
                    //super.set_amount(value);
                    this.order.assert_editable();
                    this.amount = round_di(parseFloat(value) || 0, this.pos.currency.decimal_places);

                }
            }
        }
        const igtfProduct = this.pos.config.x_igtf_product_id;
        if(!(igtfProduct || igtfProduct?.length)) return;
        if(!this.isForeignExchange) return;
        if(value == igtf_antes) return;
        this.order.removeIGTF();

        const price = this.order.x_igtf_amount;

        this.order.add_product(this.pos.db.product_by_id[igtfProduct[0]], {
            quantity: 1,
            price,
            lst_price: price,
        });
    } */

    set_amount(value) {
        super.set_amount(value);
        this.order.updateIgtf();
    }
});

Registries.Model.extend(Orderline, (Parent) => class extends Parent {
    init_from_JSON(json) {
        super.init_from_JSON(...arguments);

        this.x_is_igtf_line = json.x_is_igtf_line;
    }
    
    export_as_JSON() {
        const result = super.export_as_JSON();

        result.x_is_igtf_line = this.x_is_igtf_line;

        return result;
    }

    export_for_printing() {
        const json = super.export_for_printing(...arguments);
        
        json.x_is_igtf_line =  this.x_is_igtf_line;

        return json;
      }
});

Registries.Model.extend(Order, (Parent) => class extends Parent {
    /* get x_igtf_amount() {
        var igtf_monto = this.paymentlines
            .filter((p) => p.isForeignExchange)
            .map(({ amount, payment_method: { x_igtf_percentage } }) => amount * (x_igtf_percentage / 100))
            .reduce((prev, current) => prev + current, 0);
        // monto total de la orden en dolares
        var total_dolares = this.get_total_with_tax() / this.pos.config.show_currency_rate;
        //maximo igtf
        var max_igtf = total_dolares * (this.pos.config.x_igtf_max_percentage / 100);
        //verifica que el monto no sea mayor al total
        if(igtf_monto > max_igtf){
            igtf_monto = max_igtf;
        }
        return round_di(parseFloat(igtf_monto) || 0, this.pos.currency.decimal_places);
    } */

    get x_igtf_amount() {
        // 1. Calcular el total base de la orden SIN incluir el IGTF.
        const total_base = this.get_base_total_without_igtf();

        // 2. Calcular el monto total que se ha pagado en moneda extranjera (USD).
        const total_pagado_usd = this.paymentlines
            .filter(p => p.isForeignExchange && p.amount > 0)
            .reduce((sum, p) => sum + p.amount, 0);

        // 3. La base para el cálculo del IGTF es el menor de estos dos valores.
        //    - Si pagas más en USD que el costo de los productos, el IGTF solo aplica sobre el costo de los productos.
        //    - Si pagas menos en USD que el costo de los productos, el IGTF aplica sobre lo que pagaste.
        const base_para_igtf = Math.min(total_base, total_pagado_usd);

        // Si no hay base, el IGTF es cero.
        if (base_para_igtf <= 0) {
            return 0;
        }

        // 4. Obtener el porcentaje de IGTF del primer método de pago en USD encontrado.
        const foreignPaymentMethod = this.pos.payment_methods.find(pm => pm.x_is_foreign_exchange);
        if (!foreignPaymentMethod || !foreignPaymentMethod.x_igtf_percentage) {
            return 0; // No hay método de pago con porcentaje de IGTF
        }
        const igtf_percentage = foreignPaymentMethod.x_igtf_percentage;

        // 5. Calcular y devolver el monto final del IGTF.
        const igtf_monto = base_para_igtf * (igtf_percentage / 100);

        return round_di(igtf_monto || 0, this.pos.currency.decimal_places);
    }

    get_base_total_without_igtf() {
        // Calcular total sin incluir líneas de IGTF
        let total = this.orderlines
            .filter(p => !p.x_is_igtf_line)
            .map(p => p.get_price_with_tax())
            .reduce((prev, current) => prev + current, 0);

        // Sumar paquetes si existen
        let total_packs = this.orderlines
            .filter(p => !p.x_is_igtf_line)
            .flatMap(e => e.selected_product_list || [])
            .filter(e => typeof e === 'object' && e.price_unit != 0)
            .map(e => e.price_unit * e.qty)
            .reduce((prev, current) => prev + current, 0);

        return total + total_packs;
    }

    remove_paymentline(line) {
        super.remove_paymentline(...arguments);
        this.updateIgtf();
    }

    // --- NUEVA FUNCIÓN AYUDANTE (para no repetir código) ---
    updateIgtf() {
        const igtfProduct = this.pos.config.x_igtf_product_id;
        if (!igtfProduct || !igtfProduct.length) {
            return;
        }
        
        // 1. Siempre elimina la línea de IGTF anterior
        this.removeIGTF();

        // 2. Calcula el nuevo monto de IGTF
        const price = this.x_igtf_amount;

        // 3. Si el monto es mayor a cero, añade la nueva línea
        if (price > 0) {
            this.add_product(this.pos.db.product_by_id[igtfProduct[0]], {
                quantity: 1,
                price,
                lst_price: price,
                merge: false,
            });
        }
    }


    /* removeIGTF() {
        this.orderlines
            .filter(({ x_is_igtf_line }) => x_is_igtf_line)
            .forEach((line) => this.remove_orderline(line));
    }

    set_orderline_options(orderline, options) {
        super.set_orderline_options(orderline, options);

        orderline.x_is_igtf_line = orderline.product.isIgtfProduct;
    } */
   

    removeIGTF() {
        this.orderlines
            .filter(({ x_is_igtf_line }) => x_is_igtf_line)
            // .forEach((line) => this.remove_orderline(line));
            .forEach((line) => this.remove_orderline(line));
    }

    set_orderline_options(orderline, options) {
        super.set_orderline_options(orderline, options);
        orderline.x_is_igtf_line = orderline.product.isIgtfProduct;
    }
});