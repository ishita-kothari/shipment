import { CUSTOMS_COUNTRIES } from '../constants.js';
import {getElement, getElements} from "../../utils/dom.js";


export function initializeFormUI(form) {
    return {
        form,
        submitButton: getElement(
            'button[type="submit"]',
            form
        ),
        customsSection:
            getElement('#customs-section'),
        countryField:
            getElement('#country', form)
    };
}

export function updateCustomsVisibility(
    customsSection,
    countryField
) {
    if (!customsSection || !countryField) {
        return;
    }

    const shouldShow =
        CUSTOMS_COUNTRIES.has(
            countryField.value
        );

    customsSection.hidden = !shouldShow;

    const fields = getElements(
        'input, select, textarea',
        customsSection
    );

    fields.forEach((field) => {
        field.disabled = !shouldShow;
    });
}

export function setSubmittingState(
    ui,
    isSubmitting
) {
    const {
        submitButton,
        form
    } = ui;

    if (!submitButton) {
        return;
    }

    submitButton.disabled =
        isSubmitting;

    if (isSubmitting) {
        submitButton.dataset.originalText =
            submitButton.innerHTML;

        submitButton.textContent =
            'Sending...';

        form.setAttribute(
            'aria-busy',
            'true'
        );

        return;
    }

    submitButton.innerHTML =
        submitButton.dataset.originalText ||
        'Submit';

    form.removeAttribute(
        'aria-busy'
    );
}

export function showValidationErrors(
    form,
    errors
) {
    Object.entries(errors).forEach(
        ([fieldName, message]) => {
            const field =
                form.elements[fieldName];

            if (!field) {
                return;
            }

            field.setAttribute(
                'aria-invalid',
                'true'
            );

            const errorElement =
                document.getElementById(
                    `${fieldName}-error`
                );

            if (errorElement) {
                errorElement.textContent =
                    message;
            }
        }
    );
}

export function clearValidationErrors(form) {
    getElements(
        '[aria-invalid="true"]',
        form
    ).forEach((field) => {
        field.removeAttribute(
            'aria-invalid'
        );
    });

    getElements(
        '.field-error',
        form
    ).forEach((element) => {
        element.textContent = '';
    });
}

export function clearFieldError(field) {
    if (!field) {
        return;
    }

    field.removeAttribute(
        'aria-invalid'
    );

    const errorElement =
        document.getElementById(
            `${field.name}-error`
        );

    if (errorElement) {
        errorElement.textContent = '';
    }
}

export function focusFirstInvalidField(
    form,
    errors
) {
    const firstField =
        Object.keys(errors)[0];

    form.elements[firstField]?.focus();
}

export function clearCustomsFields(
    customsSection
) {
    if (!customsSection) {
        return;
    }

    const fields = customsSection.querySelectorAll(
        'input, select, textarea'
    );

    fields.forEach((field) => {
        field.value = '';
        field.removeAttribute('aria-invalid');
    });

    customsSection
        .querySelectorAll('.form-error-message')
        .forEach((error) => {
            error.textContent = '';
        });
}