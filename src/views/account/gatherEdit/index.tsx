import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Upload, Row, Col, Tooltip, message } from 'antd'
import './index.scss'
import _ from 'lodash'
import { fileSizeValidator } from 'Utils/utils'
import { useTranslation } from 'react-i18next'
import { createIpfs } from 'Src/api'
const { TextArea } = Input
import { useParams } from 'react-router-dom'
import { getCollectionDetails, editMyGatherList } from 'Src/api/collection'
import config, { isProd } from 'Src/config/constants'
import Web3 from 'web3'
import { getNonce } from 'Src/api/index'
import { getLocalStorage, getCookie } from 'Utils/utils'
import { useHistory } from 'react-router-dom'
import { setRoyaltyRateData } from 'Src/hooks/marketplace'
import instanceLoading from 'Utils/loading'
import useWeb3 from 'Src/hooks/useWeb3'

let Ethweb3: any
export const GatherEdit: React.FC<any> = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const [form] = Form.useForm()
  const web3 = useWeb3()
  const [disabled, setDisabled] = useState(false)
  const [fileAvatar, setFileAvatar] = useState(null) //头像
  const [fileCover, setFileCover] = useState(null) //封面图
  const [backgroundImage, setBackgroundImage] = useState(null) //背景图
  const { id: id } = useParams<{ id: string }>() // 路由参数id
  const linkUrl = window.location.origin
  const account = getLocalStorage('wallet') || ''
  const token = getCookie('web-token') || ''
  const _chainId = window?.ethereum?.chainId
  const chainId = parseInt(_chainId) //链id
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS //市场合约地址
  const [contractAddr, setContractAddr] = useState('')
  useEffect(() => {
    getAccountInfoById(id)
  }, [id])

  // 通过合集id获取基本信息
  const getAccountInfoById = async (id: string) => {
    const { data } = await getCollectionDetails(Number(id))
    setFileAvatar(data.headUrl)
    setFileCover(data.coverUrl)
    setBackgroundImage(data.backgroundUrl)
    setContractAddr(data.contractAddr)
    // 初始化数据
    form.setFieldsValue({
      name: data.name,
      linkCollection: data.linkCollection,
      description: data.description,
      fileAvatar: data.headUrl,
      coverUrl: data.fileCover,
      backgroundUrl: data.backgroundUrl,
      royalty: data.royalty,
      royaltyAddr: data.royaltyAddr,
      linkDiscord: data.linkDiscord,
      linkInstagram: data.linkInstagram,
      linkMedium: data.linkMedium,
      linkTwitter: data.linkTwitter,
      linkSkypegmwcn: data.linkSkypegmwcn
    })
  }


  // 表单基础校验
  const handelFieldsChange = (changedFields: any[], allFields: any[]) => {

  }
  // 提交表单
  const onFinish = () => {
    // 检查图片是否都上传
    if (_.isNull(fileAvatar)) {
      message.warn('请上传集合头像')
    } else if (_.isNull(fileCover)) {
      message.warn('请上传集合封面')
    } else if (_.isNull(backgroundImage)) {
      message.warn('请上传集合背景')
    } else {
      form.validateFields().then((values: any) => {
        //调用签名
        useSignature(account)
      })
    }
  }
  // 调用签名
  const useSignature = (account: string) => {
    const _web3 = Ethweb3 || new Web3(window?.ethereum)
    if (!account) {
      return
    }
    return new Promise(() => {
      getNonce(account)
        .then((sign: any) => {
          _web3?.eth?.personal
            ?.sign(sign.data, account)
            .then((value: string) => {
              // 设置版税
              setRoyalty()
            })
            .catch((err: any) => {
              window.location.reload()
            })
        })
        .catch((err: any) => {
          window.location.reload()
        })
    })
  }

  // 设置版税
  const setRoyalty = async () => {
    const obj = {
      marketPlaceContractAddr,
      contractAddr,
      royaltyAddr: form.getFieldValue('royaltyAddr'),
      royalty: form.getFieldValue('royalty'),
      account
    }
    if (!account || !token) {
      message.error(t('hint.pleaseLog'))
      history.push('/login')
      return
    }
    if (chainId !== 1319 && isProd) {
      message.error(t('hint.switchMainnet'))
      return
    }
    instanceLoading.service()
    try {
      const modifyPriceRes = await setRoyaltyRateData(web3, obj)
      if (modifyPriceRes?.transactionHash) {
        // 设置成功之后 调用后端接口存数据
        setFormData()
      }
    } catch (error: any) {
      instanceLoading.close()
    }
    instanceLoading.close()
  }
  // 调接口 存数据
  const setFormData = () => {
    const values = form.getFieldsValue()
    const data: any = {
      ...values,
      headUrl: fileAvatar,
      coverUrl: fileCover,
      backgroundUrl: backgroundImage,
      id: id
    }
    editMyGatherList(data).then((res: any) => {
      if (res.code == 0) {
        message.success('编辑成功')
        history.go(-1)
      }

    })
      .catch((err: any) => {

      })
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
          setBackgroundImage(res.data)
          break
        default:
          break
      }
    })

  }

  return (
    <div className='gatherEdit'>
      <div className='caption'>{t('gather.edit.title')}
        {/* <span>( <em>*</em> 为必填项 )</span> */}
      </div>
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
            label={t('gather.edit.collectionName')}
            rules={[{ required: true, message: '该字段为必填项' }]}
          >
            <Input placeholder={t('gather.edit.placeholderName') || undefined} />
          </Form.Item>
          <Form.Item
            name="linkCollection"
            label={t('gather.edit.collectionLink')}
            rules={[{ required: true, message: '该字段为必填项' }]}
          >
            <Input prefix={linkUrl} placeholder={t('gather.edit.placeholderLink') || undefined} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('gather.edit.collectionDesc')}
            rules={[{ required: true, message: '该字段为必填项' }]}
          >
            <TextArea rows={4} placeholder={t('gather.edit.placeholderDesc') || undefined} maxLength={500} showCount />
          </Form.Item>
          <Form.Item
            label={
              <div className='imgTitle'>
                {t('gather.edit.collectionProfile')}
                <span>{t('gather.edit.profileTips')}</span>
              </div>
            }
          >

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
              {t('gather.edit.collectionCover')}
              <span>{t('gather.edit.coverTips')}</span>
            </div>
          }
          >
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
              {t('gather.edit.collectionBg')}
              <span>{t('gather.edit.bgTips')}</span>
            </div>
          }
          >
            <Upload
              beforeUpload={(file) => fileSizeValidator(file, 10)}
              customRequest={(options) => customRequest(options, '3')}
              showUploadList={false}
              accept={'.jpg,.png,.svg'}
              listType="picture"
            >
              <Button className='editBgImage'>
                {backgroundImage == null ? <img src='Src/assets/account/upload.png'></img> : <img src={backgroundImage} className="imgWidth" />}
              </Button>
            </Upload>
          </Form.Item>
          <Row gutter={24}>
            <Col span={9}>
              <Form.Item
                label={
                  <div>
                    {t('gather.edit.royalty')}
                    <Tooltip title="你作为创作者，每交易一笔NFTs，即可按交易价格收取一定比例收益。">
                      <img src="Src/assets/account/question.png" alt="" className="royalties" />
                    </Tooltip>
                  </div>
                }
                name="royalty"
                rules={royaltiesRules}>
                <Input suffix="%" />
              </Form.Item>
            </Col>
            <Col span={15}>
              <Form.Item label="收款地址" name='royaltyAddr' rules={[{ required: true, message: t('gather.edit.address') || undefined }]}>
                <Input placeholder={t('gather.edit.address') || undefined} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={t('gather.edit.officialLink')} name="linkSkypegmwcn" rules={LinKValidator}>
            <Input placeholder={t('gather.edit.placeholderOfficial') || undefined} />
          </Form.Item>
          <Form.Item>
            <Form.Item label={t('gather.edit.twitterLink')} name="linkTwitter" rules={LinKValidator}>
              <Input type='href' placeholder={t('gather.edit.placeholderTw') || undefined} />
            </Form.Item>
            <Form.Item label={t('gather.edit.discordLink')} name="linkDiscord" rules={LinKValidator}>
              <Input placeholder={t('gather.edit.placeholderDis') || undefined} />
            </Form.Item>
            <Form.Item label={t('gather.edit.instagramLink')} name="linkInstagram" rules={LinKValidator}>
              <Input placeholder={t('gather.edit.placeholderIns') || undefined} />
            </Form.Item>
            <Form.Item label={t('gather.edit.mediumLink')} name="linkMedium" rules={LinKValidator}>
              <Input placeholder={t('gather.edit.placeholderMed') || undefined} />
            </Form.Item>
            <Button type="primary" htmlType="submit" disabled={disabled} className="sumbit">
              {t('gather.edit.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div >
  )
}
