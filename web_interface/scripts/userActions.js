let addToFavsBtn = $('#addToFavsBtn')[0];

addToFavsBtn.addEventListener('click', (e) => {
	//console.log('clicked');
	const link = '/';
	const movieId = document.querySelector('.moviePoster').dataset.movieId;
	const moviePoster = document.querySelector('.movieImg').src;
	const movieTitle = document.querySelector('.mainTitleMovie').textContent;
	const checkIfUserLoggedIn = localStorage.getItem('username');
	if (checkIfUserLoggedIn === null) {
		//alert('You need to be logged in to add to favourites');
		return;
	}
	if (e.target.dataset.fav === 'true') {
		e.target.dataset.fav = 'false';
		removeFav(e, movieId, movieTitle, moviePoster);
		addToFavsBtn = $('#addToFavsBtn')[0];
		return;
	}

	console.log(movieId, parseInt(movieId));
	fetch(`${link}/addToFavs`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			contentType: new URLSearchParams(window.location.search).get('type'),
			movieTitle: movieTitle,
			movieId: parseInt(movieId),
			moviePoster: moviePoster,
			username: localStorage.getItem('username')
		})
	})
		.then((response) => response.json())
		.then((data) => {
			//console.log(data);
			if (data.message === 'success') {
				const addToFavsIcon = $('.addToFavourites')[0];
				addToFavsIcon.src = 'images/checked.png';
				addToFavsBtn.textContent = 'In your favs!';
				addToFavsBtn.style.color = 'black';
				addToFavsBtn.dataset.fav = 'true';
				addToFavsBtn.style.backgroundColor = '#bdffbd';
			}
		});
});

function removeFav(e, movieId, movieTitle, moviePoster) {
	fetch(`${link}/removeFav`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			contentType: new URLSearchParams(window.location.search).get('type'),
			movieId: parseInt(movieId),
			username: localStorage.getItem('username')
		})
	})
		.then((response) => response.json())
		.then((data) => {
			//console.log(data);
			if (data.message === 'success') {
				e.target.textContent = 'Removed!';
				e.target.style.backgroundColor = 'pink';
				e.target.dataset.fav = 'false';
			}
		});
}