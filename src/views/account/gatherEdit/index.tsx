import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Upload, Row, Col, Tooltip, message } from 'antd'
import './index.scss'
import _ from 'lodash'
import { fileSizeValidator } from 'Utils/utils'
import { useTranslation } from 'react-i18next'
import { createIpfs } from 'Src/api'
const { TextArea } = Input
import { useParams } from 'react-router-dom'
import { getCollectionDetails } from 'Src/api/collection'

export const GatherEdit: React.FC<any> = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [disabled, setDisabled] = useState(false)
  const [fileAvatar, setFileAvatar] = useState(null) //头像
  const [fileCover, setFileCover] = useState(null) //封面图
  const [fileBackgroundImage, setFileBackgroundImage] = useState(null) //背景图
  const { id: id } = useParams<{ id: string }>() // 路由参数id

  useEffect(() => {
    console.log(id, 'ududdddd')
    getAccountInfoById(id)
  }, [id])

  // 通过合集id获取基本信息
  const getAccountInfoById = async (id: string) => {
    // setCollectionsData([])
    const res: any = await getCollectionDetails(Number(id))

    console.log(res, 'resssss')

    // setData(res.data)
  }


  // 表单基础校验
  const handelFieldsChange = (changedFields: any[], allFields: any[]) => {

  }
  // 提交表达
  const onFinish = () => {
    console.log(fileAvatar, _.isNull(fileAvatar), 'fileAvatar')

    // 检查图片是否都上传
    if (_.isNull(fileAvatar)) {
      message.warn('请上传集合头像')
    } else if (_.isNull(fileCover)) {
      message.warn('请上传集合封面')
    } else if (_.isNull(fileBackgroundImage)) {
      message.warn('请上传集合背景')
    } else {
      form.validateFields().then((values: any) => {
        console.log(values, '333333')
      })
    }


  }
  // 版税校验规则
  const royaltiesRules: any = [
    { required: true, message: '该字段为必填项' },
    { pattern: /^\d+(\.\d{1,1})?$/, message: '只能输入数字且保留一位小数' },
    () => ({
      validator(rule: any, value: any) {
        if (value) {
          if (Number(value) > Number(10)) {
            return Promise.reject('最大可设置版税为10%')
          }
        }
        return Promise.resolve()
      },
    }),
  ]
  // 链接校验格式
  const LinKValidator: any = [
    { pattern: /^(((ht|f)tps?):\/\/)?([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/, message: '链接格式错误' }
  ]
  // 上传图片
  const customRequest = (options: any, type: string) => {
    const file = options.file
    const params = new FormData()
    params.append('file', file)
    createIpfs(params).then((res: any) => {
      switch (type) {
        case '1':
          setFileAvatar(res.data)
          break
        case '2':
          setFileCover(res.data)
          break
        case '3':
          setFileBackgroundImage(res.data)
          break
        default:
          break
      }

      // updateGeneralInfo({ ...accountInfo, bannerUrl: res.data });
    })

  }

  return (
    <div className='gatherEdit'>
      <div className='caption'>编辑集合<span>( <em>*</em> 为必填项 )</span></div>
      <div className='formWaper'>
        <Form
          form={form}
          layout="vertical"
          onFieldsChange={handelFieldsChange}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="集合名称"
            rules={[{ required: true, message: '该字段为必填项' }]}
          >
            <Input placeholder="你的合集名称" />
          </Form.Item>
          <Form.Item
            name="urL"
            label="集合链接"
            rules={[{ required: true, message: '该字段为必填项' }]}
          >
            <Input prefix="https://diffgalaxy.io/collection/" placeholder="自定义你的合集URL" />
          </Form.Item>
          <Form.Item
            name="describe"
            label="集合描述"
            rules={[{ required: true, message: '该字段为必填项' }]}
          >
            <TextArea rows={4} placeholder="你的合集描述..." maxLength={500} showCount />
          </Form.Item>
          <Form.Item
            label={
              <div className='imgTitle'>
                集合头像
                <span>（支持JPG、PNG、SVG，建议200x200，最大1M）</span>
              </div>
            }
            name="avatar">

            <Upload
              beforeUpload={(file) => fileSizeValidator(file, 1)}
              customRequest={(options) => customRequest(options, '1')}
              showUploadList={false}
              accept={'.jpg,.png,.svg'}
              listType="picture"
            >
              <Button className='editAvatar'>
                {fileAvatar == null ? <img src='Src/assets/account/upload.png'></img> : <img src={fileAvatar} className="imgWidth" />}
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item label={
            <div className='imgTitle'>
              集合封面
              <span>（支持JPG、PNG、SVG，建议600x400，最大3M）</span>
            </div>
          }
            name="cover">
            <Upload
              beforeUpload={(file) => fileSizeValidator(file, 3)}
              customRequest={(options) => customRequest(options, '2')}
              showUploadList={false}
              accept={'.jpg,.png,.svg'}
              listType="picture"
            >
              <Button className='editCover'>
                {fileCover == null ? <img src='Src/assets/account/upload.png'></img> : <img src={fileCover} className="imgWidth" />}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item label={
            <div className='imgTitle'>
              集合背景
              <span>（支持JPG、PNG、SVG，建议1900x350，最大10M）</span>
            </div>
          }
            name="backgroundImage">
            <Upload
              beforeUpload={(file) => fileSizeValidator(file, 10)}
              customRequest={(options) => customRequest(options, '3')}
              showUploadList={false}
              accept={'.jpg,.png,.svg'}
              listType="picture"
            >
              <Button className='editBgImage'>
                {fileBackgroundImage == null ? <img src='Src/assets/account/upload.png'></img> : <img src={fileBackgroundImage} className="imgWidth" />}
              </Button>
            </Upload>
          </Form.Item>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item
                label={
                  <div>
                    创作者版税
                    <Tooltip title="你作为创作者，每交易一笔NFTs，即可按交易价格收取一定比例收益。">
                      <img src="Src/assets/account/question.png" alt="" className="royalties" />
                    </Tooltip>
                  </div>
                }
                name="royalties"
                rules={royaltiesRules}>
                <Input suffix="%" />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item label="收款地址" name='address' rules={[{ required: true, message: '请设置版税收益收款地址' }]}>
                <Input placeholder='添加你的收款地址（如：0x85K86...02rf03）' />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="官网链接" name="website" rules={LinKValidator}>
            <Input placeholder='你的项目官网链接' />
          </Form.Item>
          <Form.Item>
            <Form.Item label="Twitter链接" name="Twitter" rules={LinKValidator}>
              <Input type='href' placeholder='你的项目Twitter链接' />
            </Form.Item>
            <Form.Item label="Discord链接" name="Discord" rules={LinKValidator}>
              <Input placeholder='你的项目Discord链接' />
            </Form.Item>
            <Form.Item label="Instagram链接" name="Instagram" rules={LinKValidator}>
              <Input placeholder='你的项目Instagram链接' />
            </Form.Item>
            <Form.Item label="Medium链接" name="Medium" rules={LinKValidator}>
              <Input placeholder='你的项目Medium链接' />
            </Form.Item>
            <Button type="primary" htmlType="submit" disabled={disabled} className="sumbit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div >
  )
}
