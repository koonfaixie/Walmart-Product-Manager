import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { history } from './history';

import Search from './components/pages/search';

class Routes extends React.Component {

	render() {
		return (
      <ConnectedRouter history={history}>
        <Switch>
        	<Route exact path='/' component={Search}/>
        </Switch>
      </ConnectedRouter>
		)
	}
}

export default connect((store) => {
	return {
	};
})(Routes);
