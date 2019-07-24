import React from "react";
import {
  ActivityIndicator,
  NavBar,
  Icon,
  Checkbox,
  Toast,
  Flex,
  Stepper,
  Button
} from "antd-mobile";
import { Link } from "react-router-dom";
import axios from "../../webapi/index";

const CheckboxItem = Checkbox.CheckboxItem;

export default class SetProductStock extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      oneLevelList: [],
      oneLevelSelected: "",
      twoLevelList: [],
      twoLevelSelectedIndex: -1,
      show: false
    };

    this.loadChefLikeProduct();
  }

  loadChefLikeProduct = () => {
    let self = this;
    Promise.all([axios.get("/productType"), axios.get("/product")]).then(
      ([productTypeResolve, productResolve]) => {
        let productTypeList = productTypeResolve.data.data;
        let productList = productResolve.data.data;
        self.setState({
          oneLevelList: productTypeList,
          twoLevelList: productList,
          show: true
        });
      }
    );
  };

  save = () => {
    let productIdWithStockList = this.state.twoLevelList.map(item => {
      return {
        _id: item._id,
        stock: item.stock
      };
    });
    axios
      .post("/product/setStock", {
        productIdWithStockList: productIdWithStockList
      })
      .then(() => {
        Toast.success("保存成功!!", 1);
      });
  };

  render() {
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

    const levelMenu = (
      <div>
        <div className="self-menu">
          <div className="self-menu-left">
            <div className="self-menu-left-list">
              {this.state.oneLevelList.map(item => {
                return (
                  <div
                    className={
                      this.state.oneLevelSelected === item.name
                        ? "selected"
                        : ""
                    }
                    key={item.name}
                    onClick={() => {
                      this.setState({ oneLevelSelected: item.name });
                    }}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="self-menu-right">
            <div className="self-menu-right-list">
              {this.state.twoLevelList
                .filter(f =>
                  f.label.some(s => s === this.state.oneLevelSelected)
                )
                .map((item, index) => {
                  return (
                    <div
                      key={item._id}
                      onClick={() =>
                        this.setState({
                          twoLevelSelectedIndex: index
                        })
                      }
                      style={
                        this.state.twoLevelSelectedIndex === index
                          ? { fontWeight: "600", color: "#108ee9" }
                          : {}
                      }
                    >
                      {item.name + `(${item.stock})`}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        {this.state.twoLevelSelectedIndex > -1 ? (
          <Flex
            justify="center"
            style={{
              backgroundColor: "white",
              height: "7vh",
              borderTop: "1px solid #eee"
            }}
          >
            <Flex.Item>
              <Flex justify="center">
                <Button
                  type="ghost"
                  inline
                  size="small"
                  onClick={() => {
                    this.state.twoLevelList[
                      this.state.twoLevelSelectedIndex
                    ].stock = 0;
                    this.setState({
                      twoLevelList: this.state.twoLevelList
                    });
                  }}
                >
                  沽清
                </Button>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Stepper
                showNumber
                min={0}
                value={
                  this.state.twoLevelList[this.state.twoLevelSelectedIndex]
                    .stock
                }
                onChange={val => {
                  this.state.twoLevelList[
                    this.state.twoLevelSelectedIndex
                  ].stock = val;
                  this.setState({
                    twoLevelList: this.state.twoLevelList
                  });
                }}
              />
            </Flex.Item>
          </Flex>
        ) : (
          <Flex
            justify="center"
            style={{
              backgroundColor: "white",
              height: "7vh",
              borderTop: "1px solid #eee"
            }}
          />
        )}
      </div>
    );

    return (
      <div>
        <NavBar
          leftContent={[
            <Link key="100" to="/">
              <Icon type="left" />
            </Link>
          ]}
          mode="light"
          rightContent={[
            <div key="0788" onClick={this.save}>
              确定
            </div>
          ]}
          className="multi-top-nav-bar"
        >
          设置菜品数量
        </NavBar>

        {this.state.show ? levelMenu : loadingEl}
      </div>
    );
  }
}
