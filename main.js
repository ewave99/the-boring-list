const LIST_CONTAINER = document.getElementById ( 'list-container' );

const CHECKBOX_UNCHECKED = "<input type='checkbox' />";
const CHECKBOX_CHECKED = "<input type='checkbox' checked/>";

// so we can have buttons that make function calls specific to the associated item
const DELETE_BUTTON_PREFIX = `<input type="button" value="Delete" onclick="Items.deleteItem ( '`;
const DELETE_BUTTON_SUFFIX = `' )" />`;

// My attempt at the Modular Design Pattern
let Items = (
    function () {
        // These variables are private
        let list = [];
        // used in the unique ID when an item is created
        const ITEM_ID_PREFIX = 'item-';
        let item_id_counter = -1;

        // METHODS ----------------------------------------------

        function createItem ( text, completed = false ) {
            // makes sure the items have unique IDs
            let id = ITEM_ID_PREFIX + ( ++ item_id_counter );

            function display () {
                // displays the right checkbox
                let checkbox = completed ? CHECKBOX_CHECKED : CHECKBOX_UNCHECKED;

                let node = document.createElement ( 'li' );
                node.id = id;
                node.innerHTML = checkbox + text + DELETE_BUTTON_PREFIX + id + DELETE_BUTTON_SUFFIX;

                LIST_CONTAINER.appendChild ( node );
            }

            // FUTURE: could factor 'display' out as a main method of the Items module
            list.push (
                {
                    id: id,
                    text: text,
                    completed: false,
                    display: display
                }
            );
        }

        function deleteItem ( item_id ) {
            LIST_CONTAINER.removeChild ( document.getElementById ( item_id ) );

            list = list.filter ( ({ id }) => id != item_id );
        }

        function displayAll () {
            for ( item of list ) item.display ();
        }

        return {
            createItem: createItem,
            displayAll: displayAll,
            deleteItem: deleteItem,
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

    Items.displayAll ();
}
