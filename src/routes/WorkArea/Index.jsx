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
  PullToRefresh
} from "antd-mobile";
import { Link } from "react-router-dom";
import axios from "../../webapi/index";
import { productStatus } from "../../webapi/enumerate";
import { subscribeToWaitCookQueues } from "../../webapi/api";

const Item = List.Item;
const Brief = Item.Brief;

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

    subscribeToWaitCookQueues((err, data) => {
      this.refreshTobeProductList(data);
    });

    this.loadMakeIngList();
    this.fetchWaitCookQueues();
  }

  loadMakeIngList = () => {
    let self = this;
    axios
      .get("/scheduling/fetchCookProductList", {
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
    axios.post("/scheduling/finishOrderItem", { orderItemId }).then(() => {
      this.loadMakeIngList();
    });
  };

  startCookOrderItem = orderItemId => {
    let self = this;
    axios
      .post("scheduling/startCookOrderItem", { userId: "1", orderItemId })
      .then(resolve => {
        self.loadMakeIngList();
        self.setState({ refreshing: false });
      });
  };

  fetchWaitCookQueues = () => {
    let self = this;
    axios.get("/scheduling/fetchWaitCookQueues").then(resolve => {
      self.refreshTobeProductList(resolve.data.data);
    });
  };

  refreshTobeProductList = waitCookQueues => {
    let list = waitCookQueues.chefList.find(f => f._id === "1").list;
    this.setState({
      toBeProducedList: list
    });
  };

  showActionSheet = remark => {
    const BUTTONS = ["沽清该菜品", "这个菜做不了", "取消"];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        // title: 'title',
        message: remark,
        maskClosable: true,
        "data-seed": "logId",
        wrapProps
      },
      buttonIndex => {
        this.setState({ clicked: BUTTONS[buttonIndex] });
      }
    );
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
          onChange={(tab, index) => {
            console.log("onChange", index, tab);
          }}
          onTabClick={(tab, index) => {
            console.log("onTabClick", index, tab);
          }}
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
            <List className="my-list">
              {this.state.makeIngList.map(item => {
                return item.status === productStatus.finish ? (
                  <Item
                    extra="30m"
                    align="top"
                    multipleLine
                    onClick={() => this.showActionSheet(item.reamrk)}
                    key={item._id}
                    style={{ backgroundColor: "#e74c3c" }}
                  >
                    <text style={{ color: "white" }}>{item.name} (A302)</text>
                    <Brief style={{ color: "white" }}>{item.remark}</Brief>
                  </Item>
                ) : (
                  <SwipeAction
                    key={item._id}
                    style={{ backgroundColor: "gray" }}
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
                      onClick={() => this.showActionSheet(item.reamrk)}
                      style={{ backgroundColor: "#e67e22" }}
                    >
                      <text style={{ color: "white" }}>{item.name} (A302)</text>
                      <Brief style={{ color: "white" }}>{item.remark}</Brief>
                    </Item>
                  </SwipeAction>
                );
              })}
            </List>
          </PullToRefresh>

          <List className="my-list">
            {this.state.toBeProducedList.map(item => {
              return (
                <SwipeAction
                  key={item._id}
                  style={{ backgroundColor: "gray" }}
                  autoClose
                  right={[
                    {
                      text: "开始烹饪",
                      onPress: () => this.startCookOrderItem(item._id),
                      style: { backgroundColor: "#e67e22", color: "white" }
                    }
                  ]}
                  onOpen={() => console.log("global open")}
                >
                  <Item
                    extra="30m"
                    align="top"
                    multipleLine
                    onClick={() => this.showActionSheet(item.reamrk)}
                    style={{ backgroundColor: "#f1c40f", color: "white" }}
                  >
                    <text style={{ color: "white" }}>{item.name} (A302)</text>
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
