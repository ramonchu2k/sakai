/**
 * 
 */

function autoComplete(data,id){
	$("#"+id).autocomplete({
		lookup: data,
		minChars: 3,
		transformResult: function(response) {
	        return {
	            suggestions: $.map(response.myData, function(dataItem) {
	                return { value: dataItem.valueField, data: dataItem.dataField };
	            })
	        };
	    },
		onSelect: function (ui) {
			$('#autoCompleteResult').append('<p><strong>' + ui.item.id + '</strong> : ' + ui.item.value + '['+ui.item.lang+']</p>');
	    	return false;
		}
	});
}
function getElements(url,callback,params){
	$.getJSON('https://jsonp.afeld.me/?callback=?&url='+encodeURIComponent('https://giis.inf.um.es:8443/RepositorioCompetencias/services/restapi/auth/login.json?user=sakai@um.es&pw=admin'), function(data){
	    ticket = data.ticket;
		$.getJSON('https://jsonp.afeld.me/?callback=?&url='+encodeURIComponent(url+'&ticket='+data.ticket), function(data){
				callback(data,params);
			});
		});
}

function callByType(data, params){
	var type = params;
	$('#typeResult').append('<ul id="typeListResult"/>');
	$.each(data,function(index,item){
		//
		if(item.title[0].value === type){
			$( 'ul', '#typeResult').append('<li class="ui-widget-content"><p><strong>' + item.id + '</strong> : ' + item.descriptionString[0].value + '['+item.lang+']</p></li>');
		}
    });
    $('#typeListResult').selectable();
}

function callAutoComplete(data,params){
	var response=params[0];
	var request=params[1];
	return response($.map(data, function (data) {
    	return (data.id.concat(data.descriptionString[0].value).toString().includes(request.term)) ? {
            id: data.id,
            value: data.descriptionString[0].value,
            lang: data.lang
        } : null;
    }));
}

CKEDITOR.dialog.add( 'autocompleteDialog', function ( editor ) {
    return {
        title:          'Insertar competencias',
        resizable:      CKEDITOR.DIALOG_RESIZE_BOTH,
        minWidth:       500,
        minHeight:      400,
        contents: [
            {
                id:         'autoTab',
                label:      'Busqueda por texto',
                title:      'Busqueda por texto',
                elements: [
                    {
                        type:           'text',
                        label:          'Introduzca el texto a buscar de la competencia',
                        id:             'autoCompleteInput'
                    },
                    {
                        type: 'html',
                        html: '<div id="autoCompleteResult"></div>'
                    }
                   ]
            },
            {
            	id:			'typeTab',
            	label:		'Búsqueda por Tipo',
            	title:		'Búsqueda por Tipo',
            	elements:[
							{
							    type: 'select',
							    id: 'typeInput',
							    label: 'Tipo de Competencia:',
							    items: [ [ 'BÁSICA','BASICA' ], [ 'TITULACIÓN','TITULACION' ], [ 'ASIGNATURA','ASIGNATURA' ] ],
							    inputStyle: 'size: 50px;length:60px;',
							    'default': 'TITULACIÓN',
							    onChange: function( api ) {
							    	$('#typeResult').html("");
							    	getElements('https://giis.inf.um.es:8443/RepositorioCompetencias/services/restapi/repository/competency/?callback=?',callByType,api.data.value);
							    }
							},
		                    {
		                        type: 'html',
		                        html: '<div id="typeResult"></div>'
		                    }
            	]
            }
        ],
        onOk : function(){
        	if(this._.currentTabId === 'typeTab'){
        		this.getParentEditor().insertHtml($('#typeListResult .ui-selected').html());
        	}else if(this._.currentTabId === 'autoTab'){
        		this.getParentEditor().insertHtml($('#autoCompleteResult').html());
        	}
        	$('#autoCompleteResult').html("");
        	$('#typeResult').html("");
        },
        onCancel : function(){
        	$('#autoCompleteResult').html("");
        	$('#typeResult').html("");
        },
        onLoad : function() {
        	var dialog = this;
        	var autoInput = dialog.getContentElement('autoTab','autoCompleteInput').getInputElement().getId();
        	$.getScript("../lib/jquery.autocomplete.min.js", function(){       		   
            	getElements('https://giis.inf.um.es:8443/RepositorioCompetencias/services/restapi/repository/competency/?callback=?',autoComplete,autoInput)
            });        	
        }
    };
});