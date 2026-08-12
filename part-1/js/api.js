import {CREATE_API_URL, SHIPPING_METHOD_API_URL} from "./config.js";
import {SHIPPING_PREFERENCES} from "./constants.js";

export async function createShipment(payload) {
    let response;

    try {
        response = await fetch(
            CREATE_API_URL,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload)
            }
        );
    } catch {
        throw new Error(
            'Network error. Please check your connection and try again.'
        );
    }

    if (!response.ok) {
        throw new Error(
            'Unable to create shipment. Please try again.'
        );
    }

    return response;
}

export async function getShippingMethods() {
    const response = await fetch(SHIPPING_METHOD_API_URL);

    if (!response.ok) {
        throw new Error('Failed to load shipping methods');
    }

    const methods = await response.json();

    return methods.map((method) => ({
        ...method,
        preference: SHIPPING_PREFERENCES[method.name]
    }));
}