// My attempt at the Modular Design Pattern
let Items = (
    function () {
        // all these constants and variables are private
        const LIST_CONTAINER = document.getElementById ( 'list-container' );
        const ITEM_TEXT_INPUT = document.getElementById ( 'item-text-input' );

        let list = [];
        // used in the unique ID when an item is created
        const ITEM_ID_PREFIX = 'item-';
        let item_id_counter = -1;

        // METHODS ----------------------------------------------

        //     DOM METHODS --------------------------------------

        function createDOMStructureForItem ( item ) {
            let list_item_element = createListItemForItem ( item );
            let label_element     = createLabelForItem    ( item );

            label_element.appendChild ( createTextElementForItem   ( item ) );
            label_element.appendChild ( createCheckboxForItem      ( item ) );
            // FUTURE: factor this out as a constant
            label_element.appendChild ( createCheckmarkSpanForItem (      ) );

            list_item_element.appendChild ( label_element                      );
            list_item_element.appendChild ( createDeleteButtonForItem ( item ) );

            return list_item_element;
        }

        function createListItemForItem ( item ) {
            let element = document.createElement ( 'li' );

            element.setAttribute ( 'id'   ,  item.id  );
            element.setAttribute ( 'class', 'item'    );

            return element;
        }

        function createTextElementForItem ( item ) {
            return document.createTextNode ( item.text );
        }

        function createLabelForItem ( item ) {
            let element = document.createElement ( 'label' );

            element.setAttribute ( 'class', 'checkbox-container' );

            return element;
        }

        function createCheckboxForItem ( item ) {
            let element = document.createElement ( 'input' );

            element.setAttribute ( 'type', 'checkbox');
            if ( item.completed ) {
                element.setAttribute ( 'checked', '' );
            }

            return element;
        }

        function createCheckmarkSpanForItem () {
            let checkmark_span_element = document.createElement ( 'span' );

            checkmark_span_element.setAttribute ( 'class', 'checkmark' );

            return checkmark_span_element;
        }

        function createDeleteButtonForItem ( item ) {
            let delete_button_element = document.createElement ( 'input' );

            delete_button_element.setAttribute ( 'type'   , 'button'                            );
            delete_button_element.setAttribute ( 'value'  , 'Delete'                            );
            delete_button_element.setAttribute ( 'onclick', `Items.deleteItem ( '${item.id}' )` );

            return delete_button_element;
        }

        //     METHODS FOR ITEMS --------------------------------

        function createItem ( text, completed = false ) {
            // makes sure the items have unique IDs
            let id = ITEM_ID_PREFIX + ( ++ item_id_counter );

            let item = {
                id: id,
                text: text,
                completed: completed
            };

            list.push ( item );

            displayItem ( item );
        }

        function displayItem ( item ) {
            // prevents having elements with the same id
            if ( document.getElementById ( item.id ) == null ) {
                let item_node = createDOMStructureForItem ( item );

                LIST_CONTAINER.appendChild ( item_node );
            }
        }

        function deleteItem ( item_id ) {
            LIST_CONTAINER.removeChild ( document.getElementById ( item_id ) );

            list = list.filter ( ({ id }) => id != item_id );
        }

        function displayAll () {
            for ( item of list ) displayItem ( item );
        }

        function clearAll () {
            for ( { id } of list ) deleteItem ( id );
        }

        function getTextAndCreateNewItem () {
            // strip trailing whitespace (thus also preventing input of only whitespace)
            ITEM_TEXT_INPUT.value = ITEM_TEXT_INPUT.value.replace ( /^\s+/, '' )
                                                         .replace ( /\s+$/, '' );
            // prevent items with no text
            if ( ITEM_TEXT_INPUT.value !== '' ) {
                createItem ( ITEM_TEXT_INPUT.value );

                ITEM_TEXT_INPUT.value = '';
            }
        }

        return {
            createItem: createItem,
            display:    displayAll,
            deleteItem: deleteItem,
            clearAll:   clearAll,
            addNewItem: getTextAndCreateNewItem,
            // only for debugging purposes
            printItems: () => { console.log ( list ); }
        }
    }
) ();


document.body.onload = function () {
    document.getElementById ( 'item-text-input' )
            .addEventListener ( 'keyup', event => {
                if ( event.keyCode === 13 ) Items.addNewItem ();
            } );
    main ();
}

function main () {
    Items.createItem ( 'item 1'       );
    Items.createItem ( 'item 2', true );
    Items.createItem ( 'item 3'       );
    Items.createItem ( 'item 4'       );
    Items.createItem ( 'item 5', true );

    Items.display ();
}
