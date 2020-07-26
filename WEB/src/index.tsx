import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// eslint-disable-next-line                                                                                                                                                             
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavBar from './component/Navbar'
import "bootstrap/dist/css/bootstrap.min.css";
import Home from './component/App';

const routing = (
  <Router>
    <div>
      <NavBar/>
        <Switch>
            <Route exact path="/" component={Home} />
        </Switch>
    </div>
  </Router>
)

ReactDOM.render(routing, document.getElementById('root'))