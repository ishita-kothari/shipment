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
export class ShipmentForm {
    constructor(form) {
        this.form = form;
        this.ui =
            initializeFormUI(form);
        this.isSubmitting = false;

    }

    init() {
        this.bindEvents();

        updateCustomsVisibility(
            this.ui.customsSection,
            this.ui.countryField
        );
    }

    bindEvents() {
        this.ui.countryField?.addEventListener(
            'change',
            () => {
                updateCustomsVisibility(
                    this.ui.customsSection,
                    this.ui.countryField
                );
            }
        );
        this.form.addEventListener(
            'submit',
            (event) => this.handleSubmit(event)
        );
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) {
            return;
        }


        await new Promise(resolve => setTimeout(resolve, 2000))
        this.setSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        this.setSubmitting(false)
    }

    setSubmitting(isSubmitting) {
        this.isSubmitting =
            isSubmitting;

        setSubmittingState(
            this.ui,
            isSubmitting
        );
    }

}


