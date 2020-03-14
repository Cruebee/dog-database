// JS sheet
// create IIFE
var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=50';
  var $pokemonList = $('.pokemon-list');
  // remove unused modal-container variable

  // funcrtion to load a list of pokemon from API:
  function loadList() {
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(responseJSON) {
      return responseJSON;
    }).then(function(json) {
      json.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function(e) {
      console.error(e);
    })
  }

  // function to load details from API:
  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, {dataType: 'json'}).then(function (responseJSON) {
      return responseJSON;
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      // Cleaner way to loop over pokemon types with map:
      item.types = details.types.map(function(pokemon) {
        return pokemon.type.name;
      });

    }).catch(function(e) {
      console.error(e);
    })
  }

  // function to create a list of pokemon from API:
  function addListItem(pokemon) {
    var $listItem = $('<li class="list-group-item list-group-item-action"></li>');
    var $listButton = $('<button id="showPokeModal" type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModalLong">' + pokemon.name + '</button>');

    // append $listButton to  listItem and append $listItem to $pokemonList:
    $listItem.append($listButton);
    $pokemonList.append($listItem);
    // add event listener for clicking on a pokemon button:
    $listButton.on('click', function() {
      showDetails(pokemon);
    });
  }

  // function to show modal: has been removed because Bootstrap modal will be used instead.
  // create new function to load pokemon-details into Bootstrap modal:
  function showModalDetails(imageUrl, name, height, types) {
    //Modal Title
    $('.modal-title').text(name);
    $('.modal-body')
      .empty()
      .append('<p>Height: ' + height + '</p>')
      .append('<p>Types: ' + types+ '</p>')
      .append('<img src="' + imageUrl + '"></img>');
  }

  // add function to show details and update to show modal:
  function showDetails(item) {
  pokemonRepository.loadDetails(item).then(function() {
    showModalDetails(item.imageUrl, item.name, item.height, item.types);
  });
}

  // function to add pokemon:
  function add(creature) {
    repository.push(creature);
  }

  function getAll() {
    return repository;
  }

  // return functions to be used outside IIFE:
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModalDetails: showModalDetails
  };

})(); // end IIFE.

// create list of pokemon buttons:
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

// create search bar functionality:
$(document).ready(function() {
  $('#pokemon-search').on('keyup', function() {
    var value = $(this)
    .val()
    .toLowerCase()
    $('#pokeSearchDiv *').filter(function() {
      $(this).toggle(
        $(this)
        .text()
        .toLowerCase()
        .indexOf(value) > -1
      );
    });
  });
});
