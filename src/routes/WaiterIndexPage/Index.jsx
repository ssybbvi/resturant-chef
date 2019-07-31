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
        <NavBar
          leftContent={[
            <Link key="1" to="/">
              <Icon type="left" />
            </Link>
          ]}
          mode="light"
        >
          马云
        </NavBar>
        <List renderHeader={() => "好好工作，天天向上"} className="my-list">
          <Link to="/waiterWorkSpace" key="waiterWorkSpace">
            <Item arrow="horizontal">工作区</Item>
          </Link>
          <Link to="/setProductStock" key="setProductStock">
            <Item arrow="horizontal">设置菜品数量</Item>
          </Link>
        </List>
      </div>
    );
  }
}
