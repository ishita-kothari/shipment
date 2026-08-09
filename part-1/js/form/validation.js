import { CUSTOMS_COUNTRIES } from '../constants.js';

const PHONE_PATTERN = /^[+0-9\s().-]{6,}$/;

export function validateShipmentForm(form) {
    const formData = new FormData(form);

    const errors = {};

    const name = getStringValue(formData, 'name');
    const country = getStringValue(formData, 'country');
    const city = getStringValue(formData, 'city');

    const telephoneNumber =
        getStringValue(formData, 'telephone_number');

    const shippingPreference =
        getStringValue(formData, 'shipping_preference');

    if (!name) {
        errors.name = 'Please enter the recipient name.';
    }

    if (!country) {
        errors.country = 'Please select a country.';
    }

    if (!city) {
        errors.city = 'Please enter the city.';
    }

    if (!shippingPreference) {
        errors.shipping_preference =
            'Please select a shipping preference.';
    }

    if (
        telephoneNumber &&
        !PHONE_PATTERN.test(telephoneNumber)
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
    const taxNumber =
        getStringValue(formData, 'tax_number');

    const exportReason =
        getStringValue(formData, 'export_reason');

    if (!taxNumber) {
        errors.tax_number =
            'Please enter the tax number.';
    }

    if (!exportReason) {
        errors.export_reason =
            'Please select an export reason.';
    }
}

function getStringValue(formData, fieldName) {
    return String(
        formData.get(fieldName) ?? ''
    ).trim();
}