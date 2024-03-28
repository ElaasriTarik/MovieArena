// setting the header user names
const usernameDisplay = document.getElementById('username');
const localFullname = localStorage.getItem('fullname');
const localUsername = localStorage.getItem('username');
if (!localFullname && !localUsername) {
	usernameDisplay.textContent = 'Login';
	usernameDisplay.href = 'login.html';
}
else {
	usernameDisplay.textContent = 'You';
}
// getting followers count
const userId = new URLSearchParams(window.location.search).get('userID');
let userProfileId;
let usersUsername;

fetch(`http://localhost:5500/getFollowCount?userId=${userId}`, {
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


// getting user's data

fetch(`http://localhost:5500/getUser?id=${userId}`, {
	method: 'GET',
	headers: {
		'Content-Type': 'application/json'
	}
})
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		const userUsername = document.querySelector('.profileUsername');
		const userFullName = document.querySelector('.profileFullname');
		userFullName.textContent = data[0].fullname;
		userUsername.textContent = data[0].username;
		const followers = document.querySelector('.followers');
		const following = document.querySelector('.followings');

		usersUsername = data[0].username;
		userProfileId = data[0].id;
		checkIfFollowing(userProfileId, localStorage.getItem('username'));
		getFavs(usersUsername);
	})
	.catch(error => console.log(error));

// enable follow button
const followBtn = document.querySelector('.followButton');
followBtn.addEventListener('click', (e) => {
	if (localStorage.getItem('username') === null) {
		alert('You need to be logged in to follow a user');
		return;
	}
	if (e.target.dataset.follow === 'true') {
		e.target.dataset.follow = 'false';
		unfollowUser(e);
		return;
	}
	fetch('http://localhost:5500/followUser', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			toFollow: userId,
			follower: localStorage.getItem('username')
		})
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data.message === 'success') {
				e.target.textContent = 'Unfollow';
				e.target.dataset.follow = 'true';
				e.target.style.backgroundColor = '#ff4d4d';
			}
		});
});


// get the user's favorites
function getFavs(username) {
	const checkIfUserLoggedIn = localStorage.getItem('username');
	if (checkIfUserLoggedIn) {
		//alert('You need to be logged in to see your favourites');


		fetch(`http://localhost:5500/getFavs?username=${username}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((response) => response.json())
			.then((data) => { populateFavs(data); })
			.catch(error => console.log(error));
	}

}
function populateFavs(data) {
	//console.log(data);
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

function checkIfFollowing(userID, username) {
	fetch(`http://localhost:5500/checkIfFollowing?userId=${userID}&follower=${username}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data.message === 'success') {
				const followBtn = document.querySelector('.followButton');
				followBtn.textContent = 'Unfollow';
				followBtn.dataset.follow = 'true';
				followBtn.style.backgroundColor = '#ff4d4d';
			}
		});
}