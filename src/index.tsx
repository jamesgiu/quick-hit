import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import {Provider} from "react-redux";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import persistStore from "redux-persist/es/persistStore";
import {PersistGate} from "redux-persist/integration/react";
import store from "./redux/types/store";

TimeAgo.addDefaultLocale(en);

const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA