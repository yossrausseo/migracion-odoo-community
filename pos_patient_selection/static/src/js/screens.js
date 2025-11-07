odoo.define("pos_patient_selection.screens", function (require) {
    "use strict";

    const ProductScreen = require("point_of_sale.ProductScreen");
    const Registries = require("point_of_sale.Registries");
    const {Gui} = require("point_of_sale.Gui");
    var core = require("web.core");
    var _t = core._t;

    const CustomProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            async _onClickPay() {
                /* var lines_without_salesperson = _.filter(
                    this.env.pos.get_order().get_orderlines(),

                    function (line) {
                        console.log(line)
                        if (line.sale_order_origin_id){
                            return line.sale_order_origin_id.salesperson_id == '';
                        }
                        else if(!line.is_reward_line || line.is_reward_line == false){
                            return line.salesperson_id == ""  || line.salesperson_id == null;   
                        }
                    }
                );
                if (lines_without_salesperson.length > 0) {
                    Gui.showPopup("ErrorPopup", {
                        'title': _t("Error"),
                        'body': _.str.sprintf(_t("Debe agregar el asesor de venta a los siguientes productos:") +
                        "\n" +
                        _.map(lines_without_salesperson, function (line) {
                            return " - " + line.product.display_name;
                        }).join("\n")),
                    });
                    return;
                }
                else{
                    await super._onClickPay();
                } */
            }
        };

    Registries.Component.extend(ProductScreen, CustomProductScreen);
    return ProductScreen;
});
