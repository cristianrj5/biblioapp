
// Ocultar el contenido y mostrar el preloader al cargar la página
$(document).ready(function () {
  $('#preloader').hide(); // Oculta el preloader al cargar la página
  $('#content').show(); // Muestra el contenido al cargar la página
});

function searchBooks(query) {
  const url = `https://openlibrary.org/search.json?q=${query}`;
  return fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Error al realizar la solicitud: ${response.status}`);
          }
          return response.json();
      })
      .then(data => data.docs)
      .catch(error => console.error('Error:', error));
}

$('.btn1').on('click', function () {
  const nombreLibro = $('#nombreLibro').val();
  const maxResults = 10; // Número máximo de resultados a mostrar
  $('.cards').empty();
  $('#preloader').show(); // Muestra el preloader al iniciar la búsqueda
  $('#content').hide(); // Oculta el contenido mientras se cargan los libros
  searchBooks(nombreLibro)
      .then(books => {
          if (books && books.length > 0) {
              console.log(`Resultados para la búsqueda '${nombreLibro}':`);
              let count = 0; // Inicializar el contador
              books.forEach(book => {
                  if (count < maxResults) { // Verificar si aún no se han mostrado todos los resultados
                      let cardHTML = ''; // Variable para almacenar el contenido HTML de cada tarjeta
                      cardHTML += `<div class="card">`;
                      cardHTML += `<p>${book.title || 'N/A'}</p>`;
                    //   cardHTML += `<p>Autor(es): ${book.author_name ? book.author_name.join(', ') : 'N/A'}</p>`;
                      if (book.cover_i) { // Verificar si hay una ID de portada disponible
                          const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
                          cardHTML += `<img src="${coverUrl}" alt="Portada del libro">`;
                      }
                      if (book.edition_key) { // Verificar si hay una OLID disponible
                          const olid = book.edition_key[0]; // Tomar el primer OLID si hay varios
                          const bookUrl = `https://openlibrary.org/works/${olid}`;
                          cardHTML += `<p><a href="${bookUrl}" target="_blank">Ver libro</a></p>`;
                      }

                      cardHTML += `</div>`;
                      $('.cards').append(cardHTML);
                      count++; // Incrementar el contador
                  }
              });
          } else {
              alert("No se encontraron resultados, para la busqueda.");
          }
      })
      .finally(() => {
          $('#preloader').hide(); // Oculta el preloader una vez que se completó la búsqueda
          $('#content').show(); // Muestra el contenido una vez que se cargan los libros
      });
});
