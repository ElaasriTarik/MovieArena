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
				const checkIfUserLoggedIn = localStorage.getItem('username');
				if (checkIfUserLoggedIn !== null) {
					chechIFfavs(data)
				}
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
				$('.movieImg').attr('src', `https://image.tmdb.org/t/p/original/${data.poster_path}`);
				$('.moviePoster').attr('data-movie-id', data.id);
				$('.contentStatus')[0].textContent = data.status;

				console.log(data.status, $('.contentStatus'));
				$('.movieDetails').append(
					`<div class="contentType">${contentType.toUpperCase()}</div>
					<h1 class="mainTitleMovie">${contentType == 'tv' ? data.name : data.title}</h1>
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
						tvORmovie = contentType === 'tv' ? watchProvidersUS.CA.flatrate || watchProvidersUS.AE.flatrate : watchProvidersUS.AE.flatrate || watchProvidersUS.US.buy;
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
				// get actors
				$.ajax({
					type: 'GET',
					url: `https://api.themoviedb.org/3/${contentType}/${contentID}/credits?language=en-US`,
					headers: headers,
					success: (actors) => {
						actors = actors.cast;
						//console.log(actors);
						const actorsList = actors.map((actor) => {
							return `<div class="actorBox">
							<div class="actorImg">
								<img src="https://image.tmdb.org/t/p/original/${actor.profile_path}" alt="${actor.name}">
								</div>
								<p class="actorName">${actor.name}</p>
							</div>
						`
						})
						$('.actors').append(actorsList.join(''))
					}
				})
				// get similar movie
				$.ajax({
					type: 'GET',
					url: `https://api.themoviedb.org/3/${contentType}/${contentID}/similar?language=en-US`,
					headers: headers,
					success: (similar) => {
						similar = similar.results;
						//console.log(similar);
						const similarList = similar.map((item) => {
							const title = contentType == 'tv' ? item.name : item.title;
							return `<div class="movieBox movieCard" data-movie-id="${item.id}" data-content-type="${contentType}">
							<div class="similarMovieImg">
								<img src="https://image.tmdb.org/t/p/original/${item.poster_path}" alt="${title}">
								</div>
								<p class="similarMovieTitle">${title}</p>
							</div>
						`
						})
						$('.similarMovies').append(similarList.join(''))
						makeCardActive();
						getComments();
					}
				})
			}
		});
	});
	// check if movie is in favourites

});
function chechIFfavs(data) {
	fetch(`http://localhost:5500/checkFav?username=${localStorage.getItem('username')}&movieId=${data.id}&contentType=${contentType}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			//console.log(data);
			if (data.message === 'success') {
				const addToFavsBtn = $('#addToFavsBtn')[0];
				addToFavsBtn.textContent = 'In your favourites!';
				addToFavsBtn.style.backgroundColor = '#bdffbd';
				addToFavsBtn.dataset.fav = 'true';
			}
		});
}

function makeCardActive() {
	const movieCards = $('.movieCard').toArray();
	movieCards.forEach(card => {
		card.addEventListener('click', (event) => {
			const contentID = event.currentTarget.dataset.movieId;
			const contentType = event.currentTarget.dataset.contentType;
			window.location.href = `movie.html?type=${contentType}&id=${contentID}`;
		});
	});
}

const addCommentBtn = $('#addCommentBtn')[0];
addCommentBtn.addEventListener('click', (e) => {
	if (localUsername === null) {
		alert('You need to be logged in to add a comment');
		return;
	}
	const comment = document.querySelector('#comment').value;
	fetch('http://localhost:5500/addComment', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			contentType: contentType,
			contentID: contentID,
			username: localStorage.getItem('username'),
			comment: comment
		})
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data.message === 'success') {
				$('#comment').val('');
				console.log('Comment added successfully');
				getComments();
				//$('#commentSuccess').css('display', 'block');
				//$('#commentSuccess').text('Comment added successfully');
				// setTimeout(() => {
				// 	$('#commentSuccess').css('display', 'none');
				// }, 3000);
			}
		});
});

function getComments() {
	fetch(`http://localhost:5500/getComments?contentType=${contentType}&contentID=${contentID}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			const comments = data.map((comment) => {
				return `
				<div class="commentBox">
				<div class="commentUser">
					<img src="images/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
						alt="" class="userImage">
				</div>
				<div class="commentContent">
					<div class="userAndDate">
						<p class="username">${comment.username}</p>
						<p class="dateCommented">${comment.timestamp.split('T')[0]}</p>
					</div>
					<p class="comment">${comment.content}</p>
				</div>
			</div>
			`
			})
			console.log(comments);
			$('.comments').empty();
			$('.comments').append(comments.join(''))
		});
}