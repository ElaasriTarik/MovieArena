// The below code is used to redirect the user to the movie page when they click on a movie card.

$(window).on('load', function () {
	$(function () {
		let moviesCards = document.querySelectorAll('.movieCard');
		makeActive(moviesCards);
		//let searchContent;
		//const searchResults = document.getElementById('searchResults');
		// searchResults.addEventListener('onchange', () => {
		// 	makeActive()
		// })

		//console.log(moviesCards);

	});
});
function makeActive(cc) {
	cc.forEach((card) => {
		card.addEventListener('click', (event) => {
			console.log('clicked');
			const contentID = event.currentTarget.dataset.movieId;
			const contentType = event.currentTarget.dataset.content;
			window.location.href = `movie.html?type=${contentType}&id=${contentID}`;
		});
	});
}