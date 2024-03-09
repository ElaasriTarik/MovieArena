const usernameDisplay = document.getElementById('username');
const localFullname = localStorage.getItem('fullname');
const localUsername = localStorage.getItem('username');
if (localFullname) {
	usernameDisplay.textContent = localFullname;
}
const userFullName = document.querySelector('.profileFullname');
const userUsername = document.querySelector('.profileUsername');
if (localFullname && userFullName && userUsername) {
	userFullName.textContent = localFullname;
	userUsername.textContent = localUsername
}