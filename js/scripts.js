// JS sheet
// create IIFE
var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
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
    var $listItem = $('<li class="list-group-item list-group-item-active"></li>');
    var $listButton = $('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModalScrollable">' + pokemon.name + '</button>');

    // append $listButton to  listItem and append $listItem to $pokemonList:
    $listItem.append($listButton);
    $pokemonList.append($listItem);
    // add event listener for clicking on a pokemon button:
    $listButton.on('click', function(event) {
      showDetails(pokemon);
    });
  }

  // function to show modal: has been removed because Bootstrap modal will be used instead.

  // add function to show details and update to show modal:
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      $('#pokeModalScrollable').modal(show);
    })
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
    showDetails: showDetails
  };

})(); // end IIFE.

// create list of pokemon buttons:
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
