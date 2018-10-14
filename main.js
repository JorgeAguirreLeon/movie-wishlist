const save = data=> {
  localStorage.setItem('movie-data', JSON.stringify(data))
}

const load = ()=> {
  JSON.parse(localStorage.getItem('movie-data'))
}

const movie_html = (movie, index)=> {
  return `
    <input id="movie-${index}" type="checkbox" ${movie.watched ? 'checked' : ''}>
    <label for="movie-${index}">${movie.title}</label>
  `
}

const loadMovies = movies=> {
  const movie_container = document.getElementsByClassName('movies')[0]
  movies.forEach((movie, i)=> {
    const html = movie_html(movie, i)
    movie_container.innerHTML = movie_container.innerHTML + html
  })
}

const toggleMovie = (movies, index)=> {
  return [
    ...movies.slice(0, index),
    {title: movies[index].title, watched: !movies[index].watched},
    ...movies.slice(index+1)
  ]
}

const addMovie = (movies, movie)=> {
  return [
    ...movies,
    movie
  ]
}

const updateCounters = movies=> {
  const pending_counter = document.getElementsByClassName('total--pending')[0]
  const done_counter = document.getElementsByClassName('total--done')[0]
  pending_counter.innerHTML = movies.filter(movie=> !movie.watched).length
  done_counter.innerHTML = movies.filter(movie=> movie.watched).length
}

const validTitle = title=> {
  if (!title) {
    return false
  }
  if (/^\s*$/.test(title)) {
    return false
  }
  return true
}

const checkMovie = (movies, title)=> {
  return movies.filter(movie=> movie.title === title).length > 0
}

const bindListeners = (movies)=> {
  const labels = [...document.getElementsByTagName('label')]
  labels.forEach(label=> {
    label.addEventListener('click', event=> {
      const for_index = +event.target.htmlFor.substring(6)
      movies = toggleMovie(movies, for_index)
      updateCounters(movies)
      save({movies})
    })
  })
}

document.addEventListener('DOMContentLoaded', event=> {

  // Data load
  let data = load()
  let movies = data && data.movies || []

  // Initial render
  loadMovies(movies)
  updateCounters(movies)

  // When user clicks on a movie
  bindListeners(movies)

  // When user enters input add movie
  const new_movie = document.getElementsByClassName('new-input')[0]
  new_movie.addEventListener('keyup', event=> {
    if (event.which === 13) {
      // This is the <intro> key
      const movie = event.target.value
      // Clear and blur the field
      event.target.value = ''
      event.target.blur()
      // Check for blanks
      if (!validTitle(movie)) return
      // CHeck the movie isn't on the list yet
      if (checkMovie(movies, movie)) return
      // Add the movie to the list
      const movie_data = {title: movie, watched: false}
      movies = addMovie(movies, movie_data)
      // Include the new movie in the DOM
      const html = movie_html(movie_data, movies.length-1)
      const movie_container = document.getElementsByClassName('movies')[0]
      movie_container.innerHTML = movie_container.innerHTML + html
      // Update counters
      updateCounters(movies)
      bindListeners(movies)
      // Save
      save({movies})
    }
  })

})
