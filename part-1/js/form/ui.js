import {CUSTOMS_COUNTRIES} from '../constants.js';
import {getElement, getElements} from "../../utils/dom.js";


export function initializeFormUI(form) {
    return {
        form,
        submitButton: getElement(
            'button[type="submit"]',
            form
        ),
        customsSection: getElement('#customs-section'),
        countryField: getElement('#country', form),
        status: getElement('#form-status')
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

export function showStatus(
    element,
    type,
    message
) {
    if (!message) {
        element.hidden = true;
        element.textContent = '';
        return;
    }

    element.hidden = false;
    element.textContent = message;
    element.dataset.status = type;
    element.classList.toggle("status-success", type === "success");
    element.classList.toggle("status-error", type === "error");
}

export function renderShippingMethods(container, methods) {
    container.replaceChildren();

    const fragment = document.createDocumentFragment();

    methods.forEach((method, index) => {
        const option = document.createElement('div');
        option.className = 'segment-option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `ship-${method.preference}`;
        input.name = 'shipping_preference';
        input.value = method.preference;
        input.checked = index === 0;
        input.defaultChecked = index === 0;

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = method.name.replace(' shipping method', '');

        option.append(input, label);
        fragment.appendChild(option);
    });

    container.appendChild(fragment);
}