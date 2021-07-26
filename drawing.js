/* Define the namespace 'SVGCheckbox', containing methods to control the
 * animations of the checkboxes. These methods were taken off a tutorial to
 * create animated checkboxes so I need to work out what exactly the variable
 * names mean (e.g. 'def'). */
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

            path .getBoundingClientRect ()

            path .style .transition = path .style .WebkitTransition
                                    = path .style .MozTransition
                                    = 'stroke-dashoffset '
                                        + anim_def .speed
                                        + 's '
                                        + anim_def .easing
                                        + ' '
                                        + i * anim_def .speed
                                        + 's';

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

