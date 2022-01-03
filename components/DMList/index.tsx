import React, { useCallback, useState } from 'react';
import { CollapseButton } from '@components/DMList/styles';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import EachDM from '@components/EachDM';

const DMList = () => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { data: memberData } = useSWR<IUserWithOnline[]>( userData ? 
    `/api/workspaces/${workspace}/members` : null, fetcher);
  
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

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
        <span>Direct Message</span>
      </h2>
      <div>
        {!channelCollapse && (
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return <EachDM key={member.id} member={member} isOnline={isOnline}/>
          })
        )}
      </div>
    </>
  );
};

export default DMList;