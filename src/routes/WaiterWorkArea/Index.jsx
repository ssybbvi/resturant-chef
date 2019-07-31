import React from "react";
import {
  NavBar,
  Icon,
  List,
  Flex,
  Checkbox,
  Tabs,
  Badge,
  SwipeAction
} from "antd-mobile";
import { Link } from "react-router-dom";
import axios from "../../webapi/index";
import { subscriptionSocket } from "../../webapi/api";
import { productStatus } from "../../webapi/enumerate";

let Item = List.Item;
const CheckboxItem = Checkbox.CheckboxItem;

const tableMode = {
  prepareTransportOrderItemList: 1,
  waiterTransportOrderItemList: 2
};

export default class IndexPage extends React.Component {
  constructor() {
    super();

    this.state = {
      prepareTransportOrderItemList: [],
      waiterTransportOrderItemList: [],
      tableMode: tableMode.prepareTransportOrderItemList
    };

    this.destroySocketList = [];

    this.destroySocketList.push(
      subscriptionSocket("transportingOrderItem", () => {
        this.loadPrepareTransportOrderItem();
        this.loadWaiterTransportOrderItem();
      })
    );

    this.destroySocketList.push(
      subscriptionSocket("cancelTransportOrderItem", () => {
        this.loadPrepareTransportOrderItem();
        this.loadWaiterTransportOrderItem();
      })
    );

    this.destroySocketList.push(
      subscriptionSocket("finishOrderItem", () => {
        this.loadPrepareTransportOrderItem();
      })
    );

    this.destroySocketList.push(
      subscriptionSocket("transportedOrderItem", () => {
        this.loadPrepareTransportOrderItem();
        this.loadWaiterTransportOrderItem();
      })
    );

    this.loadPrepareTransportOrderItem();
    this.loadWaiterTransportOrderItem();
  }

  componentWillUnmount() {
    this.destroySocketList.forEach(item => item());
  }

  loadPrepareTransportOrderItem = () => {
    let self = this;
    axios
      .get("/restaurant/loadPrepareTransportOrderItem", {
        params: { waiterId: "11" }
      })
      .then(resolve => {
        let list = resolve.data.data;
        self.setState({
          prepareTransportOrderItemList: list
        });
      });
  };

  loadWaiterTransportOrderItem = () => {
    let self = this;
    axios
      .get("/restaurant/loadWaiterTransportOrderItem", {
        params: { waiterId: "11" }
      })
      .then(resolve => {
        let list = resolve.data.data;
        self.setState({
          waiterTransportOrderItemList: list
        });
      });
  };

  transportingOrderItem = orderItemId => {
    axios.put("/restaurant/transportingOrderItem", {
      orderItemId: orderItemId,
      waiterId: "11"
    });
  };

  cancelTransportOrderItem = orderItemId => {
    axios.put("/restaurant/cancelTransportOrderItem", {
      orderItemId: orderItemId
    });
  };

  transportedOrderItem = orderItemId => {
    axios.put("/restaurant/transportedOrderItem", { orderItemId: orderItemId });
  };

  render() {
    let waiterTransportOrderItemListHtml = (
      <List renderHeader={() => "左滑可以将菜品放入待配送"} className="my-list">
        {this.state.waiterTransportOrderItemList.map(item => {
          return (
            <SwipeAction
              key={item._id}
              autoClose
              left={[
                {
                  text: "放入待配送",
                  onPress: () => {
                    this.cancelTransportOrderItem(item._id);
                  },
                  style: { backgroundColor: "#8e44ad", color: "white" }
                }
              ]}
            >
              <Item>
                <Flex justify="between" style={{ color: "#2c3e50" }}>
                  ({item.tableName}){item.name}
                  <CheckboxItem
                    checked={item.status === productStatus.transportFinish}
                    onClick={() => {
                      if (item.status === productStatus.transporting) {
                        this.transportedOrderItem(item._id);
                      }
                    }}
                  />
                </Flex>
              </Item>
            </SwipeAction>
          );
        })}
      </List>
    );

    let prepareTransportOrderItemListHtml = (
      <List
        renderHeader={() => "选中的菜品状态更新为配送中"}
        className="my-list"
      >
        {this.state.prepareTransportOrderItemList.map(item => {
          return (
            <Item>
              <Flex justify="between" style={{ color: "#8e44ad" }}>
                ({item.tableName}){item.name}
                {item.isBale ? (
                  <span style={{ color: "#f39c12" }}>(打包)</span>
                ) : null}
                <CheckboxItem
                  checked={!!item.waiterId}
                  onClick={() => {
                    if (item.status === productStatus.transporting) {
                      this.cancelTransportOrderItem(item._id);
                    }
                    if (item.status === productStatus.finish) {
                      this.transportingOrderItem(item._id);
                    }
                  }}
                />
              </Flex>
            </Item>
          );
        })}
      </List>
    );

    return (
      <div>
        <NavBar
          leftContent={[
            <Link key="1" to="/waiter">
              <Icon type="left" />
            </Link>
          ]}
          mode="light"
        >
          工作区
        </NavBar>
        <Tabs
          tabs={[
            {
              title: (
                <Badge
                  text={
                    this.state.waiterTransportOrderItemList.filter(
                      f => f.status === productStatus.transporting
                    ).length
                  }
                >
                  配送区
                </Badge>
              )
            },
            {
              title: (
                <Badge text={this.state.prepareTransportOrderItemList.length}>
                  待配送
                </Badge>
              )
            }
          ]}
          initialPage={1}
        >
          {waiterTransportOrderItemListHtml}
          {prepareTransportOrderItemListHtml}
        </Tabs>
      </div>
    );
  }
}
