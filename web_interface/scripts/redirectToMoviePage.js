// The below code is used to redirect the user to the movie page when they click on a movie card.

$(window).on('load', function () {
	$(function () {
		const moviesCards = document.querySelectorAll('.movieCard');
		const favsBtns = document.querySelectorAll('.addToFavIconContainer');
		console.log(favsBtns);
		makeActive(moviesCards);
		favBtns(favsBtns);
		//console.log(moviesCards);

	});
});
function makeActive(cc) {
	cc.forEach((card) => {
		card.addEventListener('click', (event) => {
			//console.log('clicked');
			const contentID = event.currentTarget.dataset.movieId;
			const contentType = event.currentTarget.dataset.content;
			window.location.href = `movie.html?type=${contentType}&id=${contentID}`;
		});
	});
}
function favBtns(favs) {
	favs.forEach((btn) => {
		btn.addEventListener('click', (event) => {
			console.log('clicked');
			const contentID = event.currentTarget.dataset.movieId;
			const contentType = event.currentTarget.dataset.content;
			const username = localStorage.getItem('username');
			if (username === null) {
				alert('You need to be logged in to add to favourites');
				return;
			}
			const link = 'https://moviearena.onrender.com';
			fetch(`${link}/addFav`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					contentType: contentType,
					contentID: contentID,
					username: username
				})
			})
				.then((response) => response.json())
				.then((data) => {
					//console.log(data);
					if (data.message === 'success') {
						console.log('Favourite added successfully');
						//alert('Favourite added successfully');
					}
				});
		});
	});
}
