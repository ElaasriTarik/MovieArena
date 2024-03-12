const headers = {
	"accept": "application/json",
	"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4"

}
$(() => {
	$.ajax({
		url: "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
		type: 'GET',
		headers: headers,
		success: (data) => {
			latestMovies = data.results;
			for (let i = 0; i < latestMovies.length; i++) {
				$('#mainContentBody').append(`
					<div class="movieCard" data-movie-id="${latestMovies[i].id}" data-content="movie">
							<div class="movieImage">
							<div class="ratingContainerBody">
									<img src="images/star.png" alt="Rating" class="ratingIconBody">
									<p class="rating">${latestMovies[i].vote_average.toFixed(1)}</p>
								</div>
								<img src="https://image.tmdb.org/t/p/w500${latestMovies[i].poster_path}" alt="Movie Poster" class="moviePoster">
							</div>
					</div>`);
			}
		},
	});
	// latest shows
	$.ajax({
		url: "https://api.themoviedb.org/3/trending/tv/week?language=en-US",
		type: 'GET',
		headers: headers,
		success: (data) => {
			latestShows = data.results;
			//console.log(latestShows);
			for (let i = 0; i < latestShows.length; i++) {
				$('#latestShowsBody').append(`
					<div class="movieCard" data-movie-id="${latestShows[i].id}" data-content="tv">
					<div class="ratingContainerBody">
									<img src="images/star.png" alt="Rating" class="ratingIconBody">
									<p class="rating">${latestShows[i].vote_average.toFixed(1)}</p>
								</div>
							<div class="movieImage" data-id="${latestShows}">
								<img src="https://image.tmdb.org/t/p/w500${latestShows[i].poster_path}" alt="Movie Poster" class="moviePoster">
							</div>
					</div>`);
			}
		},
	});
	// top rated shows
	$.ajax({
		url: "https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1",
		type: 'GET',
		headers: headers,
		success: (data) => {
			topRatedShows = data.results;
			//console.log(topRatedShows);
			for (let i = 0; i < topRatedShows.length; i++) {
				$('#topRatedShowsBody').append(`
					<div class="movieCard" data-movie-id="${topRatedShows[i].id}" data-content="tv">
							<div class="movieImage">
								<div class="ratingContainerBody">
									<img src="images/star.png" alt="Rating" class="ratingIconBody">
									<p class="rating">${topRatedShows[i].vote_average.toFixed(1)}</p>
								</div>
								<img src="https://image.tmdb.org/t/p/w500${topRatedShows[i].poster_path}" alt="Movie Poster" class="moviePoster">
							</div>
					</div>`);
			}
		},
	});
});
