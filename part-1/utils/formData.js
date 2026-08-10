export function getStringValue(formData, fieldName) {
    return String(
        formData.get(fieldName) ?? ''
    ).trim();
}

export function staticFormData(formData) {
    const name = getStringValue(formData, 'name');
    const country = getStringValue(formData, 'country');
    const city = getStringValue(formData, 'city');

    const telephone_number =
        getStringValue(formData, 'telephone_number');

    const shipping_preference =
        getStringValue(formData, 'shipping_preference');

    return {
        name,
        country,
        city,
        telephone_number,
        shipping_preference,
    }
}

export function customsFormData(formData) {
    const tax_number =
        getStringValue(formData, 'tax_number');

    const export_reason =
        getStringValue(formData, 'export_reason');

    return {
        tax_number,
        export_reason,
    }
}