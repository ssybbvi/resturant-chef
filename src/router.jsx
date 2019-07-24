import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import IndexPage from "./routes/IndexPage/Index";
import SetProductStock from "./routes/SetProductStock/Index";
import WorkSpace from "./routes/WorkArea/Index";
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
