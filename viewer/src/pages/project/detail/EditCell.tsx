import { useState, useEffect, useRef } from 'react'
import { Popover, Input, Form, Button } from 'antd'
// @ts-ignore
import Icon from './Icon'
import {FormattedMessage} from "umi";

export default function EditCell(props: { record: any; handleEditCell: any; placement?: "topLeft" | undefined; title: any; children: any; getEdieCellFields?: (({ inputEl }: { inputEl: any }) => JSX.Element) | undefined }) {
  const {
    record,
    handleEditCell,
    placement = 'topLeft',
    title,
    children,
    getEdieCellFields = getEdieCellFieldsExample,
  } = props
  const [form] = Form.useForm()
  const inputEl = useRef(null)
  const [visible, setVisible] = useState(false)
  const [initialValues, setInitialValues] = useState({
    ...record,
  })

  //编辑接口调用成功后执行这个回调
  const callback = () => {
    setVisible(false)
  }

  //添加或编辑
  const handleFinish = (values: any) => {
    console.log('Success:', values)
    handleEditCell({ record, values, callback })
  }

  //校验失败
  const handleFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  //气泡卡片显示状态变化
  const handleVisibleChange = (visible: boolean | ((prevState: boolean) => boolean)) => {
    setVisible(visible)
    setInitialValues({ ...record })
  }

  //表单数据报错最新
  useEffect(() => {
    form.resetFields()

    setTimeout(() => {
      // @ts-ignore
      inputEl.current && inputEl.current.focus()
    }, 100)

    // eslint-disable-next-line
  }, [initialValues])

  // @ts-ignore
  function getEdieCellFieldsExample({inputEl}) {
    return (
      <>
        <Form.Item
          label={<FormattedMessage id='name'/>}
          name="name"
          rules={[
            {
              required: true,
              message: <FormattedMessage id='input.name'/>,
            },
          ]}
        >
          <Input ref={inputEl} />
        </Form.Item>
      </>
    )
  }

  //表单内容
  const getContent = () => {
    return (
      <div className="m-edit-cell-content">
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ ...initialValues }}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <div className="m-edit-cell-form-item-wrap">
            {getEdieCellFields({inputEl})}
          </div>
          <Form.Item
            wrapperCol={{ offset: 6, span: 18 }}
            className="m-edit-cell-footer"
          >
            <Button type="primary" htmlType="submit" className="m-space">
              {/*<Icon name="submit" className="m-tool-btn-icon"></Icon>*/}
              <FormattedMessage id='submit'/>
            </Button>
            <Button
              className="m-space"
              onClick={() => {
                form.resetFields()
              }}
            >
              {/*<Icon name="reset" className="m-tool-btn-icon"></Icon>*/}
              <FormattedMessage id='reset'/>
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }


  return (
    <Popover
      placement={placement}
      title={title}
      content={getContent()}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      // @ts-ignore
      getPopupContainer={() => document.getElementById('m-content-wrap')}
      forceRender
    >
      <div className="m-popover-inner">{children}</div>
    </Popover>
  )
}
