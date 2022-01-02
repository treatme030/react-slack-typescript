import React, { FC, useCallback, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Redirect, Switch, Route, Link } from 'react-router-dom';
import { IUser } from '@typings/db';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
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
  const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

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

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(!showCreateWorkspaceModal);
  },[showCreateWorkspaceModal]);

  const onCreateWorkspace = useCallback((e) => {
    e.preventDefault();
  },[]);

  if(!userData){
    return <Redirect to="/login" />
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg 
            src={grvatar.url(userData.nickname, { s: '28px', d: 'retro' })} 
            alt={userData.nickname} 
            />
            {showUserMenu && (
            <Menu 
            style={{ right: '0', top: '38px' }}
            onCloseMenu={onClickUserProfile}
            >
              <ProfileModal>
                <img src={grvatar.url(userData.nickname, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                <div>
                  <span id="profile-name">{userData.nickname}</span>
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
        <Workspaces>
          {userData?.Workspaces.map((workspace) => {
            return (
              <Link key={workspace.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{workspace.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            )
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
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
      {showCreateWorkspaceModal && (
        <Modal onCloseModal={onClickCreateWorkspace} >
          <form onSubmit={onCreateWorkspace}>
            <Label id="workspaceName">
              <span>workspace name</span>
              <Input id="workspaceName" value={newWorkspace} onChange={onChangeNewWorkspace} />
            </Label>
            <Label id="workspaceUrl">
              <span>workspace url</span>
              <Input id="workspaceUrl" value={newUrl} onChange={onChangeNewUrl} />
            </Label>
            <Button type="submit">생성하기</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Workspace;