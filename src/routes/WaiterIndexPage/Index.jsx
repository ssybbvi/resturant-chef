import React from "react";
import { NavBar, Icon, List } from "antd-mobile";
import { Link } from "react-router-dom";
import axios from "../../webapi/index";

let Item = List.Item;

export default class IndexPage extends React.Component {
  constructor() {
    super();
    //this.loadChefInfo();
  }

  loadChefInfo = () => {
    let self = this;
    axios.get("/user", { params: { _id: "1" } });
  };

  render() {
    return (
      <div>
        <NavBar mode="light">王小二</NavBar>
        <List renderHeader={() => "好好工作，天天向上"} className="my-list">
          <Link to="/waiterWorkSpace">
            <Item arrow="horizontal">工作区</Item>
          </Link>
          <Link to="/setProductStock">
            <Item arrow="horizontal">设置菜品数量</Item>
          </Link>
        </List>
      </div>
    );
  }
}
