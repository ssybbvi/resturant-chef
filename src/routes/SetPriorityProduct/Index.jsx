import React from "react";
import { ActivityIndicator, NavBar, Icon, Checkbox, Toast } from "antd-mobile";
import { Link } from "react-router-dom";
import axios from "../../webapi/index";

const CheckboxItem = Checkbox.CheckboxItem;

export default class SetPriorityProduct extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      initData: [],
      show: false,
      currentSelectId: "",
      chefProductIds: []
    };

    this.loadChefLikeProduct();
  }

  loadChefLikeProduct = () => {
    let self = this;
    Promise.all([
      axios.get("/user/getChefProduct", { params: { userId: "1" } }),
      axios.get("/productType"),
      axios.get("/product")
    ]).then(([getChefProductResolve, productTypeResolve, productResolve]) => {
      let chefProductIds = getChefProductResolve.data.data;
      let productTypeList = productTypeResolve.data.data;
      let productList = productResolve.data.data;

      let result = productTypeList.map(productTypeItem => {
        let childProductList = productList.filter(f =>
          f.label.some(s => s === productTypeItem.name)
        );
        return {
          name: productTypeItem.name,
          children: childProductList.map(item => {
            return {
              _id: item._id,
              name: item.name
            };
          })
        };
      });

      self.setState({
        chefProductIds: chefProductIds,
        initData: result,
        show: true
      });
    });
  };

  onProductSelected(productId) {
    let chefProductIds = this.state.chefProductIds;
    let index = chefProductIds.findIndex(s => s === productId);
    if (index > -1) {
      chefProductIds.splice(index, 1);
    } else {
      chefProductIds.push(productId);
    }
    this.setState({
      chefProductIds: chefProductIds
    });
  }

  save = () => {
    axios
      .post("/user/setChefProduct", {
        userId: "1",
        likeProductIds: this.state.chefProductIds
      })
      .then(() => {
        Toast.success("保存成功!!", 1);
      });
  };

  render() {
    const { initData, show } = this.state;
    const childrenNode = initData.find(
      f => f.name == this.state.currentSelectId
    ) || { children: [] };

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
      <div className="self-menu">
        <div className="self-menu-left">
          <div className="self-menu-left-list">
            {initData.map(item => {
              return (
                <div
                  className={
                    this.state.currentSelectId === item.name ? "selected" : ""
                  }
                  key={item.name}
                  onClick={() => {
                    this.setState({ currentSelectId: item.name });
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
            {childrenNode.children.map(item => {
              return (
                <div
                  key={item._id}
                  onClick={() => this.onProductSelected(item._id)}
                >
                  <CheckboxItem
                    checked={this.state.chefProductIds.some(
                      s => s === item._id
                    )}
                  >
                    {item.name}
                  </CheckboxItem>
                </div>
              );
            })}
          </div>
        </div>
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
          设置您负责的菜品
        </NavBar>

        {show ? levelMenu : loadingEl}
      </div>
    );
  }
}
