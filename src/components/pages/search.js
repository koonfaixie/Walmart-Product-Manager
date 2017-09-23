import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import TableItem from '../reusables/table-item';
import { BRANDS } from '../../constants/brands';
import {
  set_sort,
  set_page,
  set_filter,
  set_day,
  handle_search_input,
  start_search,
  toggle_price_sort,
  toggle_product_sort,
  toggle_reviews_sort,
  remove_sort,
  add_filter,
  remove_filter,
  handle_page,
  close_alert,
  update_url
} from '../../actions/search-actions';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      brand_filter_input: '',
      keyword_filter_input: '',
    };
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this._numbers = '0123456789';
  }

  componentWillMount() {
    let search = this.props.router.location.search;
    if (search) {
      let dict = {}
      let params = search.slice(1).split('&');
      params.forEach(function(str){let tmp = str.split('='); dict[tmp[0]] = tmp[1]})
      if (dict['page']) {
        set_page(dict['page'])
      }
      if (dict['sort']) {
        set_sort(dict['sort'])
      }
      if (dict['brand']) {
        set_filter(dict['brand'], true)
      }
      if (dict['keyword']) {
        set_filter(dict['keyword'], false)
      }
      if (dict['query'] && dict['day']) {
        start_search(dict['query'], dict['day'])
      }
    }
  }

  componentDidUpdate() {
    if (this.props.updated) {
      update_url(this.props.query, this.props.day, this.props.page, this.props.sort, this.props.brand_filter, this.props.keyword_filter)
    }
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  afterOpenModal() {
    this.setState({
      brand_filter_input: '',
      keyword_filter_input: ''
    })
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  handleBrandInput(e) {
    this.setState({brand_filter_input: e.target.value})
  }

  handleKeywordInput(e) {
    this.setState({keyword_filter_input: e.target.value})
  }

  filterBrand() {
    if (this.state.brand_filter_input.length > 0) {
      this.setState({modalIsOpen: false}, ()=>{
        add_filter(this.state.brand_filter_input, true)
      })
    }
  }

  filterKeyword() {
    if (this.state.keyword_filter_input.length > 0) {
      this.setState({modalIsOpen: false}, ()=>{
        add_filter(this.state.keyword_filter_input, false)
      })
    }
  }

  handlePage(e) {
    let newText= '';
    let inputValue = e.target.value
    for (var i = 0; i < inputValue.length; i++) {
        if (this._numbers.indexOf(inputValue[i]) > -1) {
            newText= newText+inputValue[i];
        }
    }
    if (newText == '0') {
      newText = 1;
    }
    handle_page(newText)
  }

  nextPage() {
    if (this.props.page > 0) {
      handle_page(parseInt(this.props.page)+1)
    } else {
      handle_page(1)
    }
  }

  prevPage() {
    if (this.props.page > 1) {
      handle_page(parseInt(this.props.page)-1)
    } else {
      handle_page(1)
    }
  }

  handleSearchKey(e) {
    if (e.key == 'Enter') {
      start_search(this.props.search_input, this.props.day)
    }
  }

	render() {
		return (
			<div className="search">
        {this.props.save_brand_pending ?
          <div className="save-brand pending">
            Saving... <i className="fa fa-spinner fa-pulse fa-1x fa-fw"></i>
          </div>
          :
          this.props.save_brand_success ?
            <div className="save-brand success">
              Success! <a onClick={close_alert}> <i className="fa fa-times" aria-hidden="true"></i> </a>
            </div>
            :
            this.props.save_brand_error ?
              <div className="save-brand error">
                  There was an error! <a onClick={close_alert}> <i className="fa fa-times" aria-hidden="true"></i> </a>
              </div>
              :
              null
        }
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Filter Modal"
          >
          <div className="filter-modal">
            <label> Add filters to your search query: </label>
            <div>
              <input className="inp" type="text" placeholder="Brand" value={this.state.brand_filter_input} onChange={this.handleBrandInput.bind(this)}/>
              <button className="btn" onClick={this.filterBrand.bind(this)}> filter by brand </button>
            </div>
            <div>
              <input className="inp" type="text" placeholder="Keyword" value={this.state.keyword_filter_input} onChange={this.handleKeywordInput.bind(this)}/>
              <button className="btn" onClick={this.filterKeyword.bind(this)}> filter by keyword </button>
            </div>
          </div>
        </Modal>
        <div className="options">
          <div className="options-search">
            <div className="logo">
              Walmart Product Manager
            </div>
            <div>
              <input className="inp" type="text" placeholder="Search products" onChange={handle_search_input} value={this.props.search_input}/>
              <label> Day: </label> <select className="day" onChange={(e)=>{set_day(e.target.value)}} value={this.props.day}>
                <option value="1"> 1 </option>
                <option value="2"> 2 </option>
              </select>
            </div>
            <div>
              <button className="btn" onClick={()=>{start_search(this.props.search_input, this.props.day)}}> New search </button>
            </div>
          </div>
          <div className="options-filter">
            <div className="filters-and-sorts">
              <div className="sorts">
                <label> Sort by: </label>
                <div className="sort"> {this.props.sort}
                  {this.props.sort != "Relevance" ?
                    <a className="option" onClick={remove_sort}>
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </a>
                    : null}
                </div>
              </div>
              <div className="filters">
                <label> Filters: </label>
                  {this.props.brand_filter ?
                    this.props.brand_filter.map((filter, index) =>
                      <div className="filter" key={index}> {filter}
                        <a className="option" onClick={()=>{remove_filter(filter, true)}}>
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </a>
                      </div>
                    )
                  : null}
                  {this.props.keyword_filter ?
                    this.props.keyword_filter.map((filter, index) =>
                      <div className="filter" key={index}> {filter}
                        <a className="option" onClick={()=>{remove_filter(filter, false)}}>
                          <i className="fa fa-times" aria-hidden="true"></i>
                        </a>
                      </div>
                    )
                  : null}
                <div className="add" onClick={this.openModal.bind(this)}> <i className="fa fa-plus" aria-hidden="true"></i> </div>
              </div>
            </div>
          </div>
          <div className="results-count">
            <div className="count">
              <label> Results: </label>
              {this.props.filtered_results.length < 25 ? this.props.filtered_results.length : this.props.filtered_results.length > (this.props.page) * 25 ? (this.props.page) * 25 : this.props.filtered_results.length } of {this.props.filtered_results.length} products ({this.props.results.length} total)
            </div>
            <div className="page">
              <button role="button" onClick={this.prevPage.bind(this)}> <i className="fa fa-caret-left" aria-hidden="true"></i> </button>
              <label> Page </label>
              <input type="text" value={this.props.page} onChange={this.handlePage.bind(this)}/>
              <button onClick={this.nextPage.bind(this)}> <i className="fa fa-caret-right" aria-hidden="true"></i> </button>
            </div>
          </div>
          <div className="results-table">
            <table>
              <tbody>
                <tr className="headers">
                  <th className="product-head" onClick={toggle_product_sort}>
                    Product
                    {this.props.sort == 'Z-A' ?
                      <i className="fa fa-caret-down" aria-hidden="true"></i>
                      : this.props.sort == 'A-Z' ?
                        <i className="fa fa-caret-up" aria-hidden="true"></i>
                        : null}
                  </th>
                  <th className="brand-head"> Brand </th>
                  <th className="category-head"> Category </th>
                  <th className="price-head" onClick={toggle_price_sort}>
                    Price
                    {this.props.sort == 'Highest price' ?
                      <i className="fa fa-caret-down" aria-hidden="true"></i>
                      : this.props.sort == 'Lowest price' ?
                        <i className="fa fa-caret-up" aria-hidden="true"></i>
                        : null}
                  </th>
                  <th className="msrp-head"> MSRP </th>
                  <th className="reviews-head" onClick={toggle_reviews_sort}>
                    Reviews
                    {this.props.sort == "Highest rating" ?
                      <i className="fa fa-caret-down" aria-hidden="true"></i>
                      : this.props.sort == 'Lowest rating' ?
                        <i className="fa fa-caret-up" aria-hidden="true"></i>
                        : null}
                  </th>
                </tr>
                {this.props.filtered_results.slice((this.props.page-1)*25,(this.props.page)*25).map((item, index) =>
                  <TableItem key={index} item={item} brands={BRANDS}/>
                )}
              </tbody>
            </table>
          </div>
        </div>
			</div>
		)
	}
}

export default connect((store) => {
	return {
    updated: store.search.updated,
    query: store.search.query,
    day: store.search.day,
    search_input: store.search.search_input,
    page: store.search.page,
    sort: store.search.sort,
    brand_filter: store.search.brand_filter,
    keyword_filter: store.search.keyword_filter,
    results: store.search.results,
    filtered_results: store.search.filtered_results,
    save_brand_pending: store.search.save_brand_pending,
    save_brand_error: store.search.save_brand_error,
    save_brand_success: store.search.save_brand_success,
    router: store.router
	};
})(Search);
