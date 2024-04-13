const usernameDisplay = document.getElementById('username');
const localFullname = localStorage.getItem('fullname');
const localUsername = localStorage.getItem('username');

if (!localFullname && !localUsername) {
	usernameDisplay.textContent = 'Login';
	usernameDisplay.href = '/login.html';
}
else {
	usernameDisplay.textContent = localUsername;
}
const userFullName = document.querySelector('.profileFullname');
const userUsername = document.querySelector('.profileUsername');
if (localFullname && userFullName && userUsername) {
	userFullName.textContent = localFullname;
	userUsername.textContent = localUsername;
}

// get the user's favorite movies
console.log('localusername', localUsername);
const checkIfUserLoggedIn = localStorage.getItem('username');
if (checkIfUserLoggedIn) {
	//alert('You need to be logged in to see your favourites');

	let link = 'https://moviearena.onrender.com';
	fetch(`${link}/getFavs?username=${localUsername}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => { populateFavs(data); })
		.catch(error => console.log(error));
}
// get follow count
let link = 'https://moviearena.onrender.com';
fetch(`${link}/getFollowCount?userId=${localStorage.getItem('id')}`, {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json'
	}
})
	.then((response) => response.json())
	.then((data) => {
		const followers = document.querySelector('.followers');
		const following = document.querySelector('.followings');
		followers.textContent = 'Followers: ' + data.following;
		following.textContent = 'Following: ' + data.followers;
	})
	.catch(error => console.log(error));

function populateFavs(data) {
	//console.log(data);
	const numberOfMovies = document.querySelector('.NumberOfMovies');
	const NumberOfSeries = document.querySelector('.NumberOfSeries');
	const moviesData = data[0].movies
	moviesData.reverse();
	const seriesData = data[1].series;
	seriesData.reverse();
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
					<div class="movieCard" data-movie-id="${seriesData[i].id}" data-content="tv">
							<div class="movieImage">
								<img src="https://image.tmdb.org/t/p/w500${seriesData[i].poster_path}" alt="Movie Poster" class="moviePoster">
							</div>
					</div>`);
	}
	enableClick();
}


function enableClick() {
	const movieCards = $('.movieCard').toArray();
	movieCards.forEach(card => {
		card.addEventListener('click', (event) => {
			const contentID = event.currentTarget.dataset.movieId;
			const contentType = event.currentTarget.dataset.content;
			window.location.href = `movie.html?type=${contentType}&id=${contentID}`;
		});
	});
}
