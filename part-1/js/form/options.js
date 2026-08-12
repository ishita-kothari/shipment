import {
    COUNTRIES,
    EXPORT_REASONS
} from '../constants.js';

export function populateFormOptions(form) {
    populateSelect(
        form.elements.country,
        COUNTRIES,
        'Select a country'
    );

    populateSelect(
        form.elements.export_reason,
        EXPORT_REASONS,
        'Select export reason'
    );
}

function populateSelect(
    select,
    options,
    placeholder
) {
    if (!select) {
        return;
    }

    const fragment = document.createDocumentFragment();

    const placeholderOption = document.createElement('option');

    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;

    fragment.appendChild(
        placeholderOption
    );

    options.forEach(
        ({ value, label }) => {
            const option =
                document.createElement(
                    'option'
                );

            option.value = value;
            option.textContent = label;

            fragment.appendChild(option);
        }
    );

    select.replaceChildren(
        fragment
    );
}