const signupForm = document.querySelector('.signUpForm');
const link = '/';
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const username = document.getElementById('username').value;
	const fullname = document.getElementById('fullname').value;
	if (fullname.length === 0 || username.length === 0) {
		const userAlreadyExists = document.querySelector('.userAlreadyExists');
		userAlreadyExists.textContent = 'Please fill all the fields';
		return;
	}
	const password = document.getElementById('password').value;
	fetch(`${link}/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username,
			fullname: fullname,
			password: password
		})
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.message === 'User already exists') {
				const userAlreadyExists = document.querySelector('.userAlreadyExists');
				userAlreadyExists.textContent = 'User already exists';
			} else {
				// storing some info in localstorage
				localStorage.setItem('username', username);
				localStorage.setItem('fullname', fullname);
				localStorage.setItem('id', data.id);
				window.location.href = '/index.html';
			}
		});
});
