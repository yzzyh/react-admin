import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

//富文本编辑器组件
export default class RichTextEditor extends Component {


    constructor(props){
        super(props)
        const {detail} = this.props

        //如果是修改要显示商品的详情在富文本框中
        if(detail){
            const contentBlock = htmlToDraft(detail)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState
                }
            }
        }else{
            this.state = {
                editorState: EditorState.createEmpty(),
            }
        }
    }


 


  
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  //获取富文本详情，标签字符串。
  getDetail = () =>{
      return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }

  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        //图片上传地址
        xhr.open('POST', '/manage/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve({ data:{link: response.data.url }});
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor 
          editorState={editorState}
          editorStyle={{paddingLeft: 10, border: '1px solid black', height: 500}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } }
          }}
        />
        
      </div>
    );
  }
}