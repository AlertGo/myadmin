import React from "react"
import { Menu, Icon, Switch , Button } from 'antd';
export default class Sider extends React.Component {
    constructor (){
       super()
       this.state={
          img:[],
          id:0,
          id2:0
       }
       this.files={}
    }
    getIMGlist (){
        this.fetchFn('http://localhost:8006/news/newsimg')
          this.refs.news_img_add.style.display="block";
    }
    upDataimg (x,x2){
        return () => {
          console.log(x,x2)
          this.setState({
            id:x,
            id2:x2
          })
          this.refs.setImg.style.display="block";
          this.refs.setImg.children[0].style.display="block";

        }
    }
    filechange () {
      return (e)=>{
        this.files={}  
        e.persist()
        for (var i in e.target.files){
          isNaN(i)!=true && (this.files[i]=e.target.files[i])
        }
      }
        
    }
    chuanclick (){
        let fd=new FormData();
        for(var i in this.files){
           fd.append("upload"+i,this.files[i])
        }
        this.fetchFnupdata("http://localhost:8006/news/addimg",fd)
    }
    cancel (x){
      return ()=>{
        this.refs.setImg.style.display="none"
        this.refs.setImg.children[x].style.display="none";
      }
    }
    addImgs (){
        this.refs.setImg.style.display="block";
        this.refs.setImg.children[1].style.display="block";
    }
    //添加  file改变函数
    addChange (){
      return (e)=>{
        this.files={}
        e.persist()
        console.log(e.target.files)
        for (var i in e.target.files){
          isNaN(i)!=true && (this.files[i]=e.target.files[i])
        }
      }
    }
    addgo (){
        let fd=new FormData();
        console.log(this.files)
        for(var i in this.files){
            fd.append("upload"+i,this.files[i])
        }
        this.fetchFnupdata2("http://localhost:8006/news/addimg",fd)
    }
    //删除
    delete (x){
        return ()=>{         
          let str=`id=${x}`
          console.log(x,str)
          this.fetchDelete("http://localhost:8006/news/deles",str)
        }
    }
    render() {
      return (
        <div className="news_imgbox">
            <Button onClick={this.getIMGlist.bind(this)} type="primary" ghost>获取图片列表</Button>
            <ul id="news_img_ul">
                <li className="news_fontli">
                  <span className="news_img_spanA">图片详情</span>
                  <span className="news_img_spanB">替换</span>
                  <span className="news_img_spanC">删除</span>
                </li>
                {this.state.img.map((v,i) => {
              
                    return (
                        <li key={i}>
                            <span className="news_img_spanA">{v['img']}</span>
                            <span className="news_img_spanB"><Button onClick={this.upDataimg(v['id'],i)} type="primary" size="small" ghost>替换</Button></span>
                            <span className="news_img_spanC"><Button type="primary" size="small" ghost onClick={this.delete(v['id'])}>删除</Button></span>      
                        </li>
                    )
                })}
            </ul>
            <div id="news_img_add" ref="news_img_add">
                  <Button type="primary" onClick={this.addImgs.bind(this)}>添加图片</Button>
            </div>
            <div id="setImg" ref="setImg">
                <div className="setImgs">
                    <p>替换图片</p>
                    <input type="file" onChange={this.filechange()}/>
                    <Button onClick={this.cancel(0)}>Cancel</Button>
                    <Button onClick={this.chuanclick.bind(this)}>确定</Button>
                </div>
                <div className="setImgs">
                    <p>添加图片</p>
                    <input type="file" onChange={this.addChange()}/>
                    <Button onClick={this.cancel(1)}>Cancel</Button>
                    <Button onClick={this.addgo.bind(this)}>确定</Button>
                </div>
            </div>
        </div>
      );
    }
    //数据表添加地址
    fetchFn2 (url,fd){
        fetch(url,{
          method:"post",
          headers: { 
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
          },
          body:fd          
        })
        .then((data)=>data.json())
        .then((data)=>{
            this.fetchFn('http://localhost:8006/news/newsimg')

            this.refs.setImg.style.display="none";
            this.refs.setImg.children[1].style.display="none";


        })
        .catch((x)=>{
            console.log(x)
        })
    }
    fetchFn (url){
        fetch(url)
        .then((data)=>data.json())
        .then((data)=>{
          console.log(data)
          this.setState({
            img:data
          })
        })
        .catch((x)=>{
            console.log(x)
        })
    }
    //*＊＊＊＊＊＊＊＊数据库添加图片＊＊＊＊＊＊＊*/
    fetchFnupdata2 (url,fd){
        fetch(url,{
          method:"post",
          body:fd
        })
        .then( data =>{
            if(data.ok) return data.json()            
          })
        .then( data => {
          //将地址插入当前页面
          let arr=[]
          for(var i in data){
              arr.push(data[i]['path'])
          }
          console.log(data)
          let str=`imgs=http://localhost:8006/${data[0]['path']}`
          this.fetchFn2("http://localhost:8006/news/add",str)

          //插入数据库

        })
        .catch((x)=>{
            console.log(x)
        })
    }
    //删除
    fetchDelete (url,fd){
        fetch(url,{
          method:"post",
           headers: { 
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
          },
          body:fd
        })
        .then( data =>{
            if(data.ok) return data.json()            
          })
        .then( data => {
            this.fetchFn('http://localhost:8006/news/newsimg')
          
        })
        .catch((x)=>{
            console.log(x)
        })
    }
    fetchFnupdata (url,fd){
        fetch(url,{
          method:"post",
          body:fd
        })
        .then( data =>{
            if(data.ok){
                return data.json() 
            }
          })
        .then( data => {
          //将地址插入当前页面
          console.log(this.state.img,this.state.id,this.state.id2)
          this.state.img[this.state.id2]['img']="http://localhost:8006/"+data[0]['path']
          this.setState({
              img:this.state.img
          })
          //插入数据库
          let fds=new FormData();
          fds.append("id",this.state.id);
          fds.append("imgstr",data[0]['path']);
          console.log(data[0]['path']);
          var str=`id=${this.state.id}&imgstr=http://localhost:8006/${data[0]['path']}`;
          this.fetchUpdata("http://localhost:8006/news/replace",str);
        })
        .catch((x)=>{
            console.log(x)
        })
    }
    //更新
    fetchUpdata (url,fd){
        fetch(url,{
          method:"post",
          headers: { 
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
          },
          body:fd
        })
        .then(data => data.text())
        .then(data => {
            console.log("成功");
            this.refs.setImg.style.display="none";
            this.refs.setImg.children[0].style.display="block";


        })
        .catch((e) => {
          console.log(e)
        })
    }



}



