/* TODOS:
 * - Implement a method to set the item values in localStorage.
 * - Implement a method to check if any items are stored in localStorage. If
 *   there are, load them into the current set of items.
 */

/* here we declare an object which exports various public functions and contains
 * variables and private functions in a closure */
let Items = ( function () {
    /* DOM elements */

    /* <ul> element that contains all our items */
    const LIST_CONTAINER = document.getElementById ( 'list-container' );
    /* the <input type='text'> element that we type the next to-do item text
     * into */
    const ITEM_TEXT_INPUT = document.getElementById ( 'item-text-input' );

    /* Prefix to use in the generated ID for an item */
    const ITEM_ID_PREFIX = 'item-';

    /* This kind of functions like the autoincrement of a unique ID in a
     * database. In short, we increment this counter every time we create an
     * item to ensure all the items have unique IDs. */
    let item_id_counter = 0;

    /* Initialise the list of items */
    let items_list = [];

    function addItemFromEntryBox () {
        /* Get text value of the entry box and use it as the text value of a new
         * item. */

        /* Strip trailing whitespace (thus also preventing input of only
         * whitespace). */
        ITEM_TEXT_INPUT.value = ITEM_TEXT_INPUT
            .value
            .replace ( /^\s+/, '' )
            .replace ( /\s+$/, '' );

        /* if the entry box is not empty: */
        if ( ITEM_TEXT_INPUT.value !== '' ) {
            /* create a new item whose text-value is the value of the entry box
             */
            createItem ( ITEM_TEXT_INPUT.value );

            /* Delete the text the user has typed into the entry box */
            ITEM_TEXT_INPUT.value = '';
        }
    }

    function createItem ( text, completed = false ) {
        /* Initialise an item object containing information associated with the
         * item and push it to the list of items. Display the item on the page.
         */

        let id = ITEM_ID_PREFIX + item_id_counter;

        /* As mentioned earlier on, this makes sure the items have unique IDs */
        item_id_counter ++;

        /* create the object of information associated with the item */
        let item = {
            id : id,
            text : text,
            completed : completed
        };

        /* push the information object to the list of items */
        items_list.push ( item );

        /* save all the items into local storage */
        saveItemsIntoLocalStorage ();

        /* display the item on the page */
        displayItem ( item );
    }

    function displayAll () {
        /* walk through all the items in the list and display them */
        for ( item of items_list ) displayItem ( item );
    }

    function displayItem ( item ) {
        /* Accept the information object of an item. Create the DOM structure
         * to represent the item. Then append the DOM structure to the
         * pre-existing list-element in the DOM. Then tell the
         * SVG-checkbox-controller function to control the state of the item's
         * checkbox. */

        /* Even though it should be impossible, with the auto-intcrementing of
         * the ID numbers, for two items to have the same ID, this just adds an
         * extra safety net. */
        if ( document.getElementById ( item.id ) == null ) {
            /* create the DOM node for the item, with its complete structure of
             * sub-nodes. After this we are ready to push the item to the live
             * DOM. */
            let item_node = createDOMStructureForItem ( item );

            /* Push the item to the live DOM to make it visible on the page. */
            LIST_CONTAINER.appendChild ( item_node );

            /* Pass the id of the created checkbox of the item to the
             * SVG-checkbox-controller function. This ensures we are able to
             * actually use the checkbox, complete with all its fancy
             * animations. */
            SVGCheckbox.controlCheckbox (
                document.getElementById (
                    item.id + '-checkbox',
                    'checkmark'
                )
            );
        }
    }

    function createDOMStructureForItem ( item ) {
        /* Create various DOM elements needed to display the item and 'stitch'
         * them together. (The function calls are ordered in terms of
         * significance in the DOM hierarchy - nodes, then sub-nodes, then
         * sub-sub-nodes, etc. */

        let li_item_element = createLiItemForItem ( item );

        li_item_element.appendChild ( createCheckboxForItem ( item ) );

        let label_element = createLabelForItem ( item );
        label_element.appendChild ( createTextElementForItem ( item ) );

        li_item_element.appendChild ( label_element );

        li_item_element.appendChild ( createDeleteButtonForItem ( item ) );

        return li_item_element;
    }

    function createLiItemForItem ( item ) {
        let element = document.createElement ( 'li' );

        element.setAttribute ( 'id' , item.id );
        element.setAttribute ( 'class', 'item container' );

        return element;
    }

    function createCheckboxForItem ( item ) {
        let element = document.createElement ( 'input' );

        element.setAttribute ( 'type', 'checkbox' );
        element.setAttribute ( 'id', item.id + '-checkbox' );
        element.setAttribute ( 'name', item.id + '-checkbox' );

        if ( item.completed ) {
            element.setAttribute ( 'checked', '' );
        }

        return element;
    }

    function createTextElementForItem ( item ) {
        return document.createTextNode ( item.text );
    }

    function createLabelForItem ( item ) {
        let element = document.createElement ( 'label' );

        element.setAttribute ( 'class', 'checkbox-container' );
        element.setAttribute ( 'for', item.id + '-checkbox' );

        return element;
    }

    function createCheckmarkSpanForItem () {
        let checkmark_span_element = document.createElement ( 'span' );

        checkmark_span_element.setAttribute ( 'class', 'checkmark' );

        return checkmark_span_element;
    }

    function createDeleteButtonForItem ( item ) {
        let delete_button_element = document.createElement ( 'button' );

        let icon = document.createElement ( 'span' );

        delete_button_element.setAttribute ( 'type' , 'button' );
        delete_button_element.setAttribute (
            'onclick',
            `Items.deleteItem ( '${item.id}' )`
        );

        icon.setAttribute ( 'class', 'oi' );
        icon.setAttribute ( 'data-glyph', 'trash' );

        delete_button_element.appendChild ( icon );

        return delete_button_element;
    }

    function clearAll () {
        /* walk through all the items, deleting them one by one. */
        for ( { id } of items_list ) deleteItem ( id, save = false );

        saveItemsIntoLocalStorage ();
    }

    function deleteItem ( item_id, save = true ) {
        /* remove the item node from the DOM so it is no longer visible. */
        LIST_CONTAINER.removeChild ( document.getElementById ( item_id ) );

        /* filter out the item information object from the list so the list no
         * longer contains the associated object. */
        items_list = items_list.filter ( ({ id }) => id != item_id );

        if ( save ) {
            saveItemsIntoLocalStorage ();
        }
    }

    function checkboxCallback ( item_id, checked_state ) {
        let item_index = items_list.findIndex ( ({ id }) => id == item_id );

        items_list [ item_index ].completed = checked_state;

        saveItemsIntoLocalStorage ();
    }

    function saveItemsIntoLocalStorage () {
        if ( storageAvailable ( 'localStorage' ) ) {
            localStorage.setItem (
                "items_list",
                JSON.stringify (
                    items_list.map (
                        ({ text, completed }) => ({
                            text : text,
                            completed : completed
                        })
                    )
                )
            );
        }
    }

    function getItemsFromLocalStorage () {
        items_list = [];

        if ( storageAvailable ( 'localStorage' ) ) {
            if ( "items_list" in localStorage ) {
                let raw_list = JSON.parse (
                    localStorage.getItem ( "items_list" )
                );

                for ( { text, completed } of raw_list ) {
                    createItem ( text, completed );
                }
            }
        }
    }

    function storageAvailable ( type ) {
        /* this function was obtained off the Mozilla website */

        var storage;
        try {
            storage = window [ type ];
            var x = '__storage_test__';
            storage.setItem ( x, x );
            storage.removeItem ( x );
            return true;
        }
        catch ( e ) {
            return e instanceof DOMException && (
                    // everything except Firefox
                    e.code === 22 ||
                    // Firefox
                    e.code === 1014 ||
                    // test name field too, because code might not be present
                    // everything except Firefox
                    e.name === 'QuotaExceededError' ||
                    // Firefox
                    e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
                ) &&
                // acknowledge QuotaExceededError only if there's something already stored
                ( storage && storage.length !== 0 );
        }
    }

    return {
        createItem : createItem,
        display : displayAll,
        deleteItem : deleteItem,
        clearAll : clearAll,
        addNewItem : addItemFromEntryBox,
        checkboxCallback : checkboxCallback,
        init : getItemsFromLocalStorage,
        // only for debugging purposes
        // printItems: () => { console.log ( items_list ); }
    }
} ) ();

document.body.onload = function () {
    /* Listen for keyup events. If the keycode corresponds to the Enter key,
     * add the item to the to-do list. */
    document
        .getElementById ( 'item-text-input' )
        .addEventListener ( 'keyup', event => {
            /* keycode 13 is Enter */
            if ( event.keyCode === 13 ) entryBoxCallback ();
        } );

    Items.init ();

    /* run the 'main' function to demonstrate the program's functionality, */
    //main ();
}

function entryBoxCallback () {
    Items.addNewItem ();
}

function main () {
    /* In production we wouldn't have this 'main' function. This function just
     * demonstrates the program's functionality. */
    Items.createItem ( 'item 1' );
    Items.createItem ( 'item 2', true );
    Items.createItem ( 'item 3' );
    Items.createItem ( 'item 4' );
    Items.createItem ( 'item 5', true );

    Items.display ();
}

