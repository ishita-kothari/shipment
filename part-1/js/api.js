import {CREATE_API_URL} from "./config.js";

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