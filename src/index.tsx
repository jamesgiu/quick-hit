import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import {createStore, Reducer} from "redux";
import {Provider} from "react-redux";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {dataInitialState, ttReducer} from "./redux/reducers/TTReducer";

TimeAgo.addDefaultLocale(en);

const reducer = ttReducer as Reducer;
export const store = createStore(reducer,  dataInitialState);

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA