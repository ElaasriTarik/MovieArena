const urlParams = new URLSearchParams(window.location.search); // Get the URL parameters
const contentID = urlParams.get('id');
const contentType = urlParams.get('type')
const link = 'https://movie-arena-khaki.vercel.app'

$(window).on('load', function () {
	$(() => {
		$.ajax({
			url: `https://api.themoviedb.org/3/${contentType}/${contentID}?language=en-US`,
			type: 'GET',
			headers: {
				"accept": "application/json",
				"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4"
			},
			success: (data) => {
				const checkIfUserLoggedIn = localStorage.getItem('username');
				if (checkIfUserLoggedIn !== null) {
					chechIFfavs(data)
				}
				//console.log(data);
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

				//console.log(data.status, $('.contentStatus'));
				$('.movieDetails').append(
					`<div class="contentType">${contentType.toUpperCase()}</div>
					<h1 class="mainTitleMovie">${contentType == 'tv' ? data.name : data.title}</h1>
					<p class="releaseDate">${airTime}</p>
					<h5 class="descritpion">${data.overview}</h5>
					<div class="MovieRatingContainer">
					<img src="images/star.png" alt="Rating" class="ratingIcon">
					<h4 class="mainMovieRating"><span class="ratingNumber">${data.vote_average.toFixed(1)}</span> <span class="votesCount">(${data.vote_count} votes)</span></h4>

					</div>
					<div class="addRatingBox">
					<div class="addRatingImage">
					
					<img src="images/rateIcon.png" alt="Rating" class="rateIcon" data-movie-id=${data.id}>
					<p class="rating"></p>
					</div>
						
						<p class="addRatingLabel">Rate</p>
					</div>
					<h4 class="genres"><bold>Genres: </bold>${gg.join(' ')}
					</h4>
					<div class="addToWatchList">
						<img class="addToWatchIcon" src="images/addToBookmark.png"/>
						<button id="addToWatch" data-watchlist="false">Add to Watchlist</button>
					</div>
					`

				);
				// trigger the rate Icon option
				$('.addRatingImage').on('click', (e) => {
					const addRatingBox = $('body');

					if (e.currentTarget.dataset.status === 'true') {
						return;
					} else {
						e.currentTarget.dataset.status = 'true';
						const dialogueSection = document.createElement('dialogue');
						dialogueSection.className = 'dialogueSection';
						dialogueSection.innerHTML = `
							<h4 class="rateLabel">Rate This</h4>
							<h2 class="rateTitle">${contentType == 'tv' ? data.name : data.title}</h2>
							<div class="starsContainer">
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="1" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="2" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="3" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="4" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="5" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="6" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="7" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="8" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="9" />
								<img src="images/rateIcon.png" alt="Rating" class="rateStarIcon" data-star-id="10" />
							</div>
							<button class="rateBtn">Rate</button>
						`;
						addRatingBox.append(dialogueSection);
						const allStars = $('.rateStarIcon').toArray();
						console.log(allStars);
						rate(dialogueSection);
						// when cursor is away
						//$('.starsContainer').on('mouseleave', (e) => {
						//})
						allStars.forEach((star) => {
							//handleMouseLeave(star)
							star.addEventListener('mouseover', (e) => {
								allStars.forEach((star) => {

									star.src = 'images/rateIcon.png';
									star.dataset.status = 'false';
								})
								star.addEventListener('click', (e) => {
									const starID = e.currentTarget.dataset.starId;
									for (let i = 0; i < parseInt(starID); i++) {
										const prevStar = $('.rateStarIcon')[i];
										prevStar.dataset.status = 'true';
										prevStar.src = 'images/colored-star.png';
									}

								})
								//console.log('clicked');
								const starID = e.currentTarget.dataset.starId;
								for (let i = parseInt(starID); i > 0; i--) {
									if (i < 1) {
										return;
									}
									const prevStar = $('.rateStarIcon')[i - 1];
									prevStar.dataset.status = 'true';
									prevStar.src = 'images/colored-star.png';

								}
							})

						})

					}

				});
				// add to watchlist
				const addToWatch = $('#addToWatch')[0];
				// if (addToWatch.dataset.watchlist == 'true') {
				// 	addToWatch.dataset.watchlist = 'false';
				// 	removeFromWatchList();
				// 	return;
				// }
				addToWatch.addEventListener('click', (e) => {
					console.log('clicked');
					if (localStorage.getItem('username') === null) {
						alert('You need to be logged in to add to watchlist');
						return;
					}
					if (addToWatch.dataset.watchlist == 'true') {
						return;
					}
					fetch(`${link}/addToWatchList`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							contentType: contentType,
							contentID: contentID,
							userid: localStorage.getItem('id'),
							img: $('.movieImg').attr('src').split('https://image.tmdb.org/t/p/original/')[1],
						})
					})
						.then((response) => response.json())
						.then((data) => {
							console.log(data);
							if (data.message === 'success') {
								const watchIcon = $('.addToWatchIcon')[0];
								watchIcon.src = 'images/checked.png';
								e.target.textContent = 'In your Watchlist';
								e.target.dataset.watchlist = 'true';
								e.target.style.backgroundColor = '#76ABAE';
								removeFromWatchList();
							}
						});
				})
				// delete from watch list
				const deleteFromWatch = $('#addToWatch')[0];
				deleteFromWatch.addEventListener('click', (e) => {
					console.log('clicked');
					if (deleteFromWatch.dataset.watchlist == 'true') {
						fetch(`${link}/deleteFromWatchList`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								contentType: contentType,
								contentID: contentID,
								userID: localStorage.getItem('id')
							})
						})
							.then((response) => response.json())
							.then((data) => {
								console.log(data);
								if (data.message === 'success') {
									const watchIcon = $('.addToWatchIcon')[0];
									watchIcon.src = 'images/addToBookmark.png';
									e.target.textContent = 'Add to Watchlist';
									e.target.dataset.watchlist = 'false';
									e.target.style.backgroundColor = '#76ABAE';
								}
							});
					}
				});

				// get the watch providers list
				$.ajax({
					type: 'GET',
					url: `https://api.themoviedb.org/3/${contentType}/${contentID}/watch/providers?language=en-US`,
					headers: {
						"accept": "application/json",
						"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4"
					},
					success: (providers) => {
						watchProvidersUS = providers.results;
						let providersList = [];
						for (let key in watchProvidersUS) {
							if (watchProvidersUS.hasOwnProperty(key)) {
								providersList.push([...watchProvidersUS[key].flatrate]);
							}
						}
						// const providerLists = providersList.map((item) => {
						// 	return [...item.flatrate]
						// })
						console.log(providersList);
						tvORmovie = contentType === 'tv' ? watchProvidersUS.CA.flatrate || watchProvidersUS.AE.flatrate : watchProvidersUS.AE.flatrate || watchProvidersUS.US.buy;
						const watch = tvORmovie.map((item) => {
							return `<div class="providerBox">
								<img src="https://image.tmdb.org/t/p/original/${item.logo_path}" alt="${item.provider_name}" class="providerLogo">
								<p class="providerName">${item.provider_name}</p>
							</div>
						`})
						//console.log(watch);
						$('.watchProvidersContainer').append(watch.join(''))
					}
				})
				// get actors
				$.ajax({
					type: 'GET',
					url: `https://api.themoviedb.org/3/${contentType}/${contentID}/credits?language=en-US`,
					headers: {
						"accept": "application/json",
						"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4"
					},
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
					headers: {
						"accept": "application/json",
						"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4"
					},
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
						//activateWatchList();
						getRating();
						makeCardActive();
						getComments();
						// addToWatchlist();
						// removeFromWatchList();
						checkwatchlist();
						//deleteFromWatchList();
					}
				})
			}
		});
	});
	// check if movie is in favourites

});
function chechIFfavs(data) {
	fetch(`${link}/checkFav?username=${localStorage.getItem('username')}&movieId=${data.id}&contentType=${contentType}`, {
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
				const addToFavsIcon = $('.addToFavourites')[0];
				addToFavsIcon.src = 'images/checked.png';
				addToFavsBtn.textContent = 'In your favourites!';
				addToFavsBtn.style.color = '#EEEEEE'
				addToFavsBtn.style.backgroundColor = '#76ABAE';
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
	if (comment === '') {
		$('#comment').css('border', '2px solid red');
		setTimeout(() => {
			$('#comment').css('border', '1px solid #e1dcd5');
		}, 3000);
		return;
	}
	fetch(`${link}/addComment`, {
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
			//console.log(data);
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
	fetch(`${link}/getComments?contentType=${contentType}&contentID=${contentID}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			$("#commentCount").text(`(${data.length})`)
			const comments = data.map((comment) => {
				return `
				<div class="commentBox">
				<div class="commentUser">
					<img src="images/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
						alt="" class="userImage">
				</div>
				<div class="commentContent">
					<div class="userAndDate">
						<p class="username" data-id="${comment.userID}">${comment.username}</p>
						<p class="dateCommented">${comment.timestamp.split('T')[0]}</p>
					</div>
					<p class="comment">${comment.content}</p>
				</div>
			</div>
			`
			});
			//console.log(comments);
			$('.comments').empty();
			$('.comments').append(comments.reverse().join(''))
			makeUsersActive();
		});

}

function makeUsersActive() {
	const userBoxes = $('.username').toArray();
	userBoxes.forEach(box => {
		box.addEventListener('click', (event) => {
			console.log('clicked');
			const userID = event.currentTarget.dataset.id;
			window.location.href = `user.html?userID=${userID}`;
		});
	});
}

// rate button
function rate(dialogueSection) {
	const rateBtn = $('.rateBtn')[0];
	rateBtn.addEventListener('click', (e) => {
		const allStars = $('.rateStarIcon').toArray();
		let rating = 0;
		allStars.forEach((star) => {
			if (star.dataset.status === 'true') {
				rating = parseInt(star.dataset.starId);
			}
		});
		fetch(`${link}/addRating`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				contentType: contentType,
				contentID: contentID,
				username: localStorage.getItem('username'),
				rating: rating
			})
		})
			.then((response) => response.json())
			.then((data) => {
				//console.log(data);
				if (data.message === 'success') {
					dialogueSection.style.display = 'none';
					$('.rateIcon').attr('src', 'images/colored-star.png');

					console.log('Rating added successfully');
					getRating();
				}
			});
	});
}

// get the rating
function getRating() {
	fetch(`${link}/getRating?username=${localStorage.getItem('username')}&contentType=${contentType}&contentID=${contentID}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			const rating = data[0].rating;
			$('.rateIcon').attr('src', 'images/colored-star.png');
			$('.rating').text(`${rating}`);
		});
}


function checkwatchlist() {
	fetch(`${link}/checkWatchList?userID=${localStorage.getItem('id')}&contentID=${contentID}&contentType=${contentType}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			if (data.message === 'success') {
				const addToWatch = $('#addToWatch')[0];
				const watchIcon = $('.addToWatchIcon')[0];
				watchIcon.src = 'images/checked.png';
				addToWatch.textContent = 'In your watchlist!';
				addToWatch.style.color = '#EEEEEE';
				addToWatch.style.backgroundColor = '#76ABAE';
				addToWatch.dataset.watchlist = 'true';
			}
		});
}
// delete from watch list

