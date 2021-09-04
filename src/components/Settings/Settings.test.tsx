import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { combineReducers, createStore, Reducer } from "redux";
import { viewInitialState, viewReducer } from "../../redux/reducers/ViewReducer";
import { dataInitialState, ttReducer } from "../../redux/reducers/TTReducer";
import { authInitialState, authReducer } from "../../redux/reducers/AuthReducer";
import { Provider } from "react-redux";
import Settings from "./Settings";

it("renders without crashing", () => {
    const reducers = combineReducers({
        viewStore: viewReducer as Reducer,
        ttData: ttReducer as Reducer,
        authStore: authReducer as Reducer,
    });

    const store = createStore(reducers as Reducer, {
        ttData: dataInitialState,
        viewStore: viewInitialState,
        authStore: authInitialState,
    });

    render(
        <Provider store={store}>
            <BrowserRouter>
                <Settings />
            </BrowserRouter>
        </Provider>
    );
});
