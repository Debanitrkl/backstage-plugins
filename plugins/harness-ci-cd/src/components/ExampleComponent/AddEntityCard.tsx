import React from 'react';
import { EntityCard } from '@backstage/core';
import { useProjectSlugFromEntity } from './useProjectSlugFromEntity';
import { AsyncStatus } from './AsyncStatus';

export const EntityCard = () => {
  const { projectId, orgId, accountId, pipelineId, serviceId, urlParams } = useProjectSlugFromEntity();
  const [state, setState] = React.useState(AsyncStatus.Init);

  React.useEffect(() => {
    async function fetchData() {
      setState(AsyncStatus.Loading);
      const response = await fetch(
        `${await backendBaseUrl}/harness/gateway/pipeline/api/pipelines/execution/${projectId}/inputset?moduleType=ci`,
        {}
      );
      if (state === AsyncStatus.Init || state === AsyncStatus.Loading) {
        if (response.status === 200) setState(AsyncStatus.Success);
        else if (response.status === 401) setState(AsyncStatus.Unauthorized);
        else setState(AsyncStatus.Error);
      }
    }
    fetchData();
  }, []);

  return (
    <EntitiesCard
      title={`Project: ${projectId}`}
      description={`Organization: ${orgId} | Account: ${accountId}`}
      details={`Pipeline ID: ${pipelineId} | Service ID: ${serviceId}`}
      status={state}
      link={`${urlParams}`}
    />
  );
};
