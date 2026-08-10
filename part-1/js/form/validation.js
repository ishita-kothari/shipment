import {CUSTOMS_COUNTRIES} from '../constants.js';
import {customsFormData, staticFormData} from "../../utils/formData.js";

const PHONE_PATTERN = /^[+0-9\s().-]{6,}$/;

export function validateShipmentForm(formData) {

    const errors = {};

    const {
        name,
        country,
        city,
        telephone_number,
        shipping_preference
    } = staticFormData(formData);

    if (!name) {
        errors.name = 'Please enter the recipient name.';
    }

    if (!country) {
        errors.country = 'Please select a country.';
    }

    if (!city) {
        errors.city = 'Please enter the city.';
    }

    if (!shipping_preference) {
        errors.shipping_preference =
            'Please select a shipping preference.';
    }

    if (
        telephone_number &&
        !PHONE_PATTERN.test(telephone_number)
    ) {
        errors.telephone_number =
            'Please enter a valid telephone number.';
    }

    /*
     * Customs validation only applies to countries
     * where customs information is required.
     */
    if (CUSTOMS_COUNTRIES.has(country)) {
        validateCustomsFields(formData, errors);
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

function validateCustomsFields(formData, errors) {
    const {tax_number, export_reason} = customsFormData(formData);

    if (!tax_number) {
        errors.tax_number =
            'Please enter the tax number.';
    }

    if (!export_reason) {
        errors.export_reason =
            'Please select an export reason.';
    }
}
