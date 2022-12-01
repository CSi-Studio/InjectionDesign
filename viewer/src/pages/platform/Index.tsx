import type { Key } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Pagination, Result } from '@/domains/Common';
import { buildColumn } from '@/pages/platform/Column';
import type { ProFormInstance } from '@ant-design/pro-form';
import { buildCreateModal } from '@/pages/platform/Modals';
import { Dropdown, Menu, message, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import PlatformService from '@/services/PlatformService';
import type { Platform } from '@/domains/Platform.d';
//@ts-ignore
import { FormattedMessage, useIntl } from 'umi';

const TableList: React.FC = () => {
  const service = new PlatformService();

  //全局引用区域
  const tableRef = useRef<ActionType>(); //Table组件的引用
  const createFormRef = useRef<ProFormInstance>();
  const updateFormRef = useRef<ProFormInstance>();

  //全局变量区域
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]); //当前选中的多行Keys信息
  const [total, setTotal] = useState<any>(); //数据总行数
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const intl = useIntl();

  useEffect(() => {}, []);

  function buildToolbar(): any {
    return {
      actions: [
        buildCreateModal(createFormRef, doCreate),
        <Dropdown
          key="remove"
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={doRemove}>
                <FormattedMessage id='delete.platform'/>
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

  async function doList(params: {
    pageSize: number;
    current: number;
  }): Promise<Result<Platform[]>> {
    const result = await service.list({ ...params });
    //按 name分组
    const data = result.data.reduce((acc: any, cur: Platform) => {
      if (!acc[cur.name]) {
        acc[cur.name] = [];
      }
      acc[cur.name].push(cur);
      return acc;
    }, {});
    //按 name分组后的数据
    const dataList = Object.keys(data).map((key: string) => {
      return {
        name: key,
        children: data[key],
        id: key,
      };
    });
    const newResult: any = result;
    newResult.data = dataList;

    console.log("data", data, "dataList", dataList)
    setTotal(newResult.total);
    return Promise.resolve(newResult);
  }

  async function doCreate(values: Platform): Promise<boolean> {
    try {
      setLoading(true);
      await service.submit(values);
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

  async function doUpdate(values: Platform): Promise<boolean> {
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
      <ProTable<Platform, Pagination>
        scroll={{ x: 'max-content' }}
        headerTitle={`${intl.formatMessage({id: 'platform'})}`}
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
        expandable={{
          expandRowByClick: true,
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
