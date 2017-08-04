import React from "react"
import ReactQuill from 'react-quill'
import Quill from 'quill'
import E from 'wangeditor'
import 'react-quill/dist/quill.snow.css' 
import { Menu, Icon, Switch , Button} from 'antd';

export default class Sider extends React.Component {
	constructor (){
		super()
		this.state={
			text:""
		}
		this.text=""
		this.obj=null;
	}
	shouldComponentUpdate(){
		return false
	}
	componentDidMount (){
		/*
		console.log(this.state.text)
		var toolbarOptions = [
			  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			  ['blockquote', 'code-block'],

			  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
			  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
			  [{ 'direction': 'rtl' }],                         // text direction

			  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
			  [{ 'font': [] }],
			  [{ 'align': [] }],

			  ['image', 'code-block'],
			  ['clean']                                         // remove formatting button
		];

 		var quill = new Quill(this.refs.editor, {
			 modules: {
			    toolbar:toolbarOptions 
			  },
			 placeholder: 'Compose an epic...',
   		 	 theme: 'snow'
 	 	});
 		*/
 		var editor=new E(this.refs.editor)
 		// editor.customConfig.uploadImgServer = 'http://localhost:8006/public/images/'
 	// 	editor.customConfig.uploadImgHeaders = {
  //  			 'Accept': 'text/x-json'
		// }
		// //跨域上传中如果需要传递 cookie 需设置 withCredentials
		// editor.customConfig.withCredentials = true
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
	 		editor.txt.html('<p>编辑内容...</p>')
	}


	ck (){
		console.log(this.refs.editor.children[1].children[0].innerHTML)
		// //详情
		let cons=this.refs.editor.children[1].children[0].innerHTML;
		//时间
		let date=this.refs.date.value;
		//title
		let title=this.refs.list.value;
		console.log(cons,date,title)
		fetch("http://localhost:8006/news/addliebiao",{
			method:"post",
			headers:{
				"Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
			},
			body:`date=${date}&title=${title}`
		})
		.then((data)=>data.json())
		.then((data)=>{
			console.log(data)
			fetch("http://localhost:8006/news/cons",{
				method:"post",
				headers:{
					"Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
				},
				body:`cons=${cons}&id=${data[0]['max(id)']}`

				})
			.then((txt)=>txt.json())
			.then((txt)=>{
				console.log(txt)
			})

		})

	}
	changes (){
		
	}
 	render() {
    	return (
      		<div>
      			<label>列表标题：</label><input ref="list" type="text" /><br/>
      			<label>列表日期：</label><input ref="date" type="date" />
      			<h3>编辑详情内容：</h3>
	      	 	<div id="editor" ref="editor" >

	      	 	</div>
				<Button onClick={this.ck.bind(this)} type="primary" size="small" ghost>确定</Button>
      		</div>
    	)
  	}
}

