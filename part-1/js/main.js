import {
    populateFormOptions
} from './form/options.js';
import {ShipmentForm} from "./form/ui.js";

const form =
    document.querySelector(
        '#shipment-form'
    );

if (form) {
    populateFormOptions(form);

    const shipmentForm =
        new ShipmentForm(form);

    shipmentForm.init();
}