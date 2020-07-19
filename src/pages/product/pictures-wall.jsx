import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';

import {reqDelectImg} from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


//图片上传组件
export default class PicturesWall extends React.Component {

    constructor(props){
        super(props)
        let fileList = [] 
        const img = this.props.imgs
        if(img &&  img.length>0){

            fileList = img.map( (name, index) => (
                {
                    uid: -index,
                    name: name,
                    status: 'done',
                    url: BASE_IMG_URL + name
                }
            ))

        }

        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList
            //   [
            //   {
            //     uid: '-1',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            //    },
            //   {
            //     uid: '-5',
            //     name: 'image.png',
            //     status: 'error',
            //   },
            //  ],
          };
    }
  

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  //图片上传时的回调函数，file是当前上传的图片对象，fileList所有已上传的图片数组对象
  handleChange = async ({file, fileList}) =>{
    if(file.status==='done'){
        message.success('图片上传成功！')
        //获取上传的图片对象
        file = file.response
        if(file.status===0){
            //取出上传图片对象的属性
            const {name, url} = file.data
            fileList[fileList.length-1].name = name
            fileList[fileList.length-1].url = url
        }else{
            message.error('图片上传失败！')
        }
    }else if(file.status==='removed'){

        const result = await reqDelectImg(file.name)
        if(result.status===0){
            message.success('图片删除成功！')
        }else{
            message.error('图片删除失败！')
        }



    }

      //console.log(file)
      //更新图片数组状态
      this.setState({fileList})   
  };


  //搜集图片信息，传递给父组件
  getImges = () =>{
      
      return this.state.fileList.map(file => file.name)
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload" 
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          accept="image/*"
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
