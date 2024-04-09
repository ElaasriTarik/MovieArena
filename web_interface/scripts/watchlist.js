const urlParams = new URLSearchParams(window.location.search); // Get the URL parameters
const contentID = urlParams.get('id');
const contentType = urlParams.get('type')
const link = 'https://moviearena.onrender.com'

$(window).on('load', function () {
	// get watchlist from database
	fetch(`${link}/getWatchlist?id=${localStorage.getItem('id')}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			const watchlist = document.querySelector('.watchlistContent');
			let fetchedList = []
			for (let i = 0; i < data.watchlist.length; i++) {
				$.ajax({
					url: `https://api.themoviedb.org/3/${data.watchlist[i].contentType}/${data.watchlist[i].contentID}?language=en-US`,
					type: 'GET',
					headers: {
						"accept": "application/json",
						"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4"
					},
					success: (content) => {
						content.contentType = data.watchlist[i].contentType;
						//console.log(content);
						fetchedList.unshift(content);
						if (fetchedList.length == data.watchlist.length) {
							console.log(fetchedList);
							//fetchedList = fetchedList.reverse();
							for (let index = 0; index < fetchedList.length; index++) {
								const item = fetchedList[index];
								let airTime = ''
								if (item.contentType === 'tv') {
									airTime = item.first_air_date.split('-')[0] + ' - ' + item.last_air_date.split('-')[0]
								} else {
									airTime = item.release_date.substring(0, 7)
								}
								let created_by = item.runtime ? item.runtime + 'm' : 'N/A'
								if (item.hasOwnProperty('created_by') && item.created_by.length > 0) {
									created_by = item.created_by[0].name
								}
								watchlist.innerHTML += `
				<div class="watchlistItem" data-movieId=${item.id} data-content=${item.contentType}>
				<div class="poster">
					<img src="https://image.tmdb.org/t/p/original/${item.poster_path}" class="watchlistPoster">
				</div>
				<div class="watchInfo">
					<div class="watchlistTitle">${item.contentType == 'movie' ? item.title : item.name}</div>
					<div class="subInfo">
						<p class="watchlistReleaseDate">${airTime}|</p>
						<p class="typeOfContent">${item.contentType == 'tv' ? 'TV Series' : 'Movie'}|</p>
						<p class="createdBy">${created_by}|</p>
						<p class="watchlistGenres">${item.genres.slice(0, 3).map(genre => genre.name).join(', ')}</p>
					</div>
					
					<div class="watchlistOverview">${item.overview.substring(0, 120)}...</div>
					<div class="MovieRatingContainer">
					<img src="images/star.png" alt="Rating" class="ratingIcon">
					<h4 class="mainMovieRating"><span class="ratingNumber">${item.vote_average.toFixed(1)}</span> <span class="votesCount">(${item.vote_count} votes)</span></h4>

					</div>
				</div>
					
				</div>
				`
							}
						}
					}
				})
			}

			//watchlist.innerHTML = watchlistHTML;
		})
		.catch(error => console.log(error));
	// edit button clicked
	const editBtn = document.querySelector('.editBox');

	editBtn.addEventListener('click', () => {
		const listItems = document.querySelectorAll('.watchlistItem');
		console.log('edit');
		for (let item = 0; item < listItems.length; item++) {
			const element = listItems[item];
			console.log(element);
			element.classList.toggle('editMode');
			if (element.classList.contains('editMode')) {
				element.style = 'filter: grayscale(1)';
				element.innerHTML += '<img src="images/close.png" alt="Delete" class="deleteItem">'

			} else {
				element.style = 'filter: grayscale(0)';
				element.removeChild(element.lastChild);
			}
		}
		deleteItem();
	});
});

// deleteItem button 
function deleteItem() {
	const deleteBtn = document.querySelectorAll('.deleteItem');
	deleteBtn.forEach(element => {
		element.addEventListener('click', () => {

			const movieId = element.parentElement.dataset.movieId;
			const contentType = element.parentElement.dataset.content;
			fetch(`${link}/removeFromWatchlist`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					contentType: contentType,
					movieId: parseInt(movieId),
					userID: localStorage.getItem('id')
				})
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.message === 'success') {
						element.parentElement.remove();
					}
				})
		});
	});

}
