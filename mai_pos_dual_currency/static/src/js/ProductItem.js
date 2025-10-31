odoo.define('mai_pos_dual_currency.ProductItem', function (require) {
	'use strict';

	const ProductItem = require('point_of_sale.ProductItem');
	const Registries = require('point_of_sale.Registries');
	
	const CurrencyProductItem = (ProductItem) =>
		class extends ProductItem {
			
			get price_other_currency() {
				let self = this;
				let rate_company = this.env.pos.config.rate_company;
				let show_currency_rate = this.env.pos.config.show_currency_rate;
				let price = this.props.product.get_price(this.pricelist, 1);
				let	price_other_currency = price;
				if(this.env.pos.currency.name == "VEF"){
					if(rate_company > show_currency_rate){
						price_other_currency = show_currency_rate * price ;
					}
					else if(rate_company < show_currency_rate){
						price_other_currency = price / show_currency_rate;
					}
				}
				
				return price_other_currency;
			}

		}
	Registries.Component.extend(ProductItem, CurrencyProductItem);

	return ProductItem;
});



