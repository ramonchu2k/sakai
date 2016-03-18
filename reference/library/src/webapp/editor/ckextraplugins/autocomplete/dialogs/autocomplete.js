/**
 * 
 */
url='/library/editor/ckextraplugins/autocomplete/';

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

function callAutoNewComplete(data,params){
	var autoNewInput=params;
	$("#"+autoNewInput).autocomplete({
		lookup: function(query, done){
			var result = { suggestions: $.map(data,function(data){
							console.log('data:'+data.descriptionString[0].value);
							return (data.id.concat(data.descriptionString[0].value).toString().includes(query)) ? {
								value: data.id,
								data: data.descriptionString[0].value,
								lang: data.lang
							} : null;})
						};
			done(result);
		},
		minChars: 3,
		onSelect: function (suggestions) {
			$('#autoCompleteResult').append('<p><strong>' + suggestions.value + '</strong> : ' + suggestions.data + '['+suggestions.lang+']</p>');
			return false;
		}
	});
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
                        label:          'Introduzca el texto a buscar de la competencia2',
                        id:             'autoCompleteNewInput'
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
        	var autoInput = dialog.getContentElement('autoTab','autoCompleteNewInput').getInputElement().getId();
        	$.getScript(url+"lib/jquery.autocomplete.min.js").done(function(script, textStatus){       		   
            	getElements('https://giis.inf.um.es:8443/RepositorioCompetencias/services/restapi/repository/competency/?callback=?',callAutoNewComplete,autoInput);
            });
        	
        }
    };
}); 