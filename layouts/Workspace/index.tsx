import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Redirect, Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import grvatar from 'gravatar';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);


  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,
    })
    .then((response) => {
      mutate(false);
    })
    .catch((error) => {})
  },[]);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu(!showUserMenu);
  },[showUserMenu]);

  if(!data){
    return <Redirect to="/login" />
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg 
            src={grvatar.url(data.nickname, { s: '28px', d: 'retro' })} 
            alt={data.nickname} 
            />
            {showUserMenu && (
            <Menu 
            style={{ right: '0', top: '38px' }}
            onCloseMenu={onClickUserProfile}
            show={showUserMenu}
            >
              <ProfileModal>
                <img src={grvatar.url(data.nickname, { s: '28px', d: 'retro' })} alt={data.nickname} />
                <div>
                  <span id="profile-name">{data.nickname}</span>
                  <span id="profile-active">Active</span>
                </div>
              </ProfileModal>
              <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
            </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menuscroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" exact component={Channel} />
            <Route path="/workspace/dm" exact component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      { children }
    </div>
  );
};

export default Workspace;