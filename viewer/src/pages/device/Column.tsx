import type {ProColumns,ActionType} from '@ant-design/pro-table';
import {buildUpdateModal} from '@/pages/device/Modals';
import type {Device} from '@/domains/Device.d';
import {url} from "@/utils/request";
import {DeleteOutlined, EditOutlined, FileSearchOutlined} from "@ant-design/icons";
import {Button, message, Popconfirm, Space} from "antd";
import type {Key} from "react";
import { useRef, useState} from "react";
import ProTable from '@ant-design/pro-table';
import type {Pagination, Result} from "@/domains/Common";
import DevicePartService from "@/services/DevicePartService";
//@ts-ignore
import { FormattedMessage, useIntl } from 'umi';
import ProForm, {ModalForm} from "@ant-design/pro-form";
import {DeviceFields, DevicePartsFields, DeviceRepairFields} from "@/domains/Device.d";


const devicePartService = new DevicePartService();

/**
 * 定义设备管理列表字段
 * @param updateForm
 * @param doUpdate
 */
export function buildColumn(updateForm: any, doUpdate: any) {
  /**
   * 设备配件参数定义
   */
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const [total, setTotal] = useState<any>(); //数据总行数
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const intl = useIntl();
  /**
   * 常规维护参数定义
   */
  const deviceRepairTableRef = useRef<ActionType>(); //Table组件的引用

  /**
   * 样本列表查询
   * @param params
   */
  async function doDevicePartList(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<DeviceParts[]>> {
    const result = await devicePartService.list({...params});
    setTotal(result.total);
    return Promise.resolve(result);
  }

  /**
   * 创建配件
   * @param values
   */
  async function doCreate(values: DeviceParts): Promise<boolean> {
    try {
      setLoading(true);
      await devicePartService.add({...values});

      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'create.success'})}`);
      setLoading(false);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'create.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 删除配件
   */
  async function doDelete(value: Key): Promise<boolean> {
    try {
      setLoading(true);
      await devicePartService.delete(value);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } finally {
      setLoading(false);
    }
    return false;
  }

  /**
   * 创建维修记录
   * @param values
   */
  async function doCreateRepairRecord(values: DeviceRepair): Promise<boolean> {
    try {
      setLoading(true);
      await devicePartService.addRepair({...values});
      deviceRepairTableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'create.success'})}`);
      setLoading(false);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'create.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 维修记录查询
   * @param params
   */
  async function doDeviceRepairList(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<DeviceRepair[]>> {
    const result = await devicePartService.getDeviceRepair({...params});
    setTotal(result.total);
    return Promise.resolve(result);
  }

  /**
   * 删除维修记录
   */
  async function doDeleteRepair(value: Key): Promise<boolean> {
    try {
      setLoading(true);
      await devicePartService.deleteRepair(value);
      deviceRepairTableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'delete.success'})}`);
      return true;
    } finally {
      setLoading(false);
    }
    return false;
  }


  const devicePartColumns: ProColumns<DeviceParts>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='name'/>,
      dataIndex: 'name',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='good.no'/>,
      dataIndex: 'goodNo',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='specification'/>,
      dataIndex: 'format',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='comment'/>,
      dataIndex: 'comment',
      hideInTable: false,
      hideInSearch: true,
      readonly: true,
    },
    {
      title: <FormattedMessage id='create.date'/>,
      dataIndex: 'createDate',
      hideInTable: false,
      hideInSearch: true,
      readonly: true,
    },
    {
      key: 'option',
      title: <FormattedMessage id='option'/>,
      valueType: 'option',
      fixed: 'right',
      width: '220px',
      hideInSearch: true,
      render: (text, deviceParts) => [
        <>
          {buildDevicePartsUpdateModal(doUpdate, deviceParts)}
          {/*<Button size={'small'} type="primary"><EditOutlined/>编辑</Button>*/}
          <Popconfirm placement={'topLeft'} title={<FormattedMessage id='confirm.delete'/>} key="delete" onConfirm={() => doDelete(deviceParts.id)}>
            <Button danger size={'small'}><DeleteOutlined/><FormattedMessage id='delete'/></Button>
          </Popconfirm>
        </>
      ],
    },
  ]

  const deviceRepairColumns: ProColumns<DeviceRepair>[] = [
    {
      title: 'itemId',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='content'/>,
      dataIndex: 'content',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='owner'/>,
      dataIndex: 'owner',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='maintenance.cycle'/>,
      dataIndex: 'repairCycle',
      hideInTable: false,
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id='comment'/>,
      dataIndex: 'comment',
      hideInTable: false,
      hideInSearch: true,
      readonly: true,
    },
    {
      title: <FormattedMessage id='create.date'/>,
      dataIndex: 'createDate',
      hideInTable: false,
      hideInSearch: true,
      readonly: true,
    },
    {
      key: 'option',
      title: <FormattedMessage id='option'/>,
      valueType: 'option',
      fixed: 'right',
      width: '220px',
      hideInSearch: true,
      render: (text, deviceRepair) => [
        <>
          <ModalForm
            // formRef={updateFormRef}
            autoFocusFirstInput
            title={<FormattedMessage id='instrument.update'/>}
            trigger={
              <a><EditOutlined /><FormattedMessage id='update'/></a>
            }
            width={370}
            modalProps={{ destroyOnClose: true }}
            onFinish={doUpdate}
          >
            <ProForm.Group>
              {DeviceFields.id(deviceRepair.id, true)}
              {DeviceFields.createDate(deviceRepair.createDate, true)}
            </ProForm.Group>
          </ModalForm>
          <Popconfirm placement={'topLeft'} title={<FormattedMessage id='confirm.delete'/>} key="delete" onConfirm={() => doDeleteRepair(deviceRepair.id)}>
            <a style={{color: 'red'}}><DeleteOutlined/><FormattedMessage id='delete'/></a>
          </Popconfirm>
        </>
      ],
    },
  ]


  const columns: ProColumns<Device>[] = [
    {
      key: 'Id',
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      key: 'deviceName',
      title: <FormattedMessage id='name'/>,
      dataIndex: 'name',
      copyable: true,
    },
    {
      key: 'deviceModel',
      title: <FormattedMessage id='model'/>,
      dataIndex: 'deviceModel',
      copyable: true,
    },
    {
      key: 'deviceType',
      title: <FormattedMessage id='type'/>,
      dataIndex: 'deviceType',
      hideInSearch: true,
    },
    {
      key: 'mainParam',
      title: <FormattedMessage id='main.params'/>,
      hideInSearch: true,
      dataIndex: 'mainParam',
    },
    {
      key: 'owner',
      title: <FormattedMessage id='owner'/>,
      hideInSearch: true,
      dataIndex: 'owner',
    },
    {
      key: 'trainingMaterial',
      title: <FormattedMessage id='training.materials'/>,
      hideInSearch: true,
      dataIndex: 'trainingMaterial',
      render: (text, device) => {
        return (
          <a
            target={'_blank'}
            href={`${url}/platform/file/download?fileId=${device.trainingMaterial}`}
            rel="noreferrer"
          >
            {device.trainingMaterialName}
          </a>
        );
      },
    },
    {
      key: 'otherMaterial',
      title: <FormattedMessage id='other.materials'/>,
      hideInSearch: true,
      dataIndex: 'otherMaterial',
      render: (text, device) => {
        return (
          <a
            target={'_blank'}
            href={`${url}/platform/file/download?fileId=${device.otherMaterial}`}
            rel="noreferrer"
          >
            {device.otherMaterialName}
          </a>
        );
      },
    },
    {
      key: 'createDate',
      title: <FormattedMessage id='create.date'/>,
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
      showSorterTooltip: false,
      sorter: (a, b) => {
        return a?.createDate > b?.createDate ? -1 : 1;
      },
    },
    {
      key: 'option',
      title: <FormattedMessage id='option'/>,
      valueType: 'option',
      fixed: 'right',
      width: '350px',
      hideInSearch: true,
      render: (text, platform) => [
        buildUpdateModal(updateForm, doUpdate, platform),
        <ModalForm
          title={<FormattedMessage id='parts.info'/>}
          autoFocusFirstInput
          trigger={
            <a><FileSearchOutlined/><FormattedMessage id='parts.info'/></a>
          }
          width={1200}
          onFinish={async () => {
            return true;
          }}
        >
          <ProTable<DeviceParts, Pagination>
            actionRef={tableRef}
            // formRef={tableRef}
            headerTitle={<FormattedMessage id='parts.info'/>}
            toolBarRender={() => [<div key="add"> {buildDevicePartsCreateModal(doCreate, platform)}</div>]}
            search={false}
            rowKey="id"
            tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
              <Space size={24}>
                      <span>
                        已选 {selectedRowKeys.length} 项
                        <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                          取消选择
                        </a>
                      </span>
              </Space>
            )}
            loading={loading}
            request={(params) => {
              //@ts-ignore
              const result = doDevicePartList({...params, deviceId: platform.id});
              return result;
            }}
            pagination={{
              total,
              pageSize: 50,
            }}
            columns={devicePartColumns}
          />
        </ModalForm>,
        <ModalForm
          title={<FormattedMessage id='maintenance.normal'/>}
          autoFocusFirstInput
          trigger={
            <a><FileSearchOutlined/><FormattedMessage id='maintenance.normal'/></a>
          }
          width={1200}
          onFinish={async () => {
            return true;
          }}
        >
          <ProTable<DeviceRepair, Pagination>
            actionRef={deviceRepairTableRef}
            headerTitle={<FormattedMessage id='maintenance.normal'/>}
            toolBarRender={() => [<div key="add"> {buildDeviceRepairCreateModal(doCreateRepairRecord, platform)}</div>]}
            search={false}
            rowKey="id"
            tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
              <Space size={24}>
                      <span>
                         {selectedRowKeys.length} <FormattedMessage id='selected'/>
                        <a style={{marginLeft: 8}} onClick={onCleanSelected}>
                          <FormattedMessage id='unselect'/>
                        </a>
                      </span>
              </Space>
            )}
            loading={loading}
            request={(params) => {
              //@ts-ignore
              const result = doDeviceRepairList({...params, deviceId: platform.id});
              return result;
            }}
            pagination={{
              total,
              pageSize: 50,
            }}
            columns={deviceRepairColumns}
          />
        </ModalForm>,
        // <ModalForm
        //   title={<FormattedMessage id='record'/>}
        //   autoFocusFirstInput
        //   trigger={
        //     <a><FileSearchOutlined/><FormattedMessage id='record'/></a>
        //   }
        //   width={1200}
        //   onFinish={async () => {
        //     return true;
        //   }}
        // >
        //   <ProTable<DeviceRepair, Pagination>
        //     actionRef={deviceRepairTableRef}
        //     headerTitle={<FormattedMessage id='maintenance.normal'/>}
        //     toolBarRender={() => [<div key="add"> {buildDeviceRepairCreateModal(doCreateRepairRecord, platform)}</div>]}
        //     search={false}
        //     rowKey="id"
        //     tableAlertRender={({selectedRowKeys, onCleanSelected}) => (
        //       <Space size={24}>
        //               <span>
        //                  {selectedRowKeys.length} <FormattedMessage id='selected'/>
        //                 <a style={{marginLeft: 8}} onClick={onCleanSelected}>
        //                   <FormattedMessage id='unselect'/>
        //                 </a>
        //               </span>
        //       </Space>
        //     )}
        //     loading={loading}
        //     request={(params) => {
        //       //@ts-ignore
        //       const result = doDeviceRepairList({...params, deviceId: platform.id});
        //       return result;
        //     }}
        //     pagination={{
        //       total,
        //       pageSize: 50,
        //     }}
        //     columns={deviceRepairColumns}
        //   />
        // </ModalForm>,
      ],
    },
  ];
  return columns;
};

/**
 * 设备配件方法定义
 * @param doCreate
 * @param device
 */
export function buildDevicePartsCreateModal(doCreate: any, device: Device) {
  return (
    <ModalForm
      key="create"
      title={<FormattedMessage id='create.parts'/>}
      trigger={<Button type="primary"><FormattedMessage id='create.parts'/></Button>}

      width={350}
      modalProps={{destroyOnClose: true}}
      onFinish={async (values) => {
        return doCreate({...values, deviceId: device.id})
      }}
    >
      <ProForm.Group>{DevicePartsFields.name()}</ProForm.Group>
      <ProForm.Group>{DevicePartsFields.goodNo()}</ProForm.Group>
      <ProForm.Group>{DevicePartsFields.format()}</ProForm.Group>
      <ProForm.Group>{DevicePartsFields.type()}</ProForm.Group>
      <ProForm.Group>{DevicePartsFields.comment()}</ProForm.Group>
    </ModalForm>
  );
}

export function buildDevicePartsUpdateModal(doUpdate: any, device: DeviceParts) {
  return (
    <ModalForm
      // formRef={updateFormRef}
      autoFocusFirstInput
      title={<FormattedMessage id='update.parts'/>}
      trigger={
        <Button size={'small'} type={'primary'}><EditOutlined /><FormattedMessage id='update'/></Button>
      }
      width={370}
      modalProps={{ destroyOnClose: true }}
      onFinish={doUpdate}
    >
      <ProForm.Group>
        {DevicePartsFields.name(device.name, false)}
        {DevicePartsFields.goodNo(device.goodNo, false)}
        {DevicePartsFields.format(device.format, false)}
        {DevicePartsFields.type(device.type, false)}
        {DevicePartsFields.comment(device.comment, false)}
      </ProForm.Group>
    </ModalForm>
  );
}

/**
 * 设备维护方法
 */
export function buildDeviceRepairCreateModal(doCreate: any, device: Device) {
  return (
    <ModalForm
      key="create"
      title={<FormattedMessage id='create.maintenance'/>}
      trigger={<Button type="primary"><FormattedMessage id='create'/></Button>}
      width={350}
      onFinish={async (values) => {
        return doCreate({...values, deviceId: device.id})
      }}
    >
      <ProForm.Group>{DeviceRepairFields.content()}</ProForm.Group>
      <ProForm.Group>{DeviceRepairFields.owner()}</ProForm.Group>
      <ProForm.Group>{DeviceRepairFields.repairCycle()}</ProForm.Group>
      <ProForm.Group>{DeviceRepairFields.comment()}</ProForm.Group>
    </ModalForm>
  );
}

/**
 * 设备配件
 */
export type DeviceParts = {
  id: string;
  name: string;
  goodNo: string;
  type: string;
  format: string;
  comment: string;
  createDate: string;
  lastModifiedDate: string;
};

/**
 * 常规维护
 */
export type DeviceRepair = {
  id: string;
  content: string;
  owner: string;
  repairTime: string;
  repairCycle: string;
  comment: string;
  createDate: string;
  lastModifiedDate: string;
};
