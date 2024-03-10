const usernameDisplay = document.getElementById('username');
const localFullname = localStorage.getItem('fullname');
const localUsername = localStorage.getItem('username');
if (!localFullname && !localUsername) {
	usernameDisplay.textContent = 'Login';
	usernameDisplay.href = '/web_interface/login.html';
}
else {
	usernameDisplay.textContent = localFullname;
}
const userFullName = document.querySelector('.profileFullname');
const userUsername = document.querySelector('.profileUsername');
if (localFullname && userFullName && userUsername) {
	userFullName.textContent = localFullname;
	userUsername.textContent = localUsername;
}

// get the user's favorite movies
console.log('localusername', localUsername);
fetch(`http://localhost:5500/getFavs?username=${localUsername}`, {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json'
	}
})
	.then((response) => response.json())
	.then((data) => { populateFavs(data); })
	.catch(error => console.log(error));

function populateFavs(data) {
	console.log(data);
	const numberOfMovies = document.querySelector('.NumberOfMovies');
	const NumberOfSeries = document.querySelector('.NumberOfSeries');
	const moviesData = data[0].movies;
	const seriesData = data[1].series;
	numberOfMovies.textContent = moviesData.length;
	NumberOfSeries.textContent = seriesData.length;
	for (let i = 0; i < moviesData.length; i++) {
		$('#mainContentBody').append(`
					<div class="movieCard" data-movie-id="${moviesData[i].id}" data-content="movie">
							<div class="movieImage">
								<img src="https://image.tmdb.org/t/p/w500${moviesData[i].poster_path}" alt="Movie Poster" class="moviePoster">
							</div>
					</div>`);
	}
	for (let i = 0; i < seriesData.length; i++) {
		$('#mainContentBodySeries').append(`
					<div class="movieCard" data-movie-id="${seriesData[i].id}" data-content="movie">
							<div class="movieImage">
								<img src="https://image.tmdb.org/t/p/w500${seriesData[i].poster_path}" alt="Movie Poster" class="moviePoster">
							</div>
					</div>`);
	}
}