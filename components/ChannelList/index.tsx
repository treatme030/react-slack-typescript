import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState, VFC } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { CollapseButton } from '@components/DMList/styles';
import EachChannel from '@components/EachChannel';

const ChannelList = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel[]>(userData ? 
    `/api/workspaces/${workspace}/channels` : null, fetcher);

  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse(!channelCollapse);
  },[channelCollapse]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
          className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
          data-qa="channel-section-collapse"
          aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2> 
      <div>
        {!channelCollapse && (
          channelData?.map((channel) => {
            return (
              <EachChannel key={channel.id} channel={channel} />
            )
          })
        )}
      </div>
    </>
  );
};

export default ChannelList;