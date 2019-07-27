import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import ChefIndexPage from "./routes/ChefIndexPage/Index";
import WaiterIndexPage from "./routes/WaiterIndexPage/Index";
import SetProductStock from "./routes/SetProductStock/Index";
import ChefWorkSpace from "./routes/ChefWorkArea/Index";
import WaiterWorkArea from "./routes/WaiterWorkArea/Index";
import SetPriorityProduct from "./routes/SetPriorityProduct/Index";
import MainNav from "./routes/MainNav/Index";

function RouterConfig({ history, text }) {
  return (
    <BrowserRouter history={history}>
      <Switch>
        <Route path="/" exact component={MainNav} />
        <Route path="/chef" exact component={ChefIndexPage} />
        <Route path="/waiter" exact component={WaiterIndexPage} />
        <Route path="/setProductStock" exact component={SetProductStock} />
        <Route path="/chefWorkSpace" exact component={ChefWorkSpace} />
        <Route path="/waiterWorkSpace" exact component={WaiterWorkArea} />
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
