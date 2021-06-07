import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import './App.css';
import Home from "./containers/Home/";
import NotFound from "./components/NotFound/NotFound";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Ladder from "./containers/Ladder";
import {QuickHitPage} from "./util/QuickHitPage";
import Toast from "./components/Toast/Toast";
import RecentGames from "./containers/RecentGames";
import PlayerStatistics from "./containers/PlayerStatistics";
import QHDataLoader from "./containers/QHDataLoader";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <QHDataLoader/>
                <Navbar/>
                <div className={"app-main-content"}>
                    <Switch>
                        <Route exact path={QuickHitPage.HOME} component={Home}/>
                        <Route exact path={QuickHitPage.LADDER} component={Ladder}/>
                        <Route exact path={QuickHitPage.RECENT_GAMES} component={RecentGames}/>
                        <Route exact path={QuickHitPage.STATISTICS} component={PlayerStatistics}/>
                        <Route exact path={QuickHitPage.NOT_FOUND} component={NotFound}/>
                        <Redirect to={QuickHitPage.NOT_FOUND}/>
                    </Switch>
                </div>
                <Toast/>
                <Footer/>
            </div>
        </BrowserRouter>
    );
}

export default App;
