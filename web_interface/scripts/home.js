$(function () {
	// Get the search input
	const searchInput = $('#searchText');
	searchInput.on('input', (e) => {
		$('#searchResults').css('display', 'block');
		$.ajax({
			type: 'GET',
			url: `https://api.themoviedb.org/3/search/movie?query=${e.target.value}&include_adult=false&language=en-US&page=1`,
			headers: {
				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4',
				'accept': 'application/json',
			},
			success: (data) => {
				movies = data.results;
				console.log(movies);
				$("#searchResults").empty();
				for (let i = 0; i < movies.length; i++) {
					$('#searchResults').append(`
						<div class="col-md-3">
							<div class="well text-center searchContent" data-movie-id="${latestMovies[i].id}" data-content="movie"">
								<div class="movieImageContainer">
									<img src="https://image.tmdb.org/t/p/w500${movies[i].poster_path}" alt="Movie Poster" class="movieSearchPoster">
								</div>
								<div class="movieInfo">
								<h5 class="titleSearch">${movies[i].title}</h5>
								<div class="ratingContainer">
								<img src="images/star.png" alt="Rating" class="SearchRatingIcon">
								<h6 class="ratingSearch">${movies[i].vote_average.toFixed(1)}</h6>
								</div>
								<h5 class="releaseDateSearch">${movies[i].release_date.split('-')[0]}</h5>
								</div>
								<a onclick="movieSelected('${movies[i].id}')" class="btn btn-primary movieDetail" href="#"><img src="images/pngwing.com.png"</a>
							</div>
					`);
				}
			}
		})
	});
	$(document).on('click', function (e) {
		if ($(e.target).closest('#searchResults').length) {
			// This will be executed when an ancestor of #searchResults is clicked
			$('#searchResults').css('display', 'none'); // This will hide the #searchResults element
		}
	});
});