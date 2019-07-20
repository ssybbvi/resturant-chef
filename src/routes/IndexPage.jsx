import React from "react";
import { NavBar, Icon, List } from "antd-mobile";
import { Link } from "react-router-dom";

let Item = List.Item;

export default class IndexPage extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <NavBar mode="light" rightContent={[<Icon key="1" type="ellipsis" />]}>
          王小二
        </NavBar>
        <List renderHeader={() => "描述语句"} className="my-list">
          <Link to="/setProductStock">
            <Item arrow="horizontal">设置负责的菜品</Item>
          </Link>

          <Link to="/setProductStock">
            <Item arrow="horizontal">设置菜品数量</Item>
          </Link>

          <Link to="/workSpace">
            <Item arrow="horizontal">工作区</Item>
          </Link>
          <Link to="/setPriorityProduct">
            <Item arrow="horizontal">设置优先负责的菜品</Item>
          </Link>
        </List>
      </div>
    );
  }
}
