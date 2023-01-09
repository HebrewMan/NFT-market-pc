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
import { handleCopy } from 'Utils/utils'
import getUrlRegex from 'Utils/url'

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
  const { link: link } = useParams<{ link: string }>() // 路由参数id
  const account = getLocalStorage('wallet') || ''
  const token = getCookie('web-token') || ''
  const _chainId = window?.ethereum?.chainId
  const chainId = parseInt(_chainId) //链id
  const marketPlaceContractAddr = (config as any)[chainId]?.MARKET_ADDRESS //市场合约地址
  const [contractAddr, setContractAddr] = useState('')
  const [initialRoyaltyAddr, setInitialRoyaltyAddr] = useState('')
  const [initialRoyalty, setInitialRoyalty] = useState(null)
  const requireMsg = t('userSettings.required')
  const [id, setId] = useState<string>('0')
  const [formNmat, setFormNmat] = useState('')
  const linkUrl = isProd ? window.location.origin + '/gather-detail/' : 'http://192.168.1.59:4000/gather-detail/' // dev临时配置


  useEffect(() => {
    const state: any = history.location.state
    setFormNmat(state?.form)
    getAccountInfoById(link)
  }, [link])

  // 通过合集id获取基本信息
  const getAccountInfoById = async (linkCollection: string) => {
    const { data } = await getCollectionDetails({
      linkCollection: linkCollection
    })
    const { royaltyAddr, royalty } = data || {}
    setId(data.id)
    setFileAvatar(data.headUrl)
    setFileCover(data.coverUrl)
    setBackgroundImage(data.backgroundUrl)
    setContractAddr(data.contractAddr)
    setInitialRoyaltyAddr(royaltyAddr)
    setInitialRoyalty(royalty)
    // 初始化数据
    form.setFieldsValue(data)
  }


  // 表单基础校验
  const handelFieldsChange = (changedFields: any[], allFields: any[]) => {

  }
  // 提交表单
  const onFinish = () => {
    // 检查图片是否都上传
    if (_.isNull(fileAvatar)) {
      message.warn(t('gather.edit.uploadProfile'))
    } else if (_.isNull(fileCover)) {
      message.warn(t('gather.edit.uploadCover'))
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
              // 版税 且 收款地址未改变，则不调用合约接口
              if (form.getFieldValue('royaltyAddr') === initialRoyaltyAddr && Number(form.getFieldValue('royalty')) === initialRoyalty) {
                setFormData()
              } else {
                // 设置版税
                setRoyalty()
              }
            })
            .catch((err: any) => {
              // window.location.reload()
            })
        })
        .catch((err: any) => {
          // window.location.reload()
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
      id: id,
      contractAddr: contractAddr,
    }
    editMyGatherList(data).then((res: any) => {
      if (res.code == 0) {
        message.success(t('gather.edit.editSucces'))
        if (formNmat === 'list') {
          history.push('/gather')
        } else {
          history.push(`/gather-detail/${form.getFieldValue('linkCollection')}`)
        }
      }
    })
  }

  // 集合链接
  const linkCollectionRules: any = [
    { required: true, message: requireMsg },
    { pattern: /^[0-9a-zA-Z-]*$/g, message: '不可使用特殊字符' },
  ]

  // 版税校验规则
  const royaltiesRules: any = [
    { required: true, message: requireMsg },
    { pattern: /^\d+(\.\d{1,1})?$/, message: t('gather.edit.enterInfo') },
    () => ({
      validator(rule: any, value: any) {
        if (value) {
          if (Number(value) > Number(10)) {
            return Promise.reject(t('gather.edit.maxRoyalty'))
          }
        }
        return Promise.resolve()
      },
    }),
  ]
  // 链接校验格式
  const LinKValidator: any = [
    { pattern: getUrlRegex(), message: t('gather.edit.linkError') }
  ]

  // 钱包地址
  const royaltyAddrRule: any = [
    { required: true, message: t('gather.edit.address') },
    () => ({
      validator(rule: any, value: any) {
        if (value) {
          const isAddress = web3.utils.isAddress(value)
          if (!isAddress) {
            return Promise.reject(t('gather.edit.addressformat'))
          }
        }
        return Promise.resolve()
      },
    }),
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
  // 复制
  const handleChangeCopy = () => {
    const url = linkUrl + form.getFieldValue('linkCollection')
    handleCopy(url)
  }

  return (
    <div className='gatherEdit'>
      <div className='caption'>{t('gather.edit.title')}
        <span>( <em>*</em>{t('gather.edit.meansInfo')} )</span>
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
            rules={[{ required: true, message: requireMsg }]}
          >
            <Input placeholder={t('gather.edit.placeholderName') || undefined} />
          </Form.Item>
          <Form.Item
            name="linkCollection"
            label={t('gather.edit.collectionLink')}
            rules={linkCollectionRules}
          >
            <Input
              prefix={linkUrl}
              suffix={
                <img src={require('Src/assets/account/content_copy_gray.png')} alt="" onClick={() => handleChangeCopy()} style={{ cursor: 'pointer' }} />
              }
              placeholder={t('gather.edit.placeholderLink') || undefined}
            // style={{ padding: '0px' }}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('gather.edit.collectionDesc')}
            rules={[{ required: true, message: requireMsg }]}
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
                {fileAvatar == null || fileAvatar == '' ? <img src='Src/assets/account/upload.png'></img> : <img src={fileAvatar} className="imgWidth" />}
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
                {fileCover == null || fileCover == '' ? <img src='Src/assets/account/upload.png'></img> : <img src={fileCover} className="imgWidth" />}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item label={
            <div className='imgTitle norequire'>
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
                    <Tooltip title={t('gather.edit.creatorInfo')}>
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
              <Form.Item label={t('gather.edit.receivingAddress')} name='royaltyAddr' rules={royaltyAddrRule}>
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
