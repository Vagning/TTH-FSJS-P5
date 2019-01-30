$(document).ready(function() {

	//RandomUser API parameters as object which can be passed into the api call
	const apiParameters = {
		results: 12,
		nat: "au,ca,gb,ie,us",
		inc: "picture,name,email,location,phone,dob"
	}

	//Empty global array for storing the api results
	let resultArray =[];

	//Create and append search box to the DOM inside the .search-containter div.
	$(".search-container").append(`
		<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
    </form>
	`); 

	//Create and instert modal in the DOM after the gallery div
	$(`<div class="modal-container" style="display:none;">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
              <h3 id="name" class="modal-name cap">name</h3>
              <p class="modal-text">email</p>
              <p class="modal-text cap">city</p>
              <hr>
              <p class="modal-text">(555) 555-5555</p>
              <p class="modal-text cap">123 Portland Ave., Portland, OR 97204</p>
              <p class="modal-text">Birthday: 10/21/2015</p>
          </div>
      </div>
      <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    	</div>
		</div>`).insertAfter("#gallery");


	//Ajax call for getting all "employees" from the randomUser API.
	$.ajax({
	  url: 'https://randomuser.me/api/',
	  data: apiParameters,
	  dataType: 'json',
	  success: function(data) {
	  	//Setting the resultArray to contain the results from the API call
	  	resultArray = data.results;
	  	//Use result array as input for the createEmplyeeCards function.
			createEmployeeCards(resultArray);

			//After cards have been append add the on click functionality of opening the modal
			$(".card").click(function(event) {
				//Set the cards index from the "data-index" attribute in order to pass it into the showModal function which will display the modal with the correct information.
				const currentCardIndex = $(event.target).closest('.card').attr("data-index");
				//execute showModal function for the employee with the current card index.
				showModal(currentCardIndex, resultArray);

			});
	  }
	});

	//Hide modal when clicking on the dismiss button or the faded background.
	//Background click
	$(".modal-container").click(function(event) {
		//Check if the click element is the background and not any of the other elements in the modal. If it is the background then hide modal.
		if ($(event.target).hasClass('modal-container')) {
			$(".modal-container").hide();
		}
	});
	//Dismiss button click
	$("#modal-close-btn").click(function(event) {
		$(".modal-container").hide();
	});

	//When the search field is submitted (checking on event) find all names which include the inputted text.
	$("form").submit(function(event) {
		//Prevent default on submit event
		event.preventDefault();
		
		//Get input from search field
		let searchText = $("#search-input").val();
		//Transform input from search field to lowercase for impoved search functionality
		searchText = searchText.toLowerCase();

		//Loop through list of employees and check if their frist or last name includes the inputted search text. If yes then keep else fade them out.
		for (var i = 0; i < resultArray.length; i++) {
			
			if (resultArray[i].name.first.includes(searchText) || resultArray[i].name.last.includes(searchText)) {
				//Show card at current index
				$(`[data-index='${i}']`).show();

			} else {
				//Hide card at current index
				$(`[data-index='${i}']`).hide();
			}
		}
	});

	//Adding the functionality to toggle back and forth between employess when the modal is open.
	$("#modal-prev, #modal-next ").click(function(event) {
		//Set a variable with the index number of the current empolyee in the modal
		const currentModalIndex = Number($(".modal-info-container").attr('data-index'));
		//Define newIndex variable for later usage.
		let newIndex;

		//If the "prev" button is press subtract one from the current index and if "next" is press add one to the current index.
		if ($(event.target).hasClass('modal-prev')) {
			newIndex = currentModalIndex - 1;
		} else if ($(event.target).hasClass('modal-next')) {
			newIndex = currentModalIndex + 1;
		}
		//Call showModal function with the new requested index and pass the array containing all thge employees.
		showModal(newIndex, resultArray);

	});


});

//Function for looping through a list of emplyees and append them to the gallery as cards with the required information.
function createEmployeeCards(employees) {

	//Loop through all the results
  for (var i = 0; i < employees.length; i++) {
  	//Append all results to the gallery as div "Card" with the required information.
  	$("#gallery").append(`
  			<div class="card" data-index="${i}">
            <div class="card-img-container">
                <img class="card-img" src="${employees[i].picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employees[i].name.first + " " + employees[i].name.last}</h3>
                <p class="card-text">${employees[i].email}</p>
                <p class="card-text cap">${employees[i].location.city + ", " + employees[i].location.state}</p>
            </div>
        </div>
  		`);
  }

}

//Function for splitting the string containing the date of birth in order to format it as required (DD/MM/YY). 
function formatDate(rawDate) {

	dateOnly = rawDate.split("T")[0];

	splittetDate = dateOnly.split("-");
	
	correctDate = splittetDate[2] + "/" + splittetDate[1] + "/" + splittetDate[0].substr(-2);

	return correctDate;
}


//Function for showing the modal with the information of the selected employee card. This is done by passing the card index to find the employee in the result Array and populating the field in the modal with the required information.
function showModal(index, employees) {
	//First set the content of the modal to display the selected employee
	//Set picture
	$(".modal-container .modal-img").attr("src", employees[index].picture.large);
	//Set name
	$(".modal-info-container #name").text(employees[index].name.first + " " + employees[index].name.last);
	//Set email
	$(".modal-info-container p:eq(0) ").text(employees[index].email);
	//Set city
	$(".modal-info-container p:eq(1) ").text(employees[index].location.city);
	//Set phone
	$(".modal-info-container p:eq(2) ").text(employees[index].phone);
	//Set detailed location info
	$(".modal-info-container p:eq(3) ").text(employees[index].location.street + ", " + employees[index].location.state + " " + employees[index].location.postcode);
	//Set birthday
	$(".modal-info-container p:eq(4) ").text("Birthday: " + formatDate(employees[index].dob.date));
	//Set index as data-index attribute for modal-info-containter
	$(".modal-info-container").attr("data-index", index);

	//If index is first (0) hide prev button or if last (length of employees - 1) hide next button. If not first or last show both buttons
	if (index == 0) {
		$("#modal-prev").hide();
	} else if (index == employees.length - 1) {
		$("#modal-next").hide();
	} else {
		$("#modal-prev").show();
		$("#modal-next").show();
	}

	//Then show the modal
	$(".modal-container").show();

}

