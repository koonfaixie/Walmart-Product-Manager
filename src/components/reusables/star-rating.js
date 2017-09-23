import React from 'react';

export default class StarRating extends React.Component {

	render() {
		return (
			<div className="star-ratings">
			  <div style={{width:(this.props.value*100/this.props.stars)+"%"}} className="star-ratings-top"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
			  <div className="star-ratings-bottom"><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div>
			</div>
		)
	}
}
