import type { Key } from 'react';
import React, { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Pagination, Result } from '@/domains/Common';
import { buildColumn } from '@/pages/device/Column';
import type { ProFormInstance } from '@ant-design/pro-form';
import { buildCreateModal } from '@/pages/device/Modals';
import { Dropdown, Menu, message, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { Device } from '@/domains/Device.d';
import DeviceService from '@/services/Device';
import { FormattedMessage, useIntl } from 'umi';

const TableList: React.FC = () => {
  const service = new DeviceService();

  //全局引用区域
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const createFormRef = useRef<ProFormInstance>();
  const updateFormRef = useRef<ProFormInstance>();
  const intl = useIntl();
  //全局变量区域
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]); //当前选中的多行Keys信息
  const [total, setTotal] = useState<any>(); //数据总行数
  const [loading, setLoading] = useState<boolean>(); //数据总行数

  function buildToolbar(): any {
    return {
      actions: [
        buildCreateModal(createFormRef, doCreate),
        <Dropdown
          key="remove"
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={doRemove}>
                <FormattedMessage id='delete'/>
              </Menu.Item>
            </Menu>
          }
        >
          <Button>
            <FormattedMessage id='delete'/>
            <DownOutlined style={{ marginLeft: 8 }} />
          </Button>
        </Dropdown>,
      ],
    };
  }

  async function doList(params: { pageSize: number; current: number }): Promise<Result<Device[]>> {
    const result = await service.list({ ...params });
    setTotal(result.total);
    return Promise.resolve(result);
  }

  async function doCreate(values: Device): Promise<boolean> {
    try {
      setLoading(true);
      await service.upload(values);
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

  async function doUpdate(values: Device): Promise<boolean> {
    try {
      setLoading(true);
      await service.update(values);
      tableRef?.current?.reload();
      message.success(`${intl.formatMessage({id: 'update.success'})}`);
      setLoading(false);
      return true;
    } catch (error) {
      message.error(`${intl.formatMessage({id: 'update.failed'})}`);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function doRemove(): Promise<boolean> {
    if (selectedRowKeys.length == 0) {
      message.warn(`${intl.formatMessage({id: 'select.platform'})}`);
      return false;
    }
    await service.remove(selectedRowKeys);
    message.success(`${intl.formatMessage({id: 'delete.success'})}`);
    tableRef?.current?.reload();
    return true;
  }

  return (
    <>
      <ProTable<Device, Pagination>
        scroll={{ x: 'max-content' }}
        headerTitle={<FormattedMessage id='instrument'/>}
        actionRef={tableRef}
        rowKey="id"
        loading={loading}
        size="middle"
        toolbar={buildToolbar()}
        search={{ span: 4 }}
        tableAlertRender={false}
        pagination={{
          total,
        }}
        request={doList}
        columns={buildColumn(updateFormRef, doUpdate)}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </>
  );
};

export default TableList;
