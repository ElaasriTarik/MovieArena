const logoutBtn = document.querySelector('.logOutButton');
logoutBtn.addEventListener('click', () => {
	localStorage.removeItem('username');
	localStorage.removeItem('fullname');
	window.location.href = '/web_interface/login.html';
});
