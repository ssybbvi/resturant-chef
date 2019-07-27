import React from "react";
import { NavBar, Icon, List } from "antd-mobile";
import { Link } from "react-router-dom";
import axios from "../../webapi/index";

let Item = List.Item;

export default class IndexPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <NavBar mode="light">选择角色（测试）</NavBar>
        <List renderHeader={() => "好好工作，天天向上"} className="my-list">
          <Link to="/chef">
            <Item arrow="horizontal">厨师</Item>
          </Link>
          <Link to="/waiter">
            <Item arrow="horizontal">上菜服务生</Item>
          </Link>
        </List>
      </div>
    );
  }
}
