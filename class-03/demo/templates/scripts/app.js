'use strict';

$(() => {
  const ajaxSettings = { method: 'get', dataType: 'json'};
  $.ajax('./data/dataSet.json', ajaxSettings)
    .then((data) => {
      const arrayOfNeighborhoods = data.neighborhoods;
      arrayOfNeighborhoods.forEach(neighborhoodObj => {
        Neighborhood.all.push(new Neighborhood(neighborhoodObj));
      });
    })
    .then(() => {
      renderNeighborhoods();
    });;
});


function Neighborhood(obj) {
  for(let key in obj) {
    this[key] = obj[key];
  }
  this.url = `https://www.google.com/maps/place/${this.name}+Neighborhood,${this.city}`;
  this.stars = function() {
    let result ='';
    let fullStar = '<i class="fa fa-star"></i>';
    let emptyStar = '<i class="fa fa-star-o"></i>';
    let halfStar = '<i class="fa fa-star-half-o"></i>';
    result += fullStar.repeat(this.rating);
    result += this.rating % 1 !== 0 ? halfStar : '';
    result += emptyStar.repeat(5-this.rating);
    return result + ' (' + this.rating + ')';
  };
}

Neighborhood.all = [];

Neighborhood.prototype.render = function () {
  const templateHTML = $('#neighborhood-template').html();
  const renderedHTML = Mustache.render(templateHTML, this);
  return renderedHTML;
};

	
function renderNeighborhoods() {
  Neighborhood.all.forEach(neighborhood => $('#neighborhoods').append(neighborhood.render()));
}
