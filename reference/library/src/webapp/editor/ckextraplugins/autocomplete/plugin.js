/**
 * Auto complete plugin using restful service
 */

CKEDITOR.plugins.add( 'autocomplete', {
	//icons: 'http://avenue.mcmaster.ca/help/instructor/graphics/icons/competencies_icon.gif',
    init: function( editor ) {
    	CKEDITOR.document.appendStyleSheet(CKEDITOR.getUrl(CKEDITOR.plugins.getPath('autocomplete') + 'css/autocomplete.css'));
        editor.addCommand( 'autocomplete', new CKEDITOR.dialogCommand( 'autocompleteDialog' ) );
        editor.ui.addButton( 'Autocomplete', {
            label: 'Insertar Competencias',
            command: 'autocomplete',
            icon: 'http://avenue.mcmaster.ca/help/instructor/graphics/icons/competencies_icon.gif',
            toolbar: 'insert,100'
        });
        CKEDITOR.dialog.add( 'autocompleteDialog', this.path + 'dialogs/autocomplete.js' );
    }
});