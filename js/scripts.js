// JS sheet
// create IIFE
var pokemonRepository = (function () {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $pokemonList = $('ul');
  var $modalContainer = $('#modal-container');

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
      item.types = [];
      for (var i = 0; i < details.types.lenght; i++) {
        item.types.push(details.types[i].type.name);
      }
    }).catch(function(e) {
      console.error(e);
    })
  }

  // function to create a list of pokemon from API:
  function addListItem(pokemon) {
    var $listItem = $('<li></li>');
    var $listButton = $('<button type="button" class="list-button">' + pokemon.name + '</button>');

    // append $listButton to  listItem and append $listItem to $pokemonList:
    $listItem.append($listButton);
    $pokemonList.append($listItem);
    // add event listener for clicking on a pokemon button:
    $listButton.on('click', function(event) {
      showDetails(pokemon);
    });
  }

  // function to show modal:
  function showModal(item) {
    $modalContainer.empty();
    $modalContainer.addClass('is-visible');
    var modal = $('<div class="modal"></div>');

    // add new modal content:
    var closeModalButton = $('<button class="modal-close">' + 'Close' + '</button>');
    closeModalButton.on('click', hideModal);

    var modalTitle = $('<h1>' + item.name + '</h1>');

    var modalContentType = $('<p>Type: ' + item.types + '</p>');

    var modalContentHeight = $('<p>Height: ' + item.height + '</p>');

    var modalContentImage = $('<img class="pokemon-image">');
    modalContentImage.attr('src', item.imageUrl);

    // append items to modal, append modal to modal-container:
    modal.append(closeModalButton);
    modal.append(modalTitle);
    modal.append(modalContentType);
    modal.append(modalContentHeight);
    modal.append(modalContentImage);
    $modalContainer.append(modal);
  }

  // function to hide modal:
  function hideModal() {
    $modalContainer.removeClass('is-visible');
  }
  // add event listener to close modal when "escape" key pressed:
$(window).keydown(function(e) {
  if (e.key === "Escape") {
    hideModal();
  }
});

  // event listener for clicking outside modal to close:
  $modalContainer.on('click', (e) => {
        // this is triggered even when clicking INSIDE modal
        // we only want this to close modal when clicking ouside modal:
        var target = e.target;
        if (target === $modalContainer) {
          hideModal();
        } // this function isn't working!!!! WHY?!?!?!?!
      });

  // add function to show details and update to show modal:
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      pokemonRepository.showModal(item);
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
    showDetails: showDetails,
    showModal: showModal,
    hideModal: hideModal
  };

})(); // end IIFE.

// create list of pokemon buttons:
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
