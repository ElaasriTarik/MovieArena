const urlParams = new URLSearchParams(window.location.search); // Get the URL parameters
const contentID = urlParams.get('id');
const contentType = urlParams.get('type')

headers = {
	"accept": "application/json",
	"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4"
}
$(window).on('load', function () {
	$(() => {
		$.ajax({
			url: `https://api.themoviedb.org/3/${contentType}/${contentID}?language=en-US`,
			type: 'GET',
			headers: headers,
			success: (data) => {
				console.log(data);
				let airTime = ''
				if (contentType === 'tv') {
					airTime = data.first_air_date.split('-')[0] + ' to ' + data.last_air_date.split('-')[0]
				} else {
					airTime = data.release_date
				}
				gg = []
				data.genres.forEach((item) => {
					gg.push(`<spans id="genres">${item.name}</spans>`)
				})
				$('#moviePosterFav').append(`
					<div class="moviePoster">
						<span class="contentStatus">${data.status}</span>
						<img alt="" class="movieImg" src="https://image.tmdb.org/t/p/w500${data.poster_path}">
					</div>
					<div class="favButton">
						<img src="" alt="" class="addToFavourites">
						<button type="button">Add to Favourites</button>
					</div>
			`);
				$('.movieDetails').append(
					`<h1 class="mainTitleMovie">${contentType == 'tv' ? data.name : data.title}</h1>
			<p class="releaseDate">${airTime}</p>
			<h5 class="descritpion">${data.overview}</h5>
			<div class="MovieRatingContainer">
			<img src="images/star.png" alt="Rating" class="ratingIcon">
			<h4 class="mainMovieRating"><span class="ratingNumber">${data.vote_average.toFixed(1)}</span> <span class="votesCount">(${data.vote_count} votes)</span></h4>
			
			</div>
			<h4 class="genres"><bold>Genres: </bold>${gg.join(' ')}
			</h4>`
				);
				// get the watch providers list
				$.ajax({
					type: 'GET',
					url: `https://api.themoviedb.org/3/${contentType}/${contentID}/watch/providers?language=en-US`,
					headers: headers,
					success: (providers) => {
						watchProvidersUS = providers.results;
						console.log(watchProvidersUS);
						tvORmovie = contentType === 'tv' ? watchProvidersUS.TW.flatrate || watchProvidersUS.AE.flatrate : watchProvidersUS.AE.flatrate || watchProvidersUS.US.buy;
						const watch = tvORmovie.map((item) => {
							return `<div class="providerBox">
								<img src="https://image.tmdb.org/t/p/original/${item.logo_path}" alt="${item.provider_name}" class="providerLogo">
								<p class="providerName">${item.provider_name}</p>
							</div>
						`})
						console.log(watch);
						$('.watchProvidersContainer').append(watch.join(''))
					}
				})
			}
		});
	});
});