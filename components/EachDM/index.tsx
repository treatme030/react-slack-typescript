import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect, VFC } from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import useSWR from 'swr';

interface Props {
  member: IUser;
  isOnline: boolean;
}

const EachDM: VFC<Props> = ({ member, isOnline }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;
  const { data: count, mutate } = useSWR<number>(userData ? 
    `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` :
    null, fetcher);
  const location = useLocation();

  useEffect(() => {
    if(location.pathname === `/workspaces/${workspace}/dms/${member.id}`){
      mutate(0);
    }
  },[mutate, location.pathname, member, workspace]);

  return (
    <NavLink 
    key={member.id}
    to={`/workspaces/${workspace}/dm/${member.id}`} 
    activeClassName="selected"
    >
      <i
      className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
        isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
      }`}
      aria-hidden="true"
      data-qa="presence_indicator"
      data-qa-presence-self="false"
      data-qa-presence-active="false"
      data-qa-presence-dnd="false"
      />
      <span className={count !== undefined && count > 0 ? 'bold' : undefined}>{member.nickname}</span> 
      {member.id === userData?.id && <span>(나)</span>} 
      {(count && count > 0 && <span className="count">{count}</span>) || null}
    </NavLink>
  );
};

export default EachDM;