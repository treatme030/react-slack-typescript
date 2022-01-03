import React, { VFC, useCallback, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Redirect, Switch, Route, Link, useParams } from 'react-router-dom';
import { IChannel, IUser } from '@typings/db';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import CreateChannelModal from '@components/CreateChannelModal';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: VFC = () => {
  const { workspace } = useParams<{ workspace: string }>();

  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel[]>(userData ? 
    `/api/workspaces/${workspace}/channels` : null, fetcher);
  const { mutate: memberData } = useSWR<IUser[]>(userData ? 
    `/api/workspaces/${workspace}/members` : null, fetcher);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showSleactMenu, setShowSleactMenu] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null)
    .then((response) => {
      mutate(false);
    })
    .catch((error) => {})
  },[]);

  const onCreateWorkspace = useCallback((e) => {
    e.preventDefault();
    if(!newWorkspace || !newWorkspace.trim()){
      return;
    }
    if(!newUrl || !newUrl.trim()){
      return;
    }
    toast.configure();
    axios.post('/api/workspaces', {
      workspace: newWorkspace,
      url: newUrl,
    })
    .then((response) => {
      mutate();
      setNewWorkspace('');
      setNewUrl('');
    })
    .catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center' });
    });
  },[newWorkspace, newUrl]);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu(!showUserMenu);
  },[showUserMenu]);

  const onClickCreateWorkspaceModal = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  },[]);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteMemberModal(false);
    setShowInviteChannelModal(false);
  },[]);

  const onClickWorkspaceSleact = useCallback(() => {
    setShowSleactMenu(!showSleactMenu);
  },[showSleactMenu]);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
  },[]);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteMemberModal(true);
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
          <AddButton onClick={onClickCreateWorkspaceModal}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName onClick={onClickWorkspaceSleact}>Sleact</WorkspaceName>
          <MenuScroll>
            {showSleactMenu && (
            <Menu 
            onCloseMenu={onClickWorkspaceSleact} 
            style={{ top: '95px', left: '80px' }}
            >
              <WorkspaceModal>
                <h2>Sleact</h2>
                <button onClick={onClickInviteWorkspace}>워크스페이스 사용자 초대</button>
                <button onClick={onClickAddChannel}>채널 만들기</button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            )}
            <ChannelList />
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/:workspace/channel/:channel" exact component={Channel} />
            <Route path="/workspace/:workspace/dm/:id" exact component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      {showCreateWorkspaceModal && (
        <Modal onCloseModal={onCloseModal} >
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
      {showCreateChannelModal && (
        <CreateChannelModal 
        show={showCreateChannelModal}
        setShow={setShowCreateChannelModal}
        onCloseModal={onCloseModal}
        />
      )}
      {showInviteMemberModal && (
        <InviteWorkspaceModal
        setShow={setShowInviteMemberModal} 
        onCloseModal={onCloseModal}
        />
      )}
      {showInviteChannelModal && (
        <InviteChannelModal
        setShow={setShowInviteChannelModal} 
        onCloseModal={onCloseModal}
        />
      )}
    </div>
  );
};

export default Workspace;