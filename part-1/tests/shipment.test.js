import {
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createShipment } from '../js/api.js';
import { ShipmentForm } from '../js/form/shipment.js';
import { populateFormOptions } from '../js/form/options.js';
import { validateShipmentForm } from '../js/form/validation.js';

vi.mock('../js/api.js', () => ({
    createShipment: vi.fn(),
    getShippingMethods: vi.fn().mockResolvedValue([
        {
            id: 1,
            name: 'Fast shipping method'
        }
    ])
}));

const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);

describe('ShipmentForm', () => {
    let form;
    let shipmentForm;
    let status;

    beforeEach(async () => {
        vi.clearAllMocks();

        document.body.innerHTML =
            fs.readFileSync(
                path.resolve(
                    __dirname,
                    '../new-shipment.html'
                ),
                'utf-8'
            );

        form = document.querySelector(
            '#shipment-form'
        );

        status = document.querySelector(
            '#form-status'
        );

        populateFormOptions(form);

        shipmentForm = new ShipmentForm(form);

        await shipmentForm.init();
    });

    it('preserves form data and shows an error when shipment creation fails', async () => {
        createShipment.mockRejectedValueOnce(
            new Error('Unable to create shipment')
        );
        form.elements.name.value = 'Ishita';

        form.elements.country.value = 'NL';

        form.elements.city.value = 'Eindhoven';

        form.elements.telephone_number.value = '+31612345678';

        const shippingRadio = form.querySelector('input[name="shipping_preference"]');

        expect(shippingRadio).not.toBeNull();

        expect(shippingRadio.value).toBe('fast');

        shippingRadio.click();

        form.elements.insured.checked = true;

        const formData =
            new FormData(form);

        const validation = validateShipmentForm(formData);

        expect(validation).toEqual({
            isValid: true,
            errors: {}
        });

        await shipmentForm.handleSubmit(
            new Event('submit', {
                bubbles: true,
                cancelable: true
            })
        );

        expect(createShipment).toHaveBeenCalledTimes(1);
        expect(createShipment).toHaveBeenCalledWith({
                name: 'Ishita',
                city: 'Eindhoven',
                country: 'NL',
                telephone_number:
                    '+31612345678',
                shipping_preference:
                    'fast',
                insured: true
            });

        expect(form.elements.name.value).toBe('Ishita');
        expect(form.elements.country.value).toBe('NL');
        expect(form.elements.city.value).toBe('Eindhoven');
        expect(form.elements.telephone_number.value).toBe('+31612345678');
        expect(form.querySelector(
                'input[name="shipping_preference"]:checked'
            ).value).toBe('fast');
        expect(form.elements.insured.checked).toBe(true);
        expect(status.hidden).toBe(false);
        expect(status.textContent).toContain('Unable to create shipment');
    });
});