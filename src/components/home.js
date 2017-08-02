import React from "react"
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Aside from './newsimg'
import Aside2 from './newslist'




const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class SiderDemo extends React.Component {
  state = {
    collapsed: false,
    mode: 'inline',
    id:-1,
    guideA:"",
    guideB:""
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }
  ck(x){
    return (e) => {
      //指引一
      let guideA=this.refs.nav_text.innerHTML;
      //指引二
      let guideB=e.currentTarget.innerHTML;
      this.setState({
          guideA:guideA,
          guideB:guideB,
          id:x
      })
    }
  }
  render() {
    return (
      <Layout>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" mode={this.state.mode} defaultSelectedKeys={['6']}>
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span className="nav-text" ref="nav_text">News</span></span>}
            >
              <Menu.Item key="1">
                 <div onClick={this.ck(0)}>banner</div>
              </Menu.Item>
              <Menu.Item key="2">
                 <div onClick={this.ck(1)}>list</div>
              </Menu.Item>
              <Menu.Item key="3">
                 <div onClick={this.ck(2)}>3333</div>
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={<span><Icon type="team" /><span className="nav-text">Team</span></span>}
            >
              <Menu.Item key="4">Team 1</Menu.Item>
              <Menu.Item key="5">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="6">
              <span>
                <Icon type="file" />
                <span className="nav-text">File</span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{  }}>
          <Header style={{ background: '#fff', padding: 0 ,textIndent:30,fontSize:20}}>八马茶业__后台管理</Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>{this.state.guideA}</Breadcrumb.Item>
              <Breadcrumb.Item>{this.state.guideB}</Breadcrumb.Item>
            </Breadcrumb>
            {/*******默认进来*********/}
            <div style={{ padding: 24, background: '#fff', minHeight: 360, height:"auto" , height:"800px"}} className={-1==this.state.id?"":"Main_none"}>
                <ul id="news_ul">
                    <li>News >>>>> 新闻更新页
                         <ul>
                            <li>新闻banner更新</li>
                            <li>新闻列表更新</li>
                            <li>新闻所对应详情更新</li>
                         </ul>
                    </li>

                </ul>
            </div>  
            <div style={{ padding: 24, background: '#fff', minHeight: 360, height:"auto" }} className={0==this.state.id?"":"Main_none"}>
              <Aside />
            </div>
            <div style={{ padding: 24, background: '#fff', minHeight: 360, height:"auto" }} className={1==this.state.id?"":"Main_none"}>
              <Aside2  />
            </div>

          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

