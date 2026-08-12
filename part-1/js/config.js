export const API_CONFIG = {
    baseUrl: 'http://localhost:3000',
    shipmentsEndpoint: '/shipments',
    shippingMethodsEndpoint: '/shipping-methods',
};

export const CREATE_API_URL = `${API_CONFIG.baseUrl}${API_CONFIG.shipmentsEndpoint}`;
export const SHIPPING_METHOD_API_URL = `${API_CONFIG.baseUrl}${API_CONFIG.shippingMethodsEndpoint}`;