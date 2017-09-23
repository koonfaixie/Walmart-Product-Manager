import React from 'react';
import { connect } from 'react-redux';
import StarRating from './star-rating';
import { handle_brand_input, update_brand_suggestions, save_brand } from '../../actions/search-actions';

export default class TableItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      brand_focused: false,
      brand_input: '',
      brand_list: [],
    }
  }

  toggleOn(e) {
    e.stopPropagation();
    if (this.state.brand_focused == false) {
      this.setState({
        brand_focused: true,
        brand_input: '',
        brand_list: [],
      })
    }
  }

  toggleOff(e) {
    e.stopPropagation();
    this.setState({
      brand_focused: false
    })
  }

  clickSuggestion(val) {
    this.setState({
      brand_input: val,
      brand_list: [],
    })
  }

  onChange(e) {
    let promise = new Promise((resolve, reject)=>{
      let list = [];
      if (e.target.value.length > 0) {
        this.props.brands.forEach((brand)=>{
          if (brand.toLowerCase().includes(e.target.value.toLowerCase())) {
            list.push(brand)
          }
        })
      }
      resolve(list)
    })
    this.setState({
      brand_input: e.target.value
    })
    promise.then((list)=>{
      this.setState({
        brand_list: list
      })
    })
  }

  saveBrand(){
    this.setState({brand_focused: false}, ()=>{
      save_brand(this.props.item.item_id, this.state.brand_input)
    })
  }

	render() {
		return (
      <tr>
        <td className="product">
          <div className="product-image"> <img src={this.props.item.image}/> </div>
          <div className="product-name"> {this.props.item.name} </div>
          <a href={this.props.item.url} target="_blank"> <i className="fa fa-external-link" aria-hidden="true"></i> </a>
        </td>
        <td className="brand" onClick={this.toggleOn.bind(this)}> {this.state.brand_focused ?
          <div>
            <div>
              <input type="text" value={this.state.brand_input} onChange={this.onChange.bind(this)}/>
              <div className={this.state.brand_list.length > 0 ? "suggestions" : ""}>
                {this.state.brand_list.map((item, index) =>
                  <div key={index}> <a role="button" onClick={()=>{this.clickSuggestion(item)}}> {item} </a> </div>
                )}
              </div>
            </div>
            <div>
              <button className="btn" onClick={this.saveBrand.bind(this)}> Save </button> <button className="btn" onClick={this.toggleOff.bind(this)}> Cancel </button>
            </div>
          </div>
          : this.props.item.brand} </td>
        <td className="category"> {this.props.item.category} </td>
        <td className="price"> {this.props.item.price} </td>
        <td className="msrp"> {this.props.item.msrp} </td>
        <td className="reviews">
            <StarRating value={this.props.item.review_score} stars={5}/>
            {this.props.item.review_count ? <span>({this.props.item.review_count})</span> : null }
        </td>
      </tr>
		)
	}
}
