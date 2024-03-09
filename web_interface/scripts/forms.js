const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	fetch('http://localhost:5500/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username,
			password: password
		})
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.message === 'User not found') {
				const userNotFound = document.querySelector('.userNotFound');
				userNotFound.textContent = 'User not found';
			} else if (data.message === 'wrong password or username') {
				const userNotFound = document.querySelector('.userNotFound');
				userNotFound.textContent = 'wrong password or username';
			}
			else {
				// const username_on_page = document.getElementById('username_on_page');
				// username_on_page.textContent = data[0].username;
				localStorage.setItem('username', username);
				localStorage.setItem('fullname', fullname);
				window.location.href = '/web_interface/home.html';
			}
		});
})
// signup form handling
