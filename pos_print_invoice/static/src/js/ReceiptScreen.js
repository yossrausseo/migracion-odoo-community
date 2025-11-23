odoo.define('pos_print_invoice.ReceiptScreen', function (require) {
    'use strict';

    const ReceiptScreen = require('point_of_sale.ReceiptScreen');
    const Registries = require('point_of_sale.Registries');
    const { onWillStart } = owl;

    const PosPrintInvoice = ReceiptScreen =>
        class extends ReceiptScreen {
            // Reemplazamos el constructor por el setup, que es el lugar
            // correcto para registrar hooks del ciclo de vida.
            setup() {
                super.setup();

                // Inicializamos la variable que guardará el descuento.
                this.invoice_id = 0;

                // Registramos el hook onWillStart. Esta función se ejecutará
                // antes del primer renderizado, y el componente ESPERARÁ a que termine.
                onWillStart(async () => {
                    await this.fetchInvoiceId();
                });
            }

            // El getter ahora es simple: solo devuelve el valor que ya hemos cargado.
            getInvoiceId() {
                return this.invoice_id;
            }

            /**
             * Llama al método de Python para obtener el descuento.
             * Esta es una operación asíncrona.
             */
            async fetchInvoiceId() {
                const order = this.currentOrder
                if (!order) return;
                
                // Hacemos la llamada RPC a nuestro método de Python
                try {
                    const result = await this.rpc({
                        model: 'pos.order',
                        method: 'get_invoice_id',
                        args: [order.name],
                    });
                    // Una vez que tenemos la respuesta del servidor, actualizamos
                    // el valor en nuestra línea de pedido.
                    this.invoice_id = result || 0;

                } catch (error) {
                    console.error("Error fetching invoice_id:", error);
                    this.invoice_id = 0;
                }
            }
            async printInvoice() {
                const invoice_id = this.invoice_id
                console.log('invloice_id', invoice_id)
                if (invoice_id) {
                    // ...llamamos a la ACCIÓN NATIVA de impresión de Odoo.
                    //await this.env.legacyActionManager.do_action('account.account_invoices', {
                    await this.env.legacyActionManager.do_action('pos_print_invoice.action_report_pos_invoice_igtf', {
                        additional_context: {
                            active_ids: [invoice_id],
                        },
                    });
                    
                } else {
                    // Si no, informamos al usuario.
                    this.showPopup('ErrorPopup', {
                        title: this.env._t('Factura no encontrada'),
                        body: this.env._t('La factura para este pedido no fue encontrada o aún no ha sido generada.'),
                    });
                }
            }
        };

    Registries.Component.extend(ReceiptScreen, PosPrintInvoice);

    return ReceiptScreen;
});