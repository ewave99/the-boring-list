const LIST_CONTAINER = document.getElementById ( 'list-container' );
const CHECKBOX = "<input type='checkbox' />"

let Items = (
    function () {
        let list = [];
        let reference_counter = -1;

        function createItem ( text, completed = false ) {
            let id = 'item-' + ( ++ reference_counter );

            list.push (
                {
                    id: id,
                    text: text,
                    completed: false,
                    display: function () {
                        let node = document.createElement ( 'li' );
                        node.id = id;
                        node.innerHTML = `${CHECKBOX}${text}<input type='button' value='Delete' onclick="Items.deleteItem ( '${id}' )" />`

                        LIST_CONTAINER.appendChild ( node );
                    }
                }
            );

            return id;
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
            printItems: () => { console.log ( list ); }
        }
    }
) ();


document.body.onload = function () {
    Items.createItem ( 'item 1' );
    Items.createItem ( 'item 2' );
    Items.createItem ( 'item 3' );
    Items.createItem ( 'item 4' );
    Items.createItem ( 'item 5' );

    Items.displayAll ();
}
