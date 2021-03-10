window.addEventListener("load", () => {
	let submit = document.querySelector('#contact-submit');
	let name = document.querySelector('#fullName');
	let name_error = document.querySelector('.name_error');
	let email = document.querySelector('#email');
	let email_error = document.querySelector('.email_error');
	let subject = document.querySelector('#subject');
	let subject_error = document.querySelector('.subject_error');
	let message = document.querySelector('#query');
	let message_error = document.querySelector('.message_error');
	let namere = /^[a-zA-Z ]*$/;
	let emailre = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	submit.addEventListener('click', (event) => {
		event.preventDefault();
		name_error.textContent = "";
		email_error.textContent = "";
		subject_error.textContent = "";
		message_error.textContent = "";
		// name validation
		if (name.value === "") {
			name_error.textContent = "A name is required.";
		}else{
			// check if name only contains letters and spaces
			if (!namere.test(name.value)) {
				name_error.textContent = "Only letters and spaces allowed.";
			}
		}
		// email validation
		if (email.value === "") {
			email_error.textContent = "An email is required.";
		}else{
			// check if email only contains letters and spaces
			if (!emailre.test(email.value)) {
				email_error.textContent = "Invalid email address.";
			}
		}
		// subject validation
		if (subject.value === "") {
			subject_error.textContent = "a subject is required.";
		}
		// message validation
		if (message.value === "") {
			message_error.textContent = "A message is required.";
		}
		if(message_error.textContent === "" && subject_error.textContent === "" && name_error.textContent === "" && email_error.textContent === ""){
			let ok = document.querySelector('#ok');
			document.querySelector('#form').style.display = "none";
			document.querySelector('#loading').style.display = "initial";
			window.setTimeout(() => {
				document.querySelector('#loading').style.display = "none";
				ok.style.display = "initial";
			}, 3000);
			let xhr = new XMLHttpRequest();
			let data = "email=" + encodeURIComponent(email.value.trim()) + "&subject=" + encodeURIComponent(subject.value.trim()) + "&message=" + encodeURIComponent(message.value.trim());
			xhr.addEventListener('load', () => {
				if (xhr.status === 201) {
					ok.textContent += xhr.responseText;
				}
			});
			xhr.open("POST", "https://mw159.brighton.domains/ci527/contact.php", true);
			xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			xhr.send(data);
		}
	});
});