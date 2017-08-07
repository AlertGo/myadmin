import React from "react"
import { Menu, Icon, Switch , Button } from 'antd';
import E from 'wangeditor'

export default class Reqlaces extends React.Component {
    constructor (){
       super()
       this.state={
          list:[],
          //分页的个数
          pagelength:0,
          //当前页
          index:0,
          uid:1
       }
       this.files={}
       //
    }
    componentDidUpdate (){
      this.refs.pagecon.children[0].style.width=this.refs.pagecon.children[0].children.length*35+"px"
      if(this.refs.pagecon.children[0].children.length<=5){
          this.refs.pagecon.style.width=this.refs.pagecon.children[0].children.length*35+"px"
      }else{
          this.refs.pagecon.style.width=35*5+"px"
      }
    }
    get_newscon (){
      this.fetchfn()
      this.refs.page.style.display="block"
    }
    //抓取数据
    fetchfn (){
        fetch("http://localhost:8006/img/news")
        .then((data) => {
            if(data.ok){
              return data.json()
            }
        })
        .then((data) => {
          let pagelength=0;
          //当可以整除时
          let list=[];
          let index=this.state.index*14
          if((data.length/14)%1==0){
              pagelength=data.length/14-1
          }else{
            pagelength=Math.floor(data.length/14)
          }
          for(var i=0,j=data.length-1-index;i<14;i++,j--){
            data[j]!=undefined && list.push(data[j])
          }
          this.setState({
            pagelength:pagelength,
            list:list
          })

        })
        .catch(x => {
          console.log(x)
        })      
    }
    // 换页
    pagetab (x){
        return (e)=>{

          let obj=e.currentTarget.parentNode
          console.log(obj)
            if(obj.children.length<5){
                alert(x)
            }else{ //大于父级宽度上限时
                if(x>2){
                    if(x>=obj.children.length-2){
                       obj.style.left=-(obj.children.length-5)*35+"px"

                    }else{
                      obj.style.left=-(x-2)*35+"px"
                    }
                }else{
                    obj.style.left=0+"px"
                }
            }
            this.setState({
              index:x
            })
            this.fetchfn()
        }
    }
    around_left (){
        if(this.state.index<=0) return ;
        this.setState({
          index:this.state.index-1
        })
        if(this.refs.pagetabs.children.length<5){

        }else{
            if(this.state.index<=3){
                console.log(this.state.index,this.refs.pagetabs.children.length-2)
                this.refs.pagetabs.style.left=0+"px"
            }else{
                if(this.state.index<this.refs.pagetabs.children.length-2){
                   this.refs.pagetabs.style.left=-(this.state.index-3)*35+"px"
                }
            }

        }

        this.fetchfn()
    }
    around_right (){
        if(this.state.index>=this.state.pagelength) return ;
        this.setState({
          index:this.state.index+1
        })
        if(this.refs.pagetabs.children.length<5){

        }else{
            if(this.state.index>=2){
                console.log(this.state.index,this.refs.pagetabs.children.length-2)
                if(this.state.index>=this.refs.pagetabs.children.length-3){
                    this.refs.pagetabs.style.left=-(this.refs.pagetabs.children.length-5)*35+"px"

                }else{
                   this.refs.pagetabs.style.left=-(this.state.index-1)*35+"px"

                }
                
            }else{
                   this.refs.pagetabs.style.left=0+"px"

            }

        }
        this.fetchfn()

    }
    replace_news_ck (x){
        return () => {
            var str=`id=${x}`
            this.fetchFns("http://localhost:8006/img/newsdetail",str)
          
        }
    }
    detele_news_ck (x){
        return () => {
            fetch("http://localhost:8006/news/newsdelete",{
              method:"post",
              headers:{
                 "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
              },
              body:`id=${x}`
            })
            .then(data => {
                if(data.ok){
                  return data.json()
                }
            })
            .then(data => {
               fetch("http://localhost:8006/news/newsdetaildelete",{
                  method:"post",
                  headers:{
                     "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
                  },
                  body:`id=${x}`                
               })
               .then(data => data.json())
               .then(data => {
                    this.fetchfn()
               })
               .catch(x => {
                  console.log(x)
               })
            })
            .catch(x => {
              console.log(x)
            })

        }
    }
    render() {
      return (
        <div className="news_imgbox">
            <Button type="primary" ghost onClick={this.get_newscon.bind(this)}>获取新闻列表</Button>
            <ul id="news_news_ul">
                <li className="news_fontli">
                  <span className="news_news_span1">序列</span>
                  <span className="news_news_span2">日期</span>
                  <span className="news_news_span3">列表信息</span>
                  <span className="news_news_span4">替换</span>
                  <span className="news_news_span5">删除</span>
                </li>
                {this.state.list.map((v,i) => {            
                    return (
                        <li key={i}>
                            <span className="news_news_span1">{v['id']}</span>
                            <span className="news_news_span2">{v['date']}</span>
                            <span className="news_news_span3">{v['title']}</span>
                            <span className="news_news_span4"><Button type="primary" size="small" ghost onClick={this.replace_news_ck(v["id"])}>替换</Button></span>
                            <span className="news_news_span5"><Button type="primary" size="small" ghost onClick={this.detele_news_ck(v["id"])}>删除</Button></span>      
                        </li>
                    )
                })}
            </ul>
            {/*******
              分业按钮
              */}             
            <div id="page" ref="page">
              <div className="around" onClick={this.around_left.bind(this)}>{"<"}</div>
              <div id="pagecons" ref="pagecon">
                <div id="pagecon" ref="pagetabs">
                  {(function (that){
                    let pagearr=[]
                      for(var i=0;i<=that.state.pagelength;i++){
                          pagearr.push(
                            <span key={i} className={that.state.index==i?"pagecolor":""} onClick={that.pagetab(i)}>{i+1}</span>
                          )
                      }
                      return pagearr
                  })(this)}
                </div>
              </div>
              <div className="around" onClick={this.around_right.bind(this)}>{">"}</div>
            </div>
            <div id="replace_news" ref="replace_news">
                <div id="replace_news_con">
                    <h2>替换此新闻内容...</h2>
                    <Sider parent_news={this.refs.replace_news} uid={this.state.uid} />
                </div>
            </div>
        </div>
      );
    }
  fetchFns (url,n){
        fetch(url,{
          method:"POST",
          headers:{
             "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
          },
          body:n
        })
        .then((data)=>data.json())
        .then((data)=>{ 
          console.log(data);
          let datacon={};
          datacon.cons=data[0]['cons'];
          for(var i in this.state.list){
              this.state.list[i]['id']==data[0]['id'] && (datacon=Object.assign(datacon,this.state.list[i]))
          }
          this.setState({
            uid:datacon
          },()=>{
            this.refs.replace_news.style.display="block"
          })
        })
        .catch((x)=>{
            console.log(x)
        })
    }
}
///替换内容或标题
class Sider extends React.Component {
  constructor (){
    super()
    this.state={
      text:"",
      defaulttext:"<p>adsfsadf</p>"
    }
    this.text=""
    this.obj=null;
  }
  shouldComponentUpdate(){
    return true
  }
  componentWillReceiveProps(nextProps){
     this.refs.editor.children[1].children[0].innerHTML=nextProps.uid.cons;
     this.refs.date.value=nextProps.uid.date;
     this.refs.list.value=nextProps.uid.title;
     this.setState({
        id:nextProps.uid.id
     })

    
  }
  componentDidMount (){
    var editor=new E(this.refs.editor)
    editor.customConfig.customUploadImg = (files, insert)=>{
      var filess={}
      for (var i in files){
        isNaN(i)!=true && (filess[i]=files[i])
      }
      var fd=new FormData();
      for(var i in files){
        fd.append("upload"+i,files[i])
        console.log(files[i])
      }
      fetch("http://localhost:8006/news/addimg",{
        method:"post",
        body:fd
      })
      .then( data => {return data.json()})
      .then( data => {
        insert("http://localhost:8006/"+data[0]['path'])
        console.log(data)
      })

      }
      editor.create()
      editor.txt.html(this.state.defaulttext)
      this.refs.editor.children[1].style.height="470px"
  }
  ck (){
    console.log(this.refs.editor.children[1].children[0].innerHTML)
    // //详情
    let cons=this.refs.editor.children[1].children[0].innerHTML;
    cons=cons.replace(/&/g, "W3School")
    //时间
    let date=this.refs.date.value;
    //title
    let title=this.refs.list.value;
    fetch("http://localhost:8006/news/updatelist",{
      method:"post",
      headers:{
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
      },
      body:`date=${date}&title=${title}&id=${this.state.id}`
    })
    .then((data)=>data.json())
    .then((data)=>{
      fetch("http://localhost:8006/news/updatedetail",{
        method:"post",
        headers:{ 
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
        },
        body:`cons=${cons}&id=${this.state.id}`

        })
      .then((txt)=>{
        if(txt.ok){
          alert("成功提交")
          this.props.parent_news.style.display="none"
          return txt.json()
        }
        })
      .then((txt)=>{
        console.log(txt)
      })

    })
  }
  cancel_news (){
      this.props.parent_news.style.display="none"
  }
  render() {
      return (
          <div id="replace_detail_news">
            <label>列表标题：</label><input ref="list" type="text" /><br/>
            <label>列表日期：</label><input ref="date" type="date" />
            <h3 style={{margin:"10px 0"}}>编辑详情内容：</h3>
            <div id="editor" ref="editor" style={{marginBottom:10,height:500}} >
            </div>
            <Button type="primary" ghost onClick={this.cancel_news.bind(this)}>Cancel</Button>       
            <Button onClick={this.ck.bind(this)} type="primary" ghost>确定</Button>
          </div>
      )
    }
}







