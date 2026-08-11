import {
    clearCustomsFields,
    clearFieldError,
    clearValidationErrors,
    focusFirstInvalidField,
    initializeFormUI,
    setSubmittingState,
    showStatus,
    showValidationErrors,
    updateCustomsVisibility
} from "./ui.js";
import {validateShipmentForm} from "./validation.js";
import {buildShipmentPayload} from "./payload.js";
import {CUSTOMS_COUNTRIES, FORM_STATUS} from "../constants.js";
import {createShipment} from "../api.js";

export class ShipmentForm {
    constructor(form) {
        this.form = form;
        this.ui = initializeFormUI(form);
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
                const requiresCustoms =
                    CUSTOMS_COUNTRIES.has(
                        this.ui.countryField.value
                    );

                // @TODO: think if we want to clear fields everytime or retain values while switch btw GB/US?
                // keeping it simple for now .....
                // if (!requiresCustoms) {
                clearCustomsFields(
                    this.ui.customsSection
                );
                // }

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
        const formData = new FormData(this.form);

        if (this.isSubmitting) {
            return;
        }

        const validation =
            validateShipmentForm(
                formData
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

        const payload =
            buildShipmentPayload(
                formData
            );

        await this.submitShipment(payload);
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

    async submitShipment(payload) {
        this.setSubmitting(true);
        [...this.form.elements].forEach(el => el.disabled = true)
        await createShipment(payload)
            .then(res => {
                showStatus(this.ui.status, FORM_STATUS.SUCCESS, "Shipment successfully created");
                this.form.reset();
                updateCustomsVisibility(
                    this.ui.customsSection,
                    this.ui.countryField
                );
            })
            .catch((err) => {
                showStatus(this.ui.status, FORM_STATUS.ERROR, err.message);
            })
            .finally(() => {
                this.setSubmitting(false);
                [...this.form.elements].forEach(el => el.disabled = false)
            });

    }
}

