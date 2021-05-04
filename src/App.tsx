import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import './App.css';
import Home from "./containers/Home/";
import NotFound from "./components/NotFound/NotFound";
import Ladder from "./components/Ladder/Ladder";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Players from "./components/Players/Players";
import {QuickHitPage} from "./util/QuickHitPage";
import Toast from "./components/Toast/Toast";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar/>
                <div className={"app-main-content"}>
                    <Switch>
                        <Route exact path={QuickHitPage.HOME} component={Home}/>
                        <Route exact path={QuickHitPage.LADDER} component={Ladder}/>
                        <Route exact path={QuickHitPage.PLAYERS} component={Players}/>
                        <Route exact path={QuickHitPage.NOT_FOUND} component={NotFound}/>
                        <Redirect to={QuickHitPage.NOT_FOUND}/>
                    </Switch>
                </div>
                <Footer/>
                <Toast/>
            </div>
        </BrowserRouter>
    );
}

export default App;
