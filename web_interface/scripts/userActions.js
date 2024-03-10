const addToFavsBtn = $('#addToFavsBtn')[0];
console.log(addToFavsBtn);

addToFavsBtn.addEventListener('click', () => {
	console.log('clicked');
	const movieId = document.querySelector('.moviePoster').dataset.movieId;
	const moviePoster = document.querySelector('.movieImg').src;
	const movieTitle = document.querySelector('.mainTitleMovie').textContent;
	console.log(movieId, parseInt(movieId));
	fetch('http://localhost:5500/addToFavs', {
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
				addToFavsBtn.textContent = 'Added!';
			}
		});
});
