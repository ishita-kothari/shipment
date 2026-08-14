import {beforeEach, describe, expect, it} from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {validateShipmentForm} from "../js/form/validation.js";
import {renderShippingMethods, updateCustomsVisibility} from "../js/form/ui.js";
import {SHIPPING_PREFERENCES} from "../js/constants.js";
import {fileURLToPath} from "node:url";
import { populateFormOptions} from "../js/form/options.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let form;

beforeEach(() => {
    document.body.innerHTML = fs.readFileSync(
        path.resolve(
            __dirname,
            '../new-shipment.html'
        ),
        'utf-8'
    );
    form = document.querySelector('#shipment-form');
    const shippingMethodsContainer = document.querySelector('#shipping_preference_options');

    populateFormOptions(form);
    renderShippingMethods(
        shippingMethodsContainer,
        [{
            id: 1,
            name: SHIPPING_PREFERENCES["Fast shipping method"],
        }]
    );
});

function setField(name, value) {
    form.elements[name].value = value;
}


describe('validateShipmentForm', () => {
    it('accepts a valid domestic shipment', () => {
        setField('name', 'Ishita');
        setField('country', 'NL');
        setField('city', 'Eindhoven');
        setField('shipping_preference', 'fast');

        const result = validateShipmentForm(
            new FormData(form)
        );

        expect(result).toEqual({
            isValid: true,
            errors: {}
        });
    });

    it('requires customs fields for GB', () => {
        setField('name', 'Ishita');
        setField('country', 'GB');
        setField('city', 'London');

        const result = validateShipmentForm(
            new FormData(form)
        );

        expect(result.isValid).toBe(false);

        expect(result.errors).toMatchObject({
            tax_number:
                'Please enter the tax number.',
            export_reason:
                'Please select an export reason.'
        });
    });

    it('accepts valid customs fields for GB', () => {
        setField('name', 'Ishita');
        setField('country', 'GB');
        setField('city', 'London');
        updateCustomsVisibility(
            form.querySelector('#customs-section'),
            form.elements.country
        );
        setField(
            'tax_number',
            'GB123456789'
        );
        setField(
            'export_reason',
            'gift'
        );

        const result = validateShipmentForm(
            new FormData(form)
        );

        expect(result).toEqual({
            isValid: true,
            errors: {}
        });
    });

    it('rejects an invalid telephone number', () => {
        setField('name', 'Ishita');
        setField('country', 'NL');
        setField('city', 'Eindhoven');
        setField(
            'telephone_number',
            'abc'
        );

        const result = validateShipmentForm(
            new FormData(form)
        );

        expect(result.isValid).toBe(false);

        expect(
            result.errors.telephone_number
        ).toBe(
            'Please enter a valid telephone number.'
        );
    });
});