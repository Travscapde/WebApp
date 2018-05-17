var interestsShown = false;

function openInterestSeletion(preSelectedInterests, number, canExit, callback) {
	console.log(preSelectedInterests);
	history.pushState(null, null, "interests.html");
	window.addEventListener("popstate", function(e) {
	    closeInterestSeletion();
	});

	if(canExit == false) {
		$('#button-close-modal').css('display', 'none');
	}

	var selectedInterests = [];
	$('#select-interest-modal').css('display', 'block');

	if(interestsShown) {
		console.log("alradt shown");
		var checkboxes = $('#interest-list').find(':checkbox');
		checkboxes.each(function(idx) {
			if($( this ).prop('checked')  == true) {
				$( this ).prop('checked', false);
			}
		});
		populatePreSelectedInterests(preSelectedInterests);

		return;
	}

	var interestList = JSON.parse(sessionStorage.getItem('interestList'))['interests'];
	//var interestList = [{'interest':'Hiking'}, {'interest':'Biking'}, {'interest':'Diving'},{'interest':'Waterfall'}, {'interest':'Landscape'}, {'interest':'Aerial View'}];
	var container = $('#interest-list');
	interestList.forEach(function(element) {
		var item = $('<div />', {class: 'interest-item check-container'});
		var label = $('<label />');
		label.attr('for', element.interest);
		var span = $('<span />', {class: 'tag'});
		span.html(element.interest);
		var separators = [' ', '/'];
		$('<input />', { type: 'checkbox', id: element.interest.split(new RegExp(separators.join('|'), 'g'))[0], value: element.interest, class:'check'}).appendTo(item);
		label.appendTo(item);
		span.appendTo(item);
		item.click(function() {
			console.log(element.interest.split(new RegExp(separators.join('|'), 'g'))[0].length);
			var checkBox = $(this).find('#'+element.interest.split(new RegExp(separators.join('|'), 'g'))[0]);
			console.log(checkBox.prop('checked'));
			/*if(!checkBox.attr("checked")) {
				$(this).css('background', '#FF0000');
			} else {
				$(this).css('background', '#0000FF');
			}*/
			checkBox.prop("checked", !checkBox.prop("checked"));
			if (number == 1) {
				returnInterests();
			}
		});
		item.appendTo(container);

	});

	//$('<button />', {text: 'Done', id: 'select-return'}).appendTo(container);
	interestsShown = true;

	populatePreSelectedInterests(preSelectedInterests);

	$('#interest-select-done').click(returnInterests);


	if(number == 1) {
		$('.check').change(function() {
			console.log("changed");
			returnInterests();
		});

	}


	function returnInterests() {
		selectedInterests = [];
		var checkboxes = container.find(':checkbox');
		checkboxes.each(function(idx) {
			if($( this ).prop('checked')  == true) {
				selectedInterests.push($( this ).val());
				//console.log($( this ).val());
			}
		});

		if(canExit == false) {
			if(selectedInterests.length < 3) {
				window.alert("Please selecet a minimum of 3 interests");
				return;
			}
		}

		if(selectedInterests.length > number) {
			window.alert("You can selecet upto " + number + " interests");
		} else {
			callback(selectedInterests);
			history.back();
		}
	}


}



function populatePreSelectedInterests(preSelectedInterests) {
	console.log(preSelectedInterests);
	if(preSelectedInterests) {
	  preSelectedInterests.forEach(function(element) {
	  	var separators = [' ', '/'];
		var checkBox = $('#'+element.split(new RegExp(separators.join('|'), 'g'))[0]);
	  	console.log(checkBox);
		checkBox.prop("checked", true);

	    /*var selectedIdx = interestList.findIndex(function(interestObj) {
	      return (interestObj.interest==element)
	    })
	    console.log(typeof selectedIdx + " " + selectedIdx + " " +  $("#"+selectedIdx));
	    $("#"+selectedIdx).prop('checked', true);*/
	  });
	}
}




function closeInterestSeletion() {
	//selectedInterests = [];
	//$('#interest-list').empty();
	$('#select-interest-modal').css('display', 'none');
}



