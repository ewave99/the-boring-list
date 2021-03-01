// My attempt at the Modular Design Pattern
let Items = (
    function () {
        // all these constants and variables are private
        const LIST_CONTAINER  = document.getElementById ( 'list-container' );
        const ITEM_TEXT_INPUT = document.getElementById ( 'item-text-input' );

        let list = [];

        // used in the unique ID when an item is created
        const ITEM_ID_PREFIX = 'item-';
        let item_id_counter = -1;

        // METHODS ----------------------------------------------

        //     DOM METHODS --------------------------------------

        function createDOMStructureForItem ( item ) {
            let li_item_element  = createLiItemForItem ( item );

            li_item_element.appendChild ( createCheckboxForItem      ( item ) );

            // FUTURE: factor this out as a constant
            let label_element     = createLabelForItem    ( item );
            label_element.appendChild ( createTextElementForItem   ( item ) );

            li_item_element.appendChild ( label_element                      );
            li_item_element.appendChild ( createDeleteButtonForItem ( item ) );

            return li_item_element;
        }

        function createLiItemForItem ( item ) {
            let element = document.createElement ( 'li' );

            element.setAttribute ( 'id'   ,  item.id            );
            element.setAttribute ( 'class', 'item container'    );

            return element;
        }

        function createCheckboxForItem ( item ) {
            let element = document.createElement ( 'input' );

            element.setAttribute ( 'type', 'checkbox'             );
            element.setAttribute ( 'id',    item.id + '-checkbox' )
            element.setAttribute ( 'name',  item.id + '-checkbox' )

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

            element.setAttribute ( 'class', 'checkbox-container'   );
            element.setAttribute ( 'for',    item.id + '-checkbox' );

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

                LIST_CONTAINER .appendChild ( item_node );

                SVGCheckbox .controlCheckbox (
                    document .getElementById (
                        item.id + '-checkbox',
                        'checkmark'
                    )
                );
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

let SVGCheckbox = ( function () {
    let path_defs = {
        checkmark : [
            'M16.667,62.167c3.109,5.55,7.217,10.591,10.926,15.75 c2.614,3.636,5.149,7.519,8.161,10.853c-0.046-0.051,1.959,2.414,2.692,2.343c0.895-0.088,6.958-8.511,6.014-7.3 c5.997-7.695,11.68-15.463,16.931-23.696c6.393-10.025,12.235-20.373,18.104-30.707C82.004,24.988,84.802,20.601,87,16'
        ]
    };

    let anim_defs = {
        checkmark : {
            speed  :  0.2,
            easing : 'ease-in-out'
        }
    };

    function createSVGEl ( def ) {
        let svg = document .createElementNS ( "http://www.w3.org/2000/svg", "svg" );

        if ( def ) {
            svg .setAttributeNS (
                 null,
                'viewBox',
                 def .viewBox
            );
            svg .setAttributeNS (
                 null,
                'preserveAspectRatio',
                 def .preserveAspectRatio
            );
        }
        else {
            svg .setAttributeNS ( null, 'viewBox', '0 0 100 100' );
        }

        svg .setAttribute ( 'xmlns', 'http://www.w3.org/2000/svg' );

        return svg;
    }

    function controlCheckbox ( el, type, svg_def ) {
        let svg = createSVGEl ( svg_def );

        el .parentNode .appendChild ( svg );
        if ( el .checked ) {
            draw ( el, type );
        }
        else {
            reset ( el );
        }

        el .addEventListener (
            'change',
            () => {
                if ( el .checked ) {
                    draw ( el, type );
                }
                else {
                    reset ( el );
                }
            }
        );
    }

    function draw ( el, type ) {
        let paths = [];
        let path_def, anim_def;
        let svg = el .parentNode .querySelector ( 'svg' );
        console.log ( el );
        
        path_def = path_defs .checkmark;
        anim_def = anim_defs .checkmark;

        paths.push (
            document .createElementNS (
                'http://www.w3.org/2000/svg',
                'path'
            )
        );

        if ( type === 'cross' || type === 'list' ) {
            paths .push (
                document .createElementNS (
                    'http://www.w3.org/2000/svg',
                    'path'
                )
            );
        }

        for ( var i = 0, len = paths .length; i < len; ++ i ) {
            let path = paths [ i ];

            svg .appendChild ( path );

            path .setAttributeNS ( null, 'd', path_def [ i ] ) ;
            
            let length = path .getTotalLength ();

            path .style .strokeDasharray = length + ' ' + length;

            if ( i === 0 ) {
                path .style .strokeDashoffset = Math.floor ( length ) - 1;
            }
            else {
                path .style .strokeDashoffset = length;
            }

            // Trigger a layout so styles are calculated, and the browser
            // picks up the starting position before animating
            path .getBoundingClientRect ()
            // Define our transition
            path .style .transition = path .style .WebkitTransition
                                    = path .style .MozTransition
                                    = 'stroke-dashoffset '
                                        + anim_def .speed
                                        + 's '
                                        + anim_def .easing
                                        + ' '
                                        + i * anim_def .speed
                                        + 's';
            // Go!
            path .style .strokeDashoffset = '0';
        }
    }

    function reset ( el ) {
        Array .prototype .slice .call (
            el .parentNode .querySelectorAll (
                'svg > path'
            )
        ) .forEach (
            ( el ) => {
                el .parentNode .removeChild ( el );
            }
        );
    }

    return {
        controlCheckbox: controlCheckbox,
        draw:            draw
    };
} ) ();

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

