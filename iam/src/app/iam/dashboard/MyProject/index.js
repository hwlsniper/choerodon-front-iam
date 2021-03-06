import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { Action, DashBoardNavBar } from 'choerodon-front-boot';
import { Table } from 'choerodon-ui';
import ProjectInfoStore from '../../stores/user/project-info';
import './index.scss';

const intlPrefix = 'dashboard.myproject';

@withRouter
@inject('AppState', 'HeaderStore')
@observer
export default class MyProject extends Component {
  orgId = null;

  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    const nextOrgId = this.getOrgId(nextProps);
    if (nextOrgId !== this.orgId) {
      this.loadData(nextOrgId);
    }
  }

  getOrgId(props = this.props) {
    const { AppState: { currentMenuType: { id: orgId, organizationId } } } = props;
    return organizationId || orgId;
  }

  loadData = (orgId = this.getOrgId()) => {
    this.orgId = orgId;
    ProjectInfoStore.loadMyProjects(orgId);
  };

  handleRowClick({ id, organizationId, name }) {
    const { history } = this.props;
    history.push(`/?type=project&id=${id}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`);
  }

  handleRow = record => ({
    onClick: this.handleRowClick.bind(this, record),
  });

  getTableColumns() {
    return [{
      title: <FormattedMessage id={`${intlPrefix}.name`} />,
      dataIndex: 'name',
      key: 'name',
    }, {
      title: <FormattedMessage id={`${intlPrefix}.code`} />,
      dataIndex: 'code',
      key: 'code',
    }];
  }

  render() {
    const { myProjectData, loading } = ProjectInfoStore;
    return (
      <div className="c7n-iam-dashboard-my-project">
        <section>
          <Table
            loading={loading}
            columns={this.getTableColumns()}
            dataSource={myProjectData.slice()}
            filterBar={false}
            pagination={false}
            rowKey="code"
            onRow={this.handleRow}
            empty={(<FormattedMessage id={`${intlPrefix}.no-project`} />)}
          />
        </section>
        <DashBoardNavBar>
          <Link to="/iam/project-info?type=site"><FormattedMessage id={`${intlPrefix}.redirect`} /></Link>
        </DashBoardNavBar>
      </div>
    );
  }
}
