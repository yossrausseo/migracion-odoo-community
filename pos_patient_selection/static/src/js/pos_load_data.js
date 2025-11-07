odoo.define('pos_patient_selection.pos', function(require) {
    "use strict";
    var { PosGlobalState } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    /**
    * This function creates a new class that extends PosGlobalState with an additional property patients.
    * The patients property is loaded from the backend and contains all patients in the system.
    */
    const NewPosGlobalState = (PosGlobalState) => class NewPosGlobalState extends PosGlobalState {
        async _processData(loadedData) {
            await super._processData(...arguments);
            this.patients = loadedData['patients'] || [];
        }
    }
    Registries.Model.extend(PosGlobalState, NewPosGlobalState);
});
