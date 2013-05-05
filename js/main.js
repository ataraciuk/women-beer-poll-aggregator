$(function() {
	var discriminator = {position: 1, values:['Female', 'Male']};
	var aggregator = [
		{position:2, values:['I prefer light beer', 'I prefer stronger beers']},
		{position:4, values:['I think women tend to prefer light beer', ['I think women tend to prefer stronger beers', 'I think there is no trend']]},
		{position:5, values:['Yes', 'No']}
	];
	$.get('https://docs.google.com/spreadsheet/pub?key=0As8vMBi1vd_odDN4TV9sMVNFOTVFUW9Bam16blVubEE&single=true&gid=0&output=csv',
		function(data){
			var answers = $.csv.toArrays(data);
			console.log(answers);
			for(var i = 0; i < aggregator.length; i++) {
				var row = aggregator[i];
				row.results = [];
				for(var j = 0; j < row.values.length; j++) {
					row.results[j] = {};
					for(var k = 0; k < discriminator.values.length; k++) {
						row.results[j][discriminator.values[k]] = 0;
					}
				}
			}
			for(var i = 1; i < answers.length; i++) {
				var row = answers[i];
				var discVal = row[discriminator.position];
				for(var j = 0; j < aggregator.length; j++) {
					var question = aggregator[j];
					var answer = row[question.position];
					for(var k = 0; k < question.values.length; k++) {
						var value = question.values[k];
						var aggregated = question.results[k];
						if(typeof value === 'object') {
							for(var l = 0; l < value.length; l++) {
								if(value[l] === answer) {
									aggregated[discVal]++;
								}
							}
						} else if(value === answer) {
							aggregated[discVal]++;
						}
					}
				}
			}
			var container = $('#container');
			for(var i = 0; i < aggregator.length; i++) {
				var question = aggregator[i];
				var mainUL = $('<ul class="main-ul" id="main-ul-'+question.position+'"></ul>');
				for(var j = 0; j < discriminator.values.length; j++) {
					var total = 0;
					var discriminated = discriminator.values[j];
					var mainLI = $('<li class="main-li main-li-'+discriminated+'">'+discriminated+'</li>');
					var discUL = $('<ul class="disc-ul"></ul>');
					for(var k = 0; k < question.values.length; k++) {
						total += question.results[k][discriminated];
					}
					for(var k = 0; k < question.values.length; k++) {
						var percentage = total === 0 ? 0 : 100 * question.results[k][discriminated] / total;
						discUL.append('<li class="disc-li">'+percentage+'</li>');
					}
					mainUL.append(mainLI.append(discUL));
				}
				container.append(mainUL);
			}
			console.log(aggregator);
		}
	);
});