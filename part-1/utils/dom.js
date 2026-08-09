export function getElement(selector, parent = document) {
    return parent.querySelector(selector);
}

export function getElements(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}

export function setHidden(element, hidden) {
    if (!element) {
        return;
    }

    element.hidden = hidden;
}

export function setDisabled(element, disabled) {
    if (!element) {
        return;
    }

    element.disabled = disabled;
}