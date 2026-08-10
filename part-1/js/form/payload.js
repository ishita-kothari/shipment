import {CUSTOMS_COUNTRIES} from '../constants.js';
import {customsFormData, getStringValue, staticFormData} from "../../utils/formData.js";

export function buildShipmentPayload(formData) {
    const {
        name,
        country,
        city,
        telephone_number,
        shipping_preference
    } = staticFormData(formData);

    const payload = {
        name,
        city,
        country,
        shipping_preference,
        insured: formData.get('insured') === 'on'
    };

    addOptionalTelephone(
        payload,
        telephone_number,
    );

    addCustomsInformation(
        payload,
        formData,
        country
    );

    return payload;
}

function addOptionalTelephone(payload, telephone_number) {
    if (telephone_number) {
        payload.telephone_number =
            telephone_number;
    }
}

function addCustomsInformation(
    payload,
    formData,
    country
) {
    if (!CUSTOMS_COUNTRIES.has(country)) {
        return;
    }
    const {tax_number, export_reason} = customsFormData(formData);

    payload.tax_number = tax_number;

    payload.export_reason = export_reason;

    const statements =
        getStringValue(
            formData,
            'statements'
        );

    if (statements) {
        payload.statements = statements;
    }
}