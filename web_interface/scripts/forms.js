const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const username = document.querySelector('#formUsername').value;
	const password = document.getElementById('password').value;
	console.log(username, password);
	fetch('https://movie-arena-khaki.vercel.app/login', {
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
				localStorage.setItem('fullname', data[0].fullname);
				window.location.href = '/web_interface/home.html';
			}
		});
})
// signup form handling
