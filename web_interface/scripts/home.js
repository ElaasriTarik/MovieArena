headers = {
	'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4',
	'accept': 'application/json',
}
$(function () {
	// check user login status

	// Get the search input
	const searchInput = $('#searchText');
	searchInput.on('input', (e) => {
		$('#searchResults').css('display', 'block');
		startSearch('movie', e.target.value);
		startSearch('tv', e.target.value);
		$(document).click(function (event) {
			const searchResults = $('#searchResults');
			if (!searchResults.is(event.target) && searchResults.has(event.target).length === 0) {
				searchResults.css('display', 'none');
			}
		});
	});
});

let moviesRes = []
let seriesRes = []
let resultsMovies;
let resultsSeries;
function startSearch(contentType, query) {
	$.ajax({
		type: 'GET',
		url: `https://api.themoviedb.org/3/search/${contentType}?query=${query}&language=en-US&page=1`,
		headers: headers,
		success: async (data) => {
			movies = await data.results

			if (contentType === 'movie') {
				moviesRes = movies;
				resultsMovies = moviesRes.map(item => {
					item.type = 'movie'
					return item
				}).sort((a, b) => a.vote_avergae - b.vote_avergae);
				//console.log(resultsMovies);
			} else {
				seriesRes = movies;
				resultsSeries = seriesRes.map((item) => {
					item.type = 'tv'
					return item
				}).sort((a, b) => a.vote_avergae - b.vote_avergae);
			}
			if (resultsMovies.length > 0 && resultsSeries.length > 0) {
				renderSearchResults(resultsMovies, resultsSeries);
			}
		}
	})
}

function renderSearchResults(movies, series) {
	console.log(movies);
	const everything = [...movies, ...series]
	const allRes = everything.sort((a, b) => b.popularity - a.popularity);
	//console.log(allRes);
	const htmlRes = allRes.map((movie) => {
		let airTime = ''
		if (movie.type === 'tv') {
			airTime = movie.first_air_date.split('-')[0]
		} else {
			airTime = movie.release_date
		}
		return `<div class="col-md-3">
							<div class="well text-center searchContent movieCardSearch" data-movie-id="${movie.id}" data-content="${movie.type}">
								<div class="movieImageContainer">
									<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Movie Poster" class="movieSearchPoster">
								</div>
								<div class="movieInfo">
								<h5 class="titleSearch">${movie.type === 'tv' ? movie.name : movie.title}</h5>
								<div class="ratingContainer">
								<img src="images/star.png" alt="Rating" class="SearchRatingIcon">
								<h6 class="ratingSearch">${movie.vote_average.toFixed(1)}</h6>
								</div>
								<h5 class="releaseDateSearch">${airTime}</h5>
								</div>
								<a onclick="movieSelected('${movie.id}')" class="btn btn-primary movieDetail" href="#"><img src="images/pngwing.com.png"</a>
							</div>`
	})
	$('#searchResults').empty()
	$('#searchResults').append(htmlRes)
	const movieCards = $('.movieCardSearch').toArray();
	movieCards.forEach(card => {
		//console.log(card);
		card.addEventListener('click', (event) => {
			//console.log('clicked');
			const contentID = event.currentTarget.dataset.movieId;
			const contentType = event.currentTarget.dataset.content;
			window.location.href = `movie.html?type=${contentType}&id=${contentID}`;
		});
	});
}