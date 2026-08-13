# Assignment Notes

## What did I build?

I implemented the shipment creation form in vanilla JavaScript, while keeping the existing HTML structure and styling intact. I separated the behaviour into small, focused modules so that each part has a clear responsibility and can be tested independently.

The main pieces are:

* **Form orchestration:** `ShipmentForm` in `part-1/js/form/shipment.js` coordinates the form lifecycle, event handling, validation, and submission flow.
* **Validation:** `part-1/js/form/validation.js` contains the validation logic separately from the UI. This keeps it easier to test without depending on the DOM.
* **Payload creation:** `part-1/js/form/payload.js` is responsible for transforming the form data into the structure expected by the `POST /shipments` API.
* **API layer:** API communication is isolated in `part-1/js/api.js`. This keeps the form logic independent of how HTTP requests, `fetch`, and API errors are handled.
* **UI helpers:** DOM-related operations are grouped in `part-1/js/form/ui.js`. This includes displaying validation errors and status messages, toggling customs fields, rendering shipping methods, and managing the submitting state.
* **Dynamic shipping methods:** Shipping options are loaded from `GET /shipping-methods` rather than being hardcoded into the HTML.
* **Conditional customs information:** Customs fields are only shown for countries where the API requires them, currently GB and US.
* **Form state handling:** After a successful submission, the form is cleared. If the submission fails, the entered values are kept so the user can correct the problem or retry without having to fill everything in again.
* **Validation feedback:** Validation errors are shown next to the relevant fields, and focus is moved to the first invalid field to make it easier for the user to correct the form.
* **Dynamic options:** `part-1/js/form/options.js` contains the country and export-reason options used to populate the relevant fields dynamically.

## What trade-offs did I make?

I could have put most of the logic into a single `shipment.js` file, which would have been quicker initially. However, I felt that separating the responsibilities made the code easier to understand and maintain without adding unnecessary abstraction.

One small trade-off I made was around the customs fields. I wasn't completely sure whether their values should be preserved when switching between GB and US, so I chose to clear the customs fields when the country changes. This avoids accidentally submitting values that may no longer be relevant to the selected country.

The downside is that if a user switches from GB to US and then back to GB, they need to enter the customs information again. For this assignment, I considered that behaviour simpler and less error-prone.

## What did I keep simple on purpose?

I deliberately avoided adding abstractions that weren't necessary for the scope of the assignment:

* No external or custom state-management solution.
* No custom HTTP abstraction on top of `fetch`.
* No automatic retry mechanism for API failures.

The intention was to keep the implementation easy to follow while still separating the areas that have different responsibilities.

## What would I improve with more time?

There are a few areas I would improve if this were going into a production application.

First, I would add request cancellation or a timeout mechanism so that the UI doesn't remain in a loading state indefinitely if an API request gets stuck.

I would also polish the loading and error states for the shipping-method request. At the moment, the main form behaviour is covered, but there is room to make the experience clearer when loading the available shipping methods fails.

Accessibility was also something I considered throughout the implementation, including keyboard navigation, focus management, labels, validation messages, and live status announcements. With more time, I would run the page through automated accessibility tooling and address any issues it identifies.

## What edge cases or tests matter most?

I would prioritise testing the main user flows rather than testing every individual implementation detail.

The most important cases would be:

* Successful form submission with valid data.
* Validation when required fields are missing or invalid.
* Correct handling of conditional customs fields for GB and US.
* Switching countries and ensuring the relevant fields and values behave correctly.
* Correct transformation of form values into the API payload.
* Handling API failures while preserving the user's entered data.
* Successful submission clearing the form.
* Shipping methods loading successfully and handling a failed request.
* Moving focus to the first invalid field.

This gives good coverage of the behaviour the user actually experiences while avoiding overly coupled tests around internal implementation details.

## Possible improvements that are out of scope but interesting

There are a few things I would consider for a larger production application, but intentionally left out of this assignment:

* **Server-side validation:** The API should ultimately remain the source of truth for validation, even though client-side validation provides a better user experience.
* **Form persistence:** `sessionStorage` or another persistence mechanism could be useful if the form becomes larger or is split across multiple steps.
* **Internationalisation (i18n):** If the application needs to support multiple languages, the labels, validation messages, status messages, and other user-facing text could be moved into translation resources.

## Overall approach

My main goal was to keep the implementation simple enough to understand, but structured enough that it could evolve without having to rewrite everything.

I tried to avoid solving hypothetical problems while still separating the areas that are likely to change independently:

**UI → ShipmentForm → Validation + Payload → API**

This also makes the code easier to test. For example, validation can be tested independently without rendering the entire form, while the important end-to-end behaviour can be tested using the real DOM and mocked API boundaries.

Overall, I aimed for a balance between simplicity and maintainability rather than introducing abstractions just for the sake of having them.
