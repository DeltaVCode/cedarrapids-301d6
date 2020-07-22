'use strict';

$(() => {
  $('#photo-gallery').hide();
  const ajaxSettings = { method: 'get', dataType: 'json' };
  $.ajax('./data/people.json', ajaxSettings)
    .then((data) => {
      const arrayOfPeople = data.results;
      arrayOfPeople.forEach((person) => {
        Person.all.push(new Person(person));
      });
    })
    .then(() => {
      renderPeople();
      renderFilters();
      handleFilters();
      $('.spinner').fadeOut();
      $('#photo-gallery').fadeIn();
    });
});

function Person(person) {
  this.name = {
    first: person.name.first,
    last: person.name.last
  };
  this.image_url = person.picture.large;
  this.location = {
    city: person.location.city,
    state: person.location.state
  };
  this.getFullName = () => `${this.name.first} ${this.name.last}`;
  this.nationality = person.nat;
  if(Person.allNationalities.indexOf(this.nationality) < 0) {
    Person.allNationalities.push(this.nationality);
  }
}

Person.all = [];
Person.allNationalities = [];

Person.prototype.render = function () {
  let $template = $('.person-template').clone();
  $template.removeClass('person-template');
  $template.find('.fullName').text(this.getFullName);
  $template.find('.profileImage').attr('src', this.image_url);
  $template.find('.profileImage').attr('alt', this.getFullName);
  $template.find('.location').text(`${this.location.city}, ${this.location.state}`);
  $template.attr('data-nationality', this.nationality);
  return $template;
};

function renderPeople() {
  Person.all.forEach(person => $('#photo-gallery').append(person.render()));
  $('.person-template').remove();
}

function renderFilters() {
  Person.allNationalities.sort();
  Person.allNationalities.forEach(nationality => {
    const $option = $('<option>').text(nationality).attr('value', nationality);
    $('#nationality-filter').append($option);
  });
}

function handleFilters() {
  $('#nationality-filter').on('change', function() {
    if($(this).val() !== '') {
      $('.person').hide();
      $(`.person[data-nationality*="${$(this).val()}"]`).fadeIn();
    } else {
      $('.person').fadeIn();
    }
  });
}
