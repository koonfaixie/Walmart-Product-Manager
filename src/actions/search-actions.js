import store from '../store';
import axios from 'axios';
import { history } from '../history';

// update url

export function update_url(query, day, page, sort, brand, keyword) {
  if (query && day){
    let new_url = '/?';
    new_url = new_url.concat('query='+query);
    new_url = new_url.concat('&day='+day);
    if (page) {new_url = new_url.concat('&page='+page);}
    if (sort) {new_url = new_url.concat('&sort='+sort);}
    if (brand) {new_url = new_url.concat('&brand='+brand.toString());}
    if (keyword) {new_url = new_url.concat('&keyword='+keyword.toString());}
    store.dispatch({type: "UPDATED_URL"})
    history.push(new_url)
  }
}

// actions upon component mount

export function set_page(page) {
  store.dispatch({type: "SET_PAGE", page: page})
}

export function set_filter(filter, isBrand) {
  store.dispatch({type: "SET_FILTER", filter: filter, isBrand})
}

export function set_sort(sort) {
  store.dispatch({type: "SET_SORT", sort: sort})
}

export function set_day(day) {
  store.dispatch({type: "SET_DAY", day: day})
}

// handle search

export function handle_search_input(e) {
  store.dispatch({type: "HANDLE_SEARCH_INPUT", val: e.target.value})
}

// start search
export function start_search(query, day) {
  store.dispatch({type: "START_SEARCH", payload: axios.get('/api/product/?query='+query+'&day='+day)}).then(()=>{
    store.dispatch({type: "SET_SEARCH", query: query, day: day})
  })
}

// filter-modal
export function handle_brand_input(val) {
  store.dispatch({type: "HANDLE_BRAND_INPUT", val: val})
}

export function update_brand_suggestions(list) {
  store.dispatch({type: "UPDATE_BRAND_SUGGESTIONS", list: list})
}

// sorting options
export function toggle_product_sort() {
  store.dispatch({type: "CHANGE_SORT", sort: "product"})
}

export function toggle_price_sort() {
  store.dispatch({type: "CHANGE_SORT", sort: "price"})
}

export function toggle_reviews_sort() {
  store.dispatch({type: "CHANGE_SORT", sort: "reviews"})
}

export function remove_sort() {
  store.dispatch({type: "REMOVE_SORT"})
}

// filter options
export function add_filter(filter, isBrand) {
  store.dispatch({type: "ADD_FILTER", filter: filter, brand: isBrand})
}

export function remove_filter(filter, isBrand) {
  store.dispatch({type: "REMOVE_FILTER", filter: filter, brand: isBrand})
}

export function save_brand(id, brand) {
  store.dispatch({type: "SAVE_BRAND", payload: axios.post('/api/product/', {product_id: id, brand: brand})})
}

// page handler

export function handle_page(val) {
  store.dispatch({type: "HANDLE_PAGE", val: val})
}

// alerts

export function close_alert() {
  store.dispatch({type: "CLOSE_ALERT"})
}
