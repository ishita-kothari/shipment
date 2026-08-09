import {
    clearFieldError,
    clearValidationErrors,
    focusFirstInvalidField,
    initializeFormUI,
    setSubmittingState,
    showValidationErrors,
    updateCustomsVisibility
} from "./ui.js";
import {validateShipmentForm} from "./validation.js";

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
                clearValidationErrors(
                    this.form
                );
            }
        );
        this.form.addEventListener(
            'submit',
            (event) => this.handleSubmit(event)
        );
        this.form.addEventListener(
            'input',
            (event) => {
                clearFieldError(
                    event.target
                );
            }
        );

        this.form.addEventListener(
            'change',
            (event) => {
                clearFieldError(
                    event.target
                );
            }
        );
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) {
            return;
        }

        const validation =
            validateShipmentForm(
                this.form
            );

        if (!validation.isValid) {
            this.handleValidationFailure(
                validation.errors
            );

            return;
        }

        clearValidationErrors(
            this.form
        );

        // @TODO: remove this after implementing API
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

    handleValidationFailure(errors) {
        showValidationErrors(
            this.form,
            errors
        );

        focusFirstInvalidField(
            this.form,
            errors
        );
    }
}

