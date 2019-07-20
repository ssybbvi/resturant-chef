import React from "react";
import { Menu, ActivityIndicator, NavBar, Icon } from "antd-mobile";
import { Link } from "react-router-dom";

const data = [
  {
    value: "1",
    label: "Food",
    children: [
      {
        label: "American Foods",
        value: "1",
        disabled: false
      },
      {
        label: "Chinese Food",
        value: "2"
      },
      {
        label: "Hot Pot",
        value: "3"
      },
      {
        label: "Buffet",
        value: "4"
      },
      {
        label: "Fast Food",
        value: "5"
      },
      {
        label: "Snack",
        value: "6"
      },
      {
        label: "Bread",
        value: "7"
      },
      {
        label: "Fruit",
        value: "8"
      },
      {
        label: "Noodle",
        value: "9"
      },
      {
        label: "Leisure Food",
        value: "10"
      }
    ]
  },
  {
    value: "2",
    label: "Supermarket",
    children: [
      {
        label: "All Supermarkets",
        value: "1"
      },
      {
        label: "Supermarket",
        value: "2",
        disabled: true
      },
      {
        label: "C-Store",
        value: "3"
      },
      {
        label: "Personal Care",
        value: "4"
      }
    ]
  },
  {
    value: "3",
    label: "Extra",
    isLeaf: true,
    children: [
      {
        label: "you can not see",
        value: "1"
      }
    ]
  }
];

export default class SetProductStock extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      initData: "",
      show: false
    };
  }
  onChange = value => {
    console.log(value);
  };
  onOk = value => {
    console.log(value);
    this.onCancel();
  };
  onCancel = () => {
    this.setState({ show: false });
  };
  handleClick = e => {
    e.preventDefault(); // Fix event propagation on Android
    this.setState({
      show: !this.state.show
    });
    // mock for async data loading
    if (!this.state.initData) {
      setTimeout(() => {
        this.setState({
          initData: data
        });
      }, 500);
    }
  };

  onMaskClick = () => {
    this.setState({
      show: false
    });
  };

  render() {
    const { initData, show } = this.state;
    const menuEl = (
      <Menu
        className="multi-foo-menu"
        data={initData}
        value={["1", ["3", "4"]]}
        onChange={this.onChange}
        onOk={this.onOk}
        onCancel={this.onCancel}
        height={document.documentElement.clientHeight * 0.6}
        multiSelect
      />
    );
    const loadingEl = (
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: document.documentElement.clientHeight * 0.6,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <ActivityIndicator size="large" />
      </div>
    );
    return (
      <div className={show ? "multi-menu-active" : ""}>
        <div>
          <NavBar
            leftContent={[
              <Link to="/">
                <Icon key="1" type="left" />
              </Link>
            ]}
            rightContent="Menu"
            mode="light"
            onLeftClick={this.handleClick}
            className="multi-top-nav-bar"
          >
            Multi select menu
          </NavBar>
        </div>
        {show ? (initData ? menuEl : loadingEl) : null}
        {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
      </div>
    );
  }
}
