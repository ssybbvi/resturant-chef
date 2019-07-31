import React from "react";
import { NavBar, Icon, List } from "antd-mobile";
import { Link } from "react-router-dom";
import axios from "../../webapi/index";

let Item = List.Item;

export default class IndexPage extends React.Component {
  constructor() {
    super();
    this.state = {
      isWork: false
    };
    this.loadChefInfo();
  }

  loadChefInfo = () => {
    let self = this;
    axios.get("/user", { params: { _id: "1" } }).then(resolve => {
      self.setState({
        isWork: resolve.data.data[0].isWork
      });
    });
  };

  chefUpdateWork = () => {
    let self = this;
    let isWork = !this.state.isWork;
    axios.post("/user/chefUpdateWork", { userId: "1", isWork }).then(() => {
      self.setState({
        isWork
      });
      axios.post("/scheduling/initWaitCookQueues");
    });
  };

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          leftContent={[
            <Link key="1" to="/">
              <Icon type="left" />
            </Link>
          ]}
          rightContent={[
            <div key="1" onClick={() => this.chefUpdateWork()}>
              {this.state.isWork ? "工作中" : "休息中"}
            </div>
          ]}
        >
          王小二
        </NavBar>
        {this.state.isWork ? (
          <List renderHeader={() => "好好工作，天天向上"} className="my-list">
            <Link to="/chefWorkSpace" kye="chefWorkSpace">
              <Item arrow="horizontal">工作区</Item>
            </Link>
            <Link to="/setProductStock" kye="setProductStock">
              <Item arrow="horizontal">设置菜品数量</Item>
            </Link>
            <Link to="/setPriorityProduct" kye="setPriorityProduct">
              <Item arrow="horizontal">设置优先负责的菜品</Item>
            </Link>
          </List>
        ) : null}
      </div>
    );
  }
}
