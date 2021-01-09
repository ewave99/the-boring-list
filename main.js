// My attempt at the Modular Design Pattern
let Items = (
    function () {
        // all these constants and variables are private
        const LIST_CONTAINER = document.getElementById ( 'list-container' );

        const CHECKBOX_UNCHECKED = "<input type='checkbox' />";
        const CHECKBOX_CHECKED = "<input type='checkbox' checked/>";

        // so we can have buttons that make function calls specific to the associated item
        const DELETE_BUTTON_PREFIX = `<input type="button" value="Delete" onclick="Items.deleteItem ( '`;
        const DELETE_BUTTON_SUFFIX = `' )" />`;

        let list = [];
        // used in the unique ID when an item is created
        const ITEM_ID_PREFIX = 'item-';
        let item_id_counter = -1;

        // METHODS ----------------------------------------------

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
                // displays the right checkbox
                let checkbox = item.completed ? CHECKBOX_CHECKED : CHECKBOX_UNCHECKED;

                let node = document.createElement ( 'li' );
                node.id = item.id;
                node.innerHTML = checkbox + item.text + DELETE_BUTTON_PREFIX + item.id + DELETE_BUTTON_SUFFIX;

                LIST_CONTAINER.appendChild ( node );
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

        return {
            createItem: createItem,
            display:    displayAll,
            deleteItem: deleteItem,
            clearAll:   clearAll,
            // only for debugging purposes
            printItems: () => { console.log ( list ); }
        }
    }
) ();


document.body.onload = function () {
    Items.createItem ( 'item 1'       );
    Items.createItem ( 'item 2', true );
    Items.createItem ( 'item 3'       );
    Items.createItem ( 'item 4'       );
    Items.createItem ( 'item 5', true );

    Items.display ();
}
