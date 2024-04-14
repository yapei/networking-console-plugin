import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { modelToGroupVersionKind, modelToRef, RouteModel } from '@kubevirt-ui/kubevirt-api/console';
import {
  ListPageBody,
  ListPageCreateButton,
  ListPageFilter,
  ListPageHeader,
  useK8sWatchResource,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';
import ListEmptyState from '@utils/components/ListEmptyState/ListEmptyState';
import { useNetworkingTranslation } from '@utils/hooks/useNetworkingTranslation';
import { RouteKind } from '@utils/types';
import RouteRow from '@views/routes/list/components/RouteRow';
import useRouteColumns from '@views/routes/list/hooks/useRouteColumns';

type RoutesListProps = {
  namespace: string;
};

const RoutesList: FC<RoutesListProps> = ({ namespace }) => {
  const { t } = useNetworkingTranslation();
  const navigate = useNavigate();

  const [routes, loaded, loadError] = useK8sWatchResource<RouteKind[]>({
    groupVersionKind: modelToGroupVersionKind(RouteModel),
    isList: true,
    namespace,
  });
  const [data, filteredData, onFilterChange] = useListPageFilter(routes);
  const columns = useRouteColumns();
  const title = t('Routes');

  return (
    <ListEmptyState<RouteKind>
      data={routes}
      href="https://docs.openshift.com/dedicated/networking/routes/route-configuration.html"
      kind={RouteModel.kind}
      link="~new"
      loaded={loaded}
      title={title}
    >
      <ListPageHeader title={title}>
        <ListPageCreateButton
          className="list-page-create-button-margin"
          createAccessReview={{
            groupVersionKind: modelToGroupVersionKind(RouteModel),
            namespace,
          }}
          onClick={() =>
            navigate(`/k8s/ns/${namespace || 'default'}/${modelToRef(RouteModel)}/~new/form`)
          }
        >
          {t('Create Route')}
        </ListPageCreateButton>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter data={data} loaded={loaded} onFilterChange={onFilterChange} />
        <VirtualizedTable<RouteKind>
          columns={columns}
          data={filteredData}
          loaded={loaded}
          loadError={loadError}
          Row={RouteRow}
          unfilteredData={data}
        />
      </ListPageBody>
    </ListEmptyState>
  );
};

export default RoutesList;
