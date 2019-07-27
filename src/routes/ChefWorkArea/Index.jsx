import React from "react";
import {
  Tabs,
  WhiteSpace,
  Badge,
  List,
  ActionSheet,
  NavBar,
  Icon,
  SwipeAction,
  PullToRefresh,
  Toast,
  Modal
} from "antd-mobile";
import { Link } from "react-router-dom";
import axios from "../../webapi/index";
import { productStatus } from "../../webapi/enumerate";
import { subscriptionSocket } from "../../webapi/api";
import "./Index.css";

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;

const isIPhone = new RegExp("\\biPhone\\b|\\biPod\\b", "i").test(
  window.navigator.userAgent
);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault()
  };
}

export default class WorkArea extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      makeIngList: [],
      toBeProducedList: [],
      refreshing: false,
      down: true,
      height: document.documentElement.clientHeight
    };

    subscriptionSocket("draggableOrderItem", () => {
      this.fetchWaitCookQueues();
    });

    subscriptionSocket("orderMake", () => {
      this.fetchWaitCookQueues();
    });

    subscriptionSocket("startCookOrderItem", orderItem => {
      if (this.state.toBeProducedList.some(s => s._id === orderItem._id)) {
        this.fetchWaitCookQueues();
      }
    });

    subscriptionSocket("deleteOrderItem", orderItem => {
      if (this.state.toBeProducedList.some(s => s._id === orderItem._id)) {
        this.fetchWaitCookQueues();
      }

      if (this.state.makeIngList.some(s => s._id === orderItem._id)) {
        this.loadMakeIngList();
      }
    });

    subscriptionSocket("setRemarkOrderItem", () => {
      this.loadMakeIngList();
    });

    this.loadMakeIngList();
    this.fetchWaitCookQueues();
  }

  loadMakeIngList = () => {
    let self = this;
    axios
      .get("/restaurant/fetchCookProductList", {
        params: {
          userId: "1"
        }
      })
      .then(resolve => {
        self.setState({
          makeIngList: resolve.data.data
        });
      });
  };

  finishOrderItem = orderItemId => {
    let self = this;
    axios.post("/restaurant/finishOrderItem", { orderItemId }).then(() => {
      this.loadMakeIngList();
    });
  };

  startCookOrderItem = orderItemId => {
    let self = this;
    axios
      .post("/restaurant/startCookOrderItem", { userId: "1", orderItemId })
      .then(() => {
        self.loadMakeIngList();
        self.setState({ refreshing: false });
      })
      .catch(() => {
        self.setState({ refreshing: false });
      });
  };

  fetchWaitCookQueues = () => {
    let self = this;
    axios.get("/restaurant/fetchWaitCookQueues").then(resolve => {
      self.refreshTobeProductList(resolve.data.data);
    });
  };

  refreshTobeProductList = waitCookQueues => {
    let list = waitCookQueues.chefList.find(f => f._id === "1").list;
    this.setState({
      toBeProducedList: list
    });
  };

  showActionSheet = orderItem => {
    if (
      ![productStatus.cooking, productStatus.waitCooking].some(
        s => s === orderItem.status
      )
    ) {
      return;
    }

    const BUTTONS = ["沽清该菜品", "这个菜做不了", "取消"];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        message: orderItem.remark,
        maskClosable: true,
        "data-seed": "logId",
        wrapProps
      },
      buttonIndex => {
        this.actionSheet(buttonIndex, orderItem);
      }
    );
  };

  actionSheet = (buttonIndex, orderItem) => {
    if (buttonIndex === 0) {
      axios
        .post("/product/setStock", {
          productIdWithStockList: [
            {
              _id: orderItem.productId,
              stock: 0
            }
          ]
        })
        .then(() => {
          Toast.success("保存成功!!", 1);
        });
    }
    if (buttonIndex === 1) {
      alert("Much Buttons", <div>选择无法烹饪原因</div>, [
        {
          text: "没材料了",
          onPress: () =>
            this.deleteOrderItem(
              orderItem,
              `厨师xxx说没材料了${orderItem.name}`
            )
        },
        {
          text: "赖得做了",
          onPress: () => Toast.info("赖鬼!!", 2)
        },
        {
          text: "按错了",
          onPress: () => Toast.info("下次别乱按了!!", 2)
        }
      ]);
    }
  };

  deleteOrderItem(orderItem, deleteReamrk) {
    axios
      .delete("/restaurant/deleteOrderItem", {
        data: {
          orderItemId: orderItem._id,
          deleteReamrk: deleteReamrk
        }
      })
      .then(() => {
        this.loadMakeIngList();
        Toast.success("删除成功!!", 1);
      });
  }

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
        >
          工作区
        </NavBar>
        <Tabs
          tabs={[
            {
              title: (
                <Badge
                  text={
                    this.state.makeIngList.filter(
                      f => f.status === productStatus.cooking
                    ).length
                  }
                >
                  烹饪中
                </Badge>
              )
            },
            {
              title: (
                <Badge text={this.state.toBeProducedList.length}>待烹饪</Badge>
              )
            }
          ]}
          initialPage={0}
        >
          <PullToRefresh
            damping={60}
            ref={el => (this.ptr = el)}
            style={{
              height: this.state.height,
              overflow: "auto"
            }}
            indicator={this.state.down ? {} : { deactivate: "上拉可以刷新" }}
            direction={this.state.down ? "down" : "up"}
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({ refreshing: true });
              this.startCookOrderItem();
            }}
          >
            <List
              renderHeader={() =>
                "左滑可以将菜品完成烹饪,下拉获得新菜品开始烹饪"
              }
            >
              {this.state.makeIngList.map(item => {
                return item.status === productStatus.finish ? (
                  <Item
                    extra="30m"
                    align="top"
                    multipleLine
                    onClick={() => this.showActionSheet(item)}
                    key={item._id}
                    style={{ backgroundColor: "#e74c3c" }}
                  >
                    <span style={{ color: "white" }}>
                      {item.name} ({item.tableName})
                    </span>
                    <Brief style={{ color: "white" }}>{item.remark}</Brief>
                  </Item>
                ) : (
                  <SwipeAction
                    key={item._id}
                    autoClose
                    left={[
                      {
                        text: "完成烹饪",
                        onPress: () => this.finishOrderItem(item._id),
                        style: { backgroundColor: "#e74c3c", color: "white" }
                      }
                    ]}
                    onOpen={() => console.log("global open")}
                  >
                    <Item
                      extra="30m"
                      align="top"
                      multipleLine
                      onClick={() => this.showActionSheet(item)}
                      style={{ backgroundColor: "#f1c40f" }}
                    >
                      <span style={{ color: "white" }}>
                        {item.name} ({item.tableName})
                      </span>
                      <Brief style={{ color: "white" }}>{item.remark}</Brief>
                    </Item>
                  </SwipeAction>
                );
              })}
            </List>
          </PullToRefresh>

          <List renderHeader={() => "右滑可以将菜品开始烹饪"}>
            {this.state.toBeProducedList.map(item => {
              return (
                <SwipeAction
                  key={item._id}
                  autoClose
                  right={[
                    {
                      text: "开始烹饪",
                      onPress: () => this.startCookOrderItem(item._id),
                      style: { backgroundColor: "#f1c40f", color: "white" }
                    }
                  ]}
                  onOpen={() => console.log("global open")}
                >
                  <Item
                    extra="30m"
                    align="top"
                    multipleLine
                    onClick={() => this.showActionSheet(item)}
                    style={{ backgroundColor: "#2980b9", color: "white" }}
                  >
                    <span style={{ color: "white" }}>
                      {item.name} ({item.tableName})
                    </span>
                    <Brief style={{ color: "white" }}>{item.remark}</Brief>
                  </Item>
                </SwipeAction>
              );
            })}
          </List>
        </Tabs>
      </div>
    );
  }
}
