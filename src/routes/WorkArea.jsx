import React from "react";
import {
  Tabs,
  WhiteSpace,
  Badge,
  List,
  ActionSheet,
  NavBar,
  Icon,
  SwipeAction
} from "antd-mobile";
import { Link } from "react-router-dom";

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
  showActionSheet = () => {
    const BUTTONS = [
      "Operation1",
      "Operation2",
      "Operation2",
      "Delete",
      "Cancel"
    ];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        // title: 'title',
        message: "I am description, description, description",
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
            <Link to="/">
              <Icon key="1" type="left" />
            </Link>
          ]}
        >
          工作区
        </NavBar>

        <List renderHeader={() => "描述语句"} className="my-list">
          <Item
            extra="30m"
            align="top"
            multipleLine
            onClick={this.showActionSheet}
          >
            黄瓜炒肉 (A302)<Brief>不要放黄瓜，不要放肉</Brief>
          </Item>
          <Item extra="30m" align="top" multipleLine>
            黄瓜炒肉 (A302)<Brief>不要放黄瓜，不要放肉</Brief>
          </Item>
          <Item extra="30m" align="top" multipleLine>
            黄瓜炒肉 (A302)<Brief>不要放黄瓜，不要放肉</Brief>
          </Item>
          <Item extra="30m" align="top" multipleLine>
            黄瓜炒肉 (A302)<Brief>不要放黄瓜，不要放肉</Brief>
          </Item>
          <SwipeAction
            style={{ backgroundColor: "gray" }}
            autoClose
            right={[
              {
                text: "Cancel",
                onPress: () => console.log("cancel"),
                style: { backgroundColor: "#ddd", color: "white" }
              },
              {
                text: "Delete",
                onPress: () => console.log("delete"),
                style: { backgroundColor: "#F4333C", color: "white" }
              }
            ]}
            onOpen={() => console.log("global open")}
            onClose={() => console.log("global close")}
          >
            <Item extra="30m" align="top" multipleLine>
              黄瓜炒肉 (A302)<Brief>不要放黄瓜，不要放肉</Brief>
            </Item>
          </SwipeAction>
          <Item extra="30m" align="top" multipleLine>
            黄瓜炒肉 (A302)<Brief>不要放黄瓜，不要放肉</Brief>
          </Item>
          <Item extra="30m" align="top" multipleLine>
            黄瓜炒肉 (A302)<Brief>不要放黄瓜，不要放肉</Brief>
          </Item>
          <Item extra="30m" align="top" multipleLine>
            黄瓜炒肉 (A302)<Brief>不要放黄瓜，不要放肉</Brief>
          </Item>
        </List>
      </div>
    );
  }
}
