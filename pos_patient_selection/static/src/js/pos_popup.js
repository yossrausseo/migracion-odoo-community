/**@odoo-module **/
import AbstractAwaitablePopup from "point_of_sale.AbstractAwaitablePopup";
import Registries from "point_of_sale.Registries";
const { useRef } = owl;
var core = require('web.core');
const { Gui } = require('point_of_sale.Gui');
var _t = core._t;

class PatientPopup extends AbstractAwaitablePopup {
    /**
     * Set up the custom popup component and initialize its reference to the Patient dropdown.
     */
    setup() {
        super.setup();
        //this.salePersonRef = useRef('salePersonRef')
        this.userSearch = useRef('userSearch')
        this.selectedPatient = null;
    }
    onSearch(event) {
        const searchValue = event.target.value.toLowerCase(); // Convertir a minúsculas
        $('.user-row').each(function() {
            const rowText = $(this).text().toLowerCase(); // Convertir texto de la fila a minúsculas
            if (rowText.includes(searchValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
        
    patientselected(event){
        const selectedRow = event.currentTarget;
        const searchValue = selectedRow.dataset;

        if (searchValue) {
            this.selectedPatient = searchValue; // save the Patient selected

            // Remove the 'Patient-selected' class from all rows
            const allRows = document.querySelectorAll('.user-row');
            allRows.forEach(row => row.classList.remove('patient-selected'));

            // Add the 'Patient-selected' class to the clicked row
            selectedRow.classList.add('patient-selected');

        } else {
            console.error("Error: No se pudo obtener el ID del paciente.");
        }
    }

    /**
     * Confirm the selection of a Patient for the selected orderline, and close the popup.
     * If no orderline is selected, an error message is displayed instead.
     */
    /* confirm() {
        if (this.env.pos.selectedOrder.selected_orderline) {
            var order = this.env.pos.get_order();
            var orderlines = order.get_orderlines();
            let option = this.selectedPatient
            if (option) { 
                for (var i = 0; i < orderlines.length; i++) {
                    if (!orderlines[i].Patient_id && !orderlines[i].sale_order_origin_id) {
                        orderlines[i].Patient = option.name;
                        orderlines[i].Patient_id = parseInt(option.id);
                    }
                }
            }
            else{
                Gui.showPopup("ErrorPopup", {
                    'title': _t("Error"),
                    'body': _.str.sprintf(_t('Debe seleccionar un asesor de venta')),
                });
            }
            this.env.posbus.trigger("close-popup", {
                popupId: this.props.id,
                response: {
                    confirmed: true,
                    payload: null,
                },
            });
        } else {
            Gui.showPopup("ErrorPopup", {
                'title': _t("Error"),
                'body': _.str.sprintf(_t('Debe agregar primero un produto a la orden')),
            });
            return false;
        }
    } */
    /**
     * Cancel the selection of a Patient for the selected orderline, and close the popup.
     */
    cancel() {
        this.env.posbus.trigger("close-popup", {
            popupId: this.props.id,
            response: {
                confirmed: false,
                payload: null,
            },
        });
    }
}
PatientPopup.template = "PatientPopup";
Registries.Component.add(PatientPopup);
