
(function($){
    $.widget( "ui.combobox", $.ui.autocomplete,{
            options: {
            /* override default values here */
            minLength: 2,
            /* the argument to pass to ajax to get the complete list */
            ajaxGetAll: {get: "all"}
            },
            _create: function(){
            if (this.element.is("SELECT")){
            this._selectInit();
            return;
            }
            $.ui.autocomplete.prototype._create.call(this);
            var input = this.element;
            input.addClass( "ui-widget ui-widget—content ui—corner—left" );

            this.button = $( "<button type='button'>&nbsp;</button>" )
            .attr( "tabIndex", -1 )
            .attr( "title", "Show All Items" )
            .insertAfter( input )
            .button({
                icons: { primary: "ui-icon-triangle-l-s" },
                text:false
            })

            .removeClass( "ui-corner-all" )
            .addClass( "ui—corner-right ui—button—icon" )
            .click(function(event) {
            // close if already visible *
                if ( input.combobox( "widget" ).is( ":visible" ) ) { 
                    input.combobox( "close" );
                    return;
                }
            

        // when user clicks the show all button, we display the cached full menu
        var data = input.data("combobox");
            clearTimeout( data.closing );
            if (!input.isFullMenu){
                data._swapMenu();
                input.isFullMenu = true;
            }
        /* input/select that are initially hidden (display=none, i.e. second level menus),
        will not have position cordinates until they are visible. */

        input.combobox( "widget" ).css( "display", "block" )
        .position($.extend({ of: input },
            data.options.position
            ));

        input.focus();
        data._trigger( "open" );
        });

        /* to better handle large lists, put in a queue and process sequentially */

        $(document).queue(function(){ 
            var data = input.data("combobox");

        if ($.isArray(data.options.source)){
            S.ui.combobox.prototype._renderFullMenu.call(data, data.options.source
        );
        }else if (typeof data.options.source === "string") {
            $.getJSON(data.options.source, data.options.ajaxGetAll , function(
        source){

            S.ui.combobox.prototype._renderFullMenu.call(data, source);
            });
        }else{
        $.ui.combobox.prototype._renderFullMenu.call(data, data.source());
                }
            });
        },
        /* initialize the full list of items, this menu will be reused whenever the user
        clicks the show all button */

        _renderFullMenu: function(source){
            var self = this,
                input = this.element,
                ul = input.data( "combobox" ).menu.element,
                lis = [];
            source = this._normalize(source);

            input.data( "combobox" ).menuAll = input.data( "combobox" )
        .menu.element.clone
        (true).appendTo("body");

        for(var i=0; i<source.length; i++){
            lis[i] = "<li class=\"ui—menu—item\" role=\"menuitem\"><a class=\"ui-corner-all\" tabindex=\"—l\">"+source[i].label+"</a></li>";
        }

            ul.append(lis.join(""));
            this._resizeMenu();
            // setup the rest of the data, and event stuff

            setTimeout(function(){
                self._setupMenuItem.call(self, ul.children("li"), source );
            }, 0);
            input.isFullMenu = true;
        },
            /* incrementally setup the menu items, so the browser can remains responsive
            processing thousands of items */

            _setupMenuItem: function( items, source ){
                var self = this,
                itemsChunk = items.splice(0, 500),
                sourceChunk = source.splice(0, 500); 
            for(var i=0; i<itemsChunk.length; i++){ 
                $(itemsChunk[i])
                .data( "item.autocomplete", sourceChunk[i])

            .mouseenter(function( event ) {
                self.menu.activate( event, $(this));
            })

            .mouseleave(function() {
                self.menu.deactivate();
            });
        }
            if (items.length > 0){
                setTimeout(function(){
                    self._setupMenuItem.call(self, items, source );
                }, 0);
            }else{ // renderFullMenu for the next combobox.
                $(document).dequeue();
            }
        },
            /* overwrite. make the matching string bold */
        _renderltem: function( ul, item ) {
            var label = item.label.replace( new RegExp(
                "(?![^&;]+;) (?!<[^<>]*) (" + $.ui.autocomplete.escapeRegex(this.term) + ") (?![^<>]*>) (?![^&;]+;)", "gi"), "<strong>$1</strong>" ); 
            return $( "<li></li>" )

            .data( "item.autocomplete", item )
            .append( "<a>" + label + "</a>" )
            .appendTo( ul );
        },

        /* overwrite. to cleanup additional stuff that was added */
            destroy: function() {
                if (this.element.is("SELECT")){
                    this.input.remove();
                    this.element.removeData().show();
                    return;
                }
            }
});
