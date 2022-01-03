import Channel from '@pages/Channel';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect, VFC } from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import useSWR from 'swr';

interface Props {
  channel: IChannel;
}

const EachChannel: VFC<Props> = ({ channel }) => {
  const { workspace } = useParams<{ workspace: string}>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const date = localStorage.getItem(`${workspace}-${channel.name}`) || 0;
  const { data: count, mutate } = useSWR<number>(userData ? 
    `/api/workspaces/${workspace}/channels/${channel.name}/unreads?after=${date}` :
    null, fetcher);
  const location = useLocation();

  useEffect(() => {
    if(location.pathname === `/workspaces/${workspace}/channels/${channel.name}`){
      mutate(0);
    }
  },[mutate, location.pathname, workspace, channel]);

  return (
    <NavLink 
    key={channel.name}
    to={`/workspaces/${workspace}/channel/${channel.name}`} 
    activeClassName="selected"
    >
      <span className={count !== undefined && count > 0 ? 'bold' : undefined}># {channel.name}</span>
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLink>
  );
};

export default EachChannel;