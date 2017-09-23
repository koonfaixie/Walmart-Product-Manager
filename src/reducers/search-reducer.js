import { filter_results } from '../functions/filter';
import { LIST_OF_SORTS } from '../constants/sorts';

export default function reducer(state={
	updated: false,
	search_pending: false,
	search_input: '',
	query: '',
	day: 1,
  page: '1',
  results: [],
	filtered_results: [],
	sort: "Relevance",
  brand_filter: [],
  keyword_filter: [],
	save_brand_pending: false,
	save_brand_error: false,
	save_brand_success: false,
	}, action) {
	switch (action.type) {
		case "UPDATED_URL": {
			return Object.assign({}, state, {updated: false})
			break;
		}
		case "SET_PAGE": {
			return Object.assign({}, state, {page: action.page})
			break;
		}
		case "SET_FILTER": {
			if (action.brand) {
				let new_brand_filter = state.brand_filter.slice()
				action.filter.split(',').map((filter)=>{
					if (new_brand_filter.indexOf(filter) < 0) {
						new_brand_filter.push(filter)
					}
				})
				let new_filtered_results = filter_results(state.results, state.sort, new_brand_filter, state.keyword_filter);
				return Object.assign({}, state, {filtered_results: new_filtered_results, brand_filter: new_brand_filter})
			} else {
				let new_keyword_filter = state.keyword_filter.slice()
				action.filter.split(',').map((filter)=>{
				  if (new_keyword_filter.indexOf(filter) < 0) {
				    new_keyword_filter.push(filter)
				  }
				})
				let new_filtered_results = filter_results(state.results, state.sort, new_keyword_filter, state.keyword_filter);
				return Object.assign({}, state, {filtered_results: new_filtered_results, keyword_filter: new_keyword_filter})
			}
			break;
		}
		case "SET_SORT": {
			if (LIST_OF_SORTS.indexOf(action.sort.replace('%20',' ')) > -1){
				let new_filtered_results = filter_results(state.results, action.sort.replace('%20',' '), state.brand_filter, state.keyword_filter);
				return Object.assign({}, state, {sort: action.sort.replace('%20',' '), filtered_results: new_filtered_results})
			}
			break;
		}
		case "SET_DAY": {
			return Object.assign({}, state, {day: parseInt(action.day)})
			break;
		}
		case "SET_SEARCH": {
			return Object.assign({}, state, {query: action.query, day: action.day, updated: true})
			break;
		}
		case "HANDLE_SEARCH_INPUT": {
			return Object.assign({}, state, {search_input: action.val})
			break;
		}
		case "START_SEARCH_PENDING": {
			return Object.assign({}, state, {search_pending: true})
			break;
		}
		case "START_SEARCH_REJECTED": {
			return Object.assign({}, state, {search_pending: false})
			break;
		}
		case "START_SEARCH_FULFILLED": {
			let new_filtered_results = filter_results(action.payload.data, state.sort, state.brand_filter, state.keyword_filter);
			return Object.assign({}, state, {search_input: '', search_pending: false, results: action.payload.data, filtered_results: new_filtered_results, updated: true})
			break;
		}
		case "HANDLE_BRAND_INPUT": {
			return Object.assign({}, state, {brand_input: action.val})
			break;
		}
		case "UPDATE_BRAND_SUGGESTIONS": {
			return Object.assign({}, state, {brand_list: action.list})
			break;
		}
		case "CHANGE_SORT": {
			let new_sort = "Relevance"
			switch (action.sort) {
				case "product": {
					if (state.sort == "A-Z") {
						new_sort = "Z-A";
					} else {
						new_sort = "A-Z";
					}
					break;
				}
				case "price": {
					if (state.sort == "Lowest price") {
						new_sort = "Highest price";
					} else {
						new_sort = "Lowest price";
					}
					break;
				}
				case "reviews": {
					if (state.sort == "Highest rating") {
						new_sort = "Lowest rating";
					} else {
						new_sort = "Highest rating";
					}
					break;
				}
			}
			let new_filtered_results = filter_results(state.results, new_sort, state.brand_filter, state.keyword_filter);
			return Object.assign({}, state, {sort: new_sort, filtered_results: new_filtered_results, updated: true})
			break;
		}
		case "ADD_FILTER": {
			if (action.brand) {
				let new_brand_filter = state.brand_filter.slice()
				if (new_brand_filter.indexOf(action.filter) < 0) {
					new_brand_filter.push(action.filter)
					let new_filtered_results = filter_results(state.results, state.sort, new_brand_filter, state.keyword_filter);
					return Object.assign({}, state, {filtered_results: new_filtered_results, brand_filter: new_brand_filter, updated: true})
				}
			} else {
				let new_keyword_filter = state.keyword_filter.slice()
				if (new_keyword_filter.indexOf(action.filter) < 0) {
				  new_keyword_filter.push(action.filter)
				  let new_filtered_results = filter_results(state.results, state.sort, state.brand_filter, new_keyword_filter);
				  return Object.assign({}, state, {filtered_results: new_filtered_results, keyword_filter: new_keyword_filter, updated: true})
				}
			}
			break;
		}
		case "REMOVE_FILTER": {
			if (action.brand) {
				let new_brand_filter = state.brand_filter.slice();
				let index = new_brand_filter.indexOf(action.filter);
				if (index > -1) {
					new_brand_filter.splice(index, 1)
					let new_filtered_results = filter_results(state.results, state.sort, new_brand_filter, state.keyword_filter);
					return Object.assign({}, state, {filtered_results: new_filtered_results, brand_filter: new_brand_filter, updated: true})
				}
			} else {
				let new_keyword_filter = state.keyword_filter.slice();
				let index = new_keyword_filter.indexOf(action.filter);
				if (index > -1) {
					new_keyword_filter.splice(index, 1)
					let new_filtered_results = filter_results(state.results, state.sort, state.brand_filter, new_keyword_filter);
					return Object.assign({}, state, {filtered_results: new_filtered_results, keyword_filter: new_keyword_filter, updated: true})
				}
			}
			break;
		}
		case "REMOVE_SORT": {
			let new_filtered_results = filter_results(state.results, 'Relevance', state.brand_filter, state.keyword_filter);
			return Object.assign({}, state, {sort: 'Relevance', filtered_results: new_filtered_results, updated: true})
			break;
		}
		case "HANDLE_PAGE": {
			let new_page = action.val
			if (action.val > Math.floor(state.filtered_results.length/25)) {
				new_page = Math.floor(state.filtered_results.length/25)+1
			}
			return Object.assign({}, state, {page: new_page, updated: true})
			break;
		}
		case "SAVE_BRAND_PENDING": {
			return Object.assign({}, state, {save_brand_pending: true, save_brand_error: false})
			break;
		}
		case "SAVE_BRAND_REJECTED": {
			return Object.assign({}, state, {save_brand_pending: false, save_brand_error: true})
			break;
		}
		case "SAVE_BRAND_FULFILLED": {
			if (action.payload.data['success']) {
				let updated_item = action.payload.data['success'];
				let new_results = state.results.slice();
				let new_filtered_results = state.filtered_results.slice();
				// replaces old item with updated item in our results and filtered results array
				let new_results_index = new_results.findIndex(r => r.item_id == updated_item['item_id']);
				let new_filtered_results_index = new_filtered_results.findIndex(r => r.item_id == updated_item['item_id']);
				new_results.splice(new_results_index, 1, updated_item);
				new_filtered_results.splice(new_filtered_results_index, 1, updated_item);
				return Object.assign({}, state, {save_brand_pending: false, save_brand_error: false, save_brand_success: true, results: new_results, filtered_results: new_filtered_results, updated: true})
			} else {
				return Object.assign({}, state, {save_brand_pending: false, save_brand_error: true, updated: true})
			}
			break;
		}
		case "CLOSE_ALERT": {
			return Object.assign({}, state, {save_brand_pending: false, save_brand_error: false, save_brand_success: false})
			break;
		}
	}
	return state;
};
