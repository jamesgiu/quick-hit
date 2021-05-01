import React from 'react';
import {Redirect, Route, BrowserRouter, Switch} from "react-router-dom";
import './App.css';
import Home from "./components/Home/Home";
import NotFound from "./components/NotFound/NotFound";
import Ladder from "./components/Ladder/Ladder";
import Footer from "./components/Footer/Footer";
import {TTPage} from "./util/TTPage";

function App() {
  return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path={TTPage.HOME} component={Home}/>
            <Route exact path={TTPage.LADDER} component={Ladder}/>
            <Route exact path={TTPage.NOT_FOUND} component={NotFound}/>
            <Redirect to={TTPage.NOT_FOUND}/>
          </Switch>
          <Footer/>
        </div>
      </BrowserRouter>
  );
}

export default App;
