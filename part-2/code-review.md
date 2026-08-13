# Code review

## shipments.js

- document.querySelector('.loading').remove() is used before the calls which makes it disappear even before the calls and I don't see initializing again 
- axios calls for  `/shipping-methods` & `/shipments` may create a race condition. What if in slow 3G network, the order of completion wouldn't be known. I can suggest to use `promise.all`
- both axios request is missing catch block to catch the error.
- hardcoding exact url `localhost:3000...`. If pushed to any other env, it will still point to localhost. Base URL and env details should be placed in the config file.
- there is a comment `makes a shipment object for sending to the backend` but then also creates a wrapper. This coupling breaks the code reusability. The logic should be decoupled.
- **NOT A PRODUCTION ISSUE** but the data sorting on date time seems unnecessary.
- if the shipments and/or methods is an [], the list shows undefined values. For production, it is necessary to handle this case.
- createShipment() sets innerHTML. what if the data is not just string? what happens if the data is html itself? e.g. s.name returned `<span>Ishita</span>`
- ` for (var i = 0; i <= methods.length; i++) {
    if (methods[i] && methods[i].id === s.shipping_method_id) {
      method_name = methods[i].name
    }
  }` seems inefficient for slower device. I would prefer an object mapping instead of looping
- var is not preferred/used in modern js. Also, `i` has duplicate declaration

## shipments.html

- HTML tag missing lang attribute
- Primary title of the page is in `<span />` tag instead of header tag
- `<Loading />` is not a valid HTML tag
- span has role=button which shows accessibility issue. Better to use button instead of span

## shipments.test.js
- `global.document = dom.window.document` in beforeAll wouldnt be global to all tests. If we want independent setup, afterEach should be used to clean up
- `.toDateString()` will use local DateTime conflicting with the server time if they are not in the same timezone
- Triple `await new Promise(setImmediate)` statements instead of using vitest polling utilities
- **NOT A PRODUCTION ISSUE** objects methods and mockShipment are mutable 
- no negative or bad flow tests
- for the skipped test, the test was skipped, so it wasn’t running initially. I enabled it locally and it passes for me, so I couldn’t reproduce the reported issue; however, the multiple `setImmediate` calls make the test somewhat fragile.
