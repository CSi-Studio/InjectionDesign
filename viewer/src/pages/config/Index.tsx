import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import type { Config } from '@/domains/Config.d';
import { message, Popconfirm, Tabs, Tag } from 'antd';
import {
  buildMatrixCreateModal,
  buildSpeciesCreateModal,
  editMatrixModal,
  editSpeciesModal,
} from '@/pages/config/Modals';
import ConfigService from '@/services/ConfigService';
import type { Pagination } from '@/domains/Common';
import {DeleteOutlined} from "@ant-design/icons";
// @ts-ignore
import {useIntl, FormattedMessage} from "umi";

const { TabPane } = Tabs;


export default () => {
  /**
   * 配置管理服务
   */
  const intl = useIntl();
  const service = new ConfigService();
  const [loading, setLoading] = useState<boolean>(); //数据总行数
  const speciesTableRef = useRef<any>();
  const matrixTableRef = useRef<any>();

  const [total, setTotal] = useState<any>(); //数据总行数

  /**
   * 获取物种列表
   * @param params
   */
  async function doSpeciesList(params: { pageSize: number; current: number }): Promise<any> {
    const result = await service.list({ ...params, configType: 'species' });
    setTotal(result.total);
    return Promise.resolve(result);
  }
  /**
   * 获取基质列表
   * @param params
   */
  async function doMatrixList(params: { pageSize: number; current: number }): Promise<any> {
    const result = await service.list({ ...params, configType: 'matrix' });
    setTotal(result.total);
    return Promise.resolve(result);
  }

  /**
   * 创建物种
   * @param values
   */
  async function doSpeciesCreate(values: Config): Promise<boolean> {
    try {
      setLoading(true);
      await service.add({ ...values, configType: 'species' });
      speciesTableRef?.current?.reload();
      message.success( `${intl.formatMessage({id: 'create.success'})} `);
      setLoading(false);
      return true;
    } catch (error) {
      message.success( `${intl.formatMessage({id: 'create.failed'})} `);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 创建基质
   * @param values
   */
  async function doMatrixCreate(values: Config): Promise<boolean> {
    try {
      setLoading(true);
      await service.add({ ...values, configType: 'matrix' });
      matrixTableRef?.current?.reload();
      message.success( `${intl.formatMessage({id: 'create.success'})} `);
      setLoading(false);
      return true;
    } catch (error) {
      message.success( `${intl.formatMessage({id: 'create.failed'})} `);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 删除物种
   * @param id
   */
  async function doSpeciesDelete(id: string): Promise<boolean> {
    try {
      setLoading(true);
      await service.delete(id);
      speciesTableRef?.current?.reload();
      message.success( `${intl.formatMessage({id: 'delete.success'})} `);
      setLoading(false);
      return true;
    } catch (error) {
      message.success( `${intl.formatMessage({id: 'delete.failed'})} `);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 删除基质
   * @param id
   */
  async function doMatrixDelete(id: string): Promise<boolean> {
    try {
      setLoading(true);
      await service.delete(id);
      matrixTableRef?.current?.reload();
      message.success( `${intl.formatMessage({id: 'delete.success'})} `);
      setLoading(false);
      return true;
    } catch (error) {
      message.success( `${intl.formatMessage({id: 'delete.failed'})} `);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 编辑物种
   * @param id
   * @param value
   */
  async function doSpeciesEdit(params: any): Promise<boolean> {
    try {
      setLoading(true);
      await service.update({ ...params, configType: 'species' });
      speciesTableRef?.current?.reload();
      message.success( `${intl.formatMessage({id: 'update.success'})} `);
      setLoading(false);
      return true;
    } catch (error) {
      message.success( `${intl.formatMessage({id: 'update.failed'})} `);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 编辑基质
   * @param id
   * @param value
   */
  async function doMatrixEdit(params: any): Promise<boolean> {
    try {
      setLoading(true);
      await service.update({ ...params, configType: 'matrix' });
      matrixTableRef?.current?.reload();
      message.success( `${intl.formatMessage({id: 'update.success'})} `);
      setLoading(false);
      return true;
    } catch (error) {
      message.success( `${intl.formatMessage({id: 'update.failed'})} `);
      return false;
    } finally {
      setLoading(false);
    }
  }

  /**
   * 列表页字段
   */
  const columnsMap: Record<string, ProColumns<Config>[]> = {
    species: [
      {
        title: `${intl.formatMessage({id: 'config.no'})} `,
        dataIndex: 'configNo',
        render: (_) => <a>{_}</a>,
      },
      {
        title: `${intl.formatMessage({id: 'species.name'})} `,
        key: 'configName',
        dataIndex: 'configName',
        valueType: 'select',
        request: () =>
          Promise.resolve([
            {
              label: `${intl.formatMessage({id: 'success'})} `,
              value: 1,
            },
            {
              label: `${intl.formatMessage({id: 'failed'})} `,
              value: 0,
            },
          ]),
      },
      {
        title: <FormattedMessage id='alias'/>,
        dataIndex: 'alias',
      },
      {
        title: <FormattedMessage id='create.date'/>,
        dataIndex: 'createDate',
      },
      {
        title: <FormattedMessage id='option'/>,
        key: 'option',
        valueType: 'option',
        width: 220,
        render: (text, record) => [
          editSpeciesModal(record, doSpeciesEdit),
          <Popconfirm
            placement="topRight"
            title= {<FormattedMessage id='confirm.delete'/>}
            key="delete"
            onConfirm={() => doSpeciesDelete(record.id)}
          >
            <a style={{color: "red"}}>
              <DeleteOutlined /><FormattedMessage id='delete'/>
            </a>
          </Popconfirm>,
        ],
      },
    ],
    matrix: [
      {
        title: `${intl.formatMessage({id: 'config.no'})} `,
        dataIndex: 'configNo',
        render: (_) => <a>{_}</a>,
      },
      {
        title: `${intl.formatMessage({id: 'matrix.name'})}`,
        key: 'configName',
        dataIndex: 'configName',
      },
      {
        title: `${intl.formatMessage({id: 'alias'})}`,
        dataIndex: 'alias',
      },
      {
        title: `${intl.formatMessage({id: 'create.date'})}`,
        dataIndex: 'createDate',
      },
      {
        title: `${intl.formatMessage({id: 'option'})}`,
        key: 'option',
        valueType: 'option',
        width: 120,
        render: (text, record) => [
          editMatrixModal(record, doMatrixEdit),
          <Popconfirm
            placement="topRight"
            title={`${intl.formatMessage({id: 'confirm.delete'})}`}
            key="delete"
            onConfirm={() => doMatrixDelete(record.id)}
          >
            <Tag
              color="red"
              style={{
                cursor: 'pointer',
              }}
            >
              <FormattedMessage id='delete'/>
            </Tag>
          </Popconfirm>,
        ],
      },
    ],
  };

  return (
    <Tabs defaultActiveKey="1" style={{marginLeft: 15}}  onChange={() => {}}>
      <TabPane tab={<FormattedMessage id='species'/>} key="1">
        <ProTable<Config, Pagination>
          actionRef={speciesTableRef}
          toolBarRender={() => [<div key="add"> {buildSpeciesCreateModal(doSpeciesCreate)}</div>]}
          loading={loading}
          columns={columnsMap.species}
          request={doSpeciesList}
          size="middle"
          rowKey="id"
          search={false}
          pagination={{
            total,
          }}
        />
      </TabPane>

      <TabPane tab={<FormattedMessage id='matrix'/>} key="2">
        <ProTable<Config, Pagination>
          toolBarRender={() => [<div key="add"> {buildMatrixCreateModal(doMatrixCreate)}</div>]}
          actionRef={matrixTableRef}
          loading={loading}
          columns={columnsMap.matrix}
          request={doMatrixList}
          size="middle"
          rowKey="id"
          search={false}
          pagination={{
            total,
          }}
        />
      </TabPane>
    </Tabs>
  );
};
