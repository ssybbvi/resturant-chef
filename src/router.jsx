import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import IndexPage from "./routes/IndexPage";
import SetProductStock from "./routes/SetProductStock";
import WorkSpace from "./routes/WorkArea";
import SetPriorityProduct from "./routes/SetPriorityProduct/Index";

function RouterConfig({ history, text }) {
  return (
    <BrowserRouter history={history}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/setProductStock" exact component={SetProductStock} />
        <Route path="/workSpace" exact component={WorkSpace} />
        <Route
          path="/setPriorityProduct"
          exact
          component={SetPriorityProduct}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default RouterConfig;
