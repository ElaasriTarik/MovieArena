headers = {
	'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYjIzNzkyOGRjYTE2MDYwNDkzN2E3MWY5NDdkNmM2MiIsInN1YiI6IjY1ZTMyNDhiNDk4ZWY5MDE2NGVjY2U4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5gRke4f-AmvSdy_tRRB93Sd2TuxA3tOw_2NCRhlM3L4',
	'accept': 'application/json',
}
$(function () {

	// get window size to change some Items places
	//window.addEventListener('resize', () => {
	const windowWidth = $(window).width();
	if (windowWidth < 560) {
		const headerTitles = $('.list_titles').toArray();
		const userBox = $('#user_name').toArray();
		const user_name = $('#user_name').toArray();
		user_name[0].innerHTML = '<img src="images/icons8-sort-down-100.png" alt="User" class="arrowDownIcon">';
		userBox[0].append(headerTitles[0]);
		//headerTitles.style = 'display: none';
		//userBox[0].innerHTML += '<img src="images/arrowDown.png" alt="User" class="arrowDownIcon">';
	} else {
		const headerTitles = $('.list_titles').toArray();
		const arrowDownIcon = $('.arrowDownIcon').toArray();
		arrowDownIcon[0].remove();
		headerTitles[0].style = 'display: block';

	}
	const arrowDownIcon = $('#user_name').toArray();
	arrowDownIcon[0].addEventListener('click', () => {
		const headerTitles = $('.list_titles').toArray();
		console.log('clicked', headerTitles[0]);
		if (arrowDownIcon[0].dataset.clicked === 'true') {
			arrowDownIcon[0].dataset.clicked = 'false';
			headerTitles[0].style = 'animation: dropUp .3s ease-in-out ; display: none;';
			return;
		}
		arrowDownIcon[0].dataset.clicked = 'true';
		headerTitles[0].style = 'animation: dropDown .3s ease-in ; display: block; top: 2rem;';

	})
	//})

	// search interactivity
	const searchArea = $(".searchAreaBG");
	$(".searchIcon").click(function () {
		console.log('clicked');
		searchArea.css('display', 'flex');
		searchArea.css('height', '100vh');
		searchArea.css('animation', 'both openUp .3s')
		//const searchArea = $(".searchAreaBG");
		const closebtn = $(".closeLogo");
		console.log(closebtn);
		closebtn.click(function () {
			console.log('clicked');
			searchArea.css('display', 'none');
		});

	});
	// Get the search input
	const searchInput = $('#searchText');
	const dropDownBox = $('#dropDownBox');
	searchInput.on('input', (e) => {
		$('#searchResults').css('display', 'block');
		$('#options').css('display', 'none');
		const thisOption = $('#thisOption')[0];
		console.log(thisOption);
		if (thisOption.innerText === 'Movies') {
			startSearch('movie', e.target.value, 'movie');
		} else if (thisOption.innerText === 'Shows') {
			startSearch('tv', e.target.value, 'tv');
		} else if (thisOption.innerText === 'users') {
			startSearch('users', e.target.value, 'users');
		} else {
			startSearch('movie', e.target.value);
			startSearch('tv', e.target.value);
		}

		$(document).click(function (event) {
			const searchResults = $('#searchResults');
			if (!searchResults.is(event.target) && searchResults.has(event.target).length === 0) {
				searchResults.css('display', 'none');
				$('.searchAreaBG').css('display', 'none');
			}
		});
	});
	// add event listener to drop down button
	dropDownBox.on('click', (e) => {
		$('#options').css('display', 'flex');
		const optionsList = $('.option').toArray();
		optionsList.forEach((item) => {
			item.addEventListener('click', (e) => {
				$('#thisOption').text(e.currentTarget.textContent);
			})
		})

	});
	// adding a carousell effect
	const carouselContainer = $('.carouselContainer').toArray();
	fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=ab237928dca160604937a71f947d6c62`)
		.then((response) => response.json())
		.then((data) => {
			const movies = data.results;
			console.log(movies);
			const htmlRes = movies.map((movie) => {
				let airTime = ''
				if (movie.type === 'tv') {
					airTime = movie.first_air_date.split('-')[0] + ' - ' + movie.last_air_date.split('-')[0]
				} else {
					airTime = movie.release_date.substring(0, 7)
				}
				let created_by = movie.runtime ? movie.runtime + 'm' : 'N/A'
				if (movie.hasOwnProperty('created_by') && movie.created_by.length > 0) {
					created_by = movie.created_by[0].name
				}
				return `<div class="prevList slide">
					<div class="slideInfo">
						<h2 class="slideTitle">${movie.title}</h2>
						<p class="slideOverview">${movie.overview.substring(0, 150)}...</p>
						<div class="subInfo">
						<p class="watchlistReleaseDate">${airTime}|</p>
						<p class="typeOfContent">${movie.type == 'tv' ? 'TV Series' : 'Movie'}|</p>
						<p class="createdBy">${created_by}|</p>
						
					</div>
						
						<div class="buttons">
					
					<div class="addTowatchlist">
					<img src="images/addToBookmark.png" alt="" class="addToWatchlist addToFavourites">
					<button type="button" id="addToWatchlistBtn">Watchlist</button>
				</div>
				</div>
					</div>
				

					<img src="https://image.tmdb.org/t/p/original/${movie.backdrop_path}" alt="Movie Poster" class="movieSearchPoster">
				</div>`
			})
			carouselContainer[0].innerHTML = htmlRes.join('');
			const slides = document.querySelectorAll('.slide');
			const prevButton = document.querySelector('.prev');
			const nextButton = document.querySelector('.next');

			let currentSlide = 0;
			const numSlides = slides.length;

			// Function to move the slides
			function translateSlides(slideIndex) {
				console.log(slideIndex);
				carouselContainer[0].style.transform = `translateX(-${slideIndex * 100}%)`;
				currentSlide = slideIndex;
			}

			// Button Event Listeners
			nextButton.addEventListener('click', () => {
				let newIndex = (currentSlide + 1) % numSlides;
				translateSlides(newIndex);
			});

			prevButton.addEventListener('click', () => {
				let newIndex = (currentSlide - 1 + numSlides) % numSlides;
				translateSlides(newIndex);
			});
			setInterval(() => {
				let newIndex = (currentSlide + 1) % numSlides;
				translateSlides(newIndex);
			}, 4000)
		});


});

let moviesRes = []
let seriesRes = []
let resultsMovies;
let resultsSeries;
function startSearch(contentType, query, rule) {
	const link = 'https://movie-arena-khaki.vercel.app'
	if (rule == 'users') {
		console.log('searching for users');
		$.ajax({
			type: 'GET',
			url: `${link}/getUsers?username=${query}`,
			success: async (data) => {
				const users = await data;
				const htmlRes = users.map((user) => {

					return `<div class="col-md-3 userCol">
							<div class="well text-center searchContent movieCardSearch userCardSearch" data-userid=${user.id} >
								<div class="userprofile">
									<img src="images/addToBookmark.jpg" alt="Movie Poster" class="movieSearchPoster userProgilrImage">
								</div>
								<div class="movieInfo userinfo">
							
								<h2 class="fullnameRes">${user.fullname}</h2>
								</div>
							</div>`
				});
				$('#searchResults').empty()
				$('#searchResults').append(htmlRes)
				const userCards = $('.userCardSearch').toArray();
				userCards.forEach(card => {
					card.addEventListener('click', (event) => {
						const userID = event.currentTarget.dataset.userid;
						console.log(userID);
						window.location.href = `user.html?userID=${userID}`;
					});
				});
			}
		})
	}
	else {
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
					})//.sort((a, b) => a.vote_avergae - b.vote_avergae);
					//console.log(resultsMovies);
				} else {
					seriesRes = movies;
					resultsSeries = seriesRes.map((item) => {
						item.type = 'tv'
						return item
					})//.sort((a, b) => a.vote_avergae - b.vote_avergae);
				}

				if (resultsMovies || resultsSeries) {
					if (rule) {
						if (rule == 'tv') {
							renderSearchResults(null, resultsSeries);
						} else {
							renderSearchResults(resultsMovies, null);
						}
					} else {
						renderSearchResults(resultsMovies, resultsSeries);
					}
				}
			}
		})
	}
}

function renderSearchResults(movies, series) {
	let everything;
	if (movies && series) {
		everything = [...movies, ...series];
	} else if (movies === null) {
		everything = [...series];
	} else {
		everything = [...movies];
	}

	const allRes = everything.sort((a, b) => b.popularity - a.popularity);
	console.log(allRes);
	const htmlRes = allRes.map((movie) => {
		let airTime = ''
		if (movie.type === 'tv') {
			airTime = movie.first_air_date.split('-')[0] + ' - ';
			airTime += movie.last_air_date ? movie.last_air_date.split('-')[0] : 'N/A'
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