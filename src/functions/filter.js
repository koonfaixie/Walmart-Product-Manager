export function filter_results(results, filter, brand_filter, keyword_filter) {
  var new_results = results.slice();
  // not optimal - Big O notation O(n^2)
  if (brand_filter.length > 0) {
    let brand_filtered_results = []
    new_results.forEach((result)=>{
      brand_filter.forEach((brand)=>{
        if (result.brand) {
          if (result.brand.toLowerCase().includes(brand.toLowerCase())) {
            brand_filtered_results.push(result)
          }
        }
      })
    })
    new_results = brand_filtered_results;
  }
  if (keyword_filter.length > 0) {
    let keyword_filtered_results = []
    new_results.forEach((result)=>{
      keyword_filter.forEach((keyword)=>{
        if (result.name.toLowerCase().includes(keyword.toLowerCase())) {
          keyword_filtered_results.push(result)
        }
      })
    })
    new_results = keyword_filtered_results;
  }
  if (filter == "Highest price") {
    new_results.sort(function(a,b) {return (a.price < b.price) ? 1 : ((b.price < a.price) ? -1 : 0);})
  } else if (filter == "Lowest price") {
    new_results.sort(function(a,b) {return (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0);})
  } else if (filter == "Highest rating") {
    new_results.sort(function(a,b) {return (a.review_score < b.review_score) ? 1 : ((b.review_score < a.review_score) ? -1 : 0);})
  } else if (filter == "Lowest rating") {
    new_results.sort(function(a,b) {return (a.review_score > b.review_score) ? 1 : ((b.review_score > a.review_score) ? -1 : 0);})
  } else if (filter == "Z-A") {
    new_results.sort(function(a,b) {return (a.name < b.name) ? 1 : ((b.name < a.name) ? -1 : 0);})
  } else if (filter == "A-Z") {
    new_results.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);})
  }
  return new_results;
}
