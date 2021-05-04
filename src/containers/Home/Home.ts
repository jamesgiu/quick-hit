import {QuickHitReduxStores} from "../../index";
import {PageDimensions} from "../../types/types";
import {Dispatch} from "redux";
import * as actions from "../../redux/actions/PageActions";
import {connect} from "react-redux";
import Home from "../../components/Home/Home";

export function mapStateToProps(store: QuickHitReduxStores) {
    return {
        pageDimensions: store.page.dimensions,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<actions.SetPageDimensionsAction>) {
    return {
        setPageDimensions: (newPageDimensions: PageDimensions) => dispatch(actions.setPageDimensions(newPageDimensions)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);