import React, { useCallback, useState, VFC } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  setShow: (flag: boolean) => void;
  onCloseModal: () => void;
}

const InviteWorkspaceModal: VFC<Props> = ({ onCloseModal, setShow }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher);
  const { mutate } = useSWR<IUser[]>(userData ? 
    `/api/workspaces/${workspace}/members` : null, fetcher);

  const [newMember, onChangeNewMember, setNewMember] = useInput('')

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if(!newMember || !newMember.trim()){
      return;
    }
    toast.configure();
    axios.post(`/api/workspaces/${workspace}/members`, {
      email: newMember,
    })
    .then((response) => {
      mutate();
      setShow(false);
      setNewMember('');
    })
    .catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center' });
    })
  },[newMember, workspace, setShow, setNewMember, mutate]);

  return (
    <Modal onCloseModal={onCloseModal} >
      <form onSubmit={onInviteMember}>
        <Label id="member">
          <span>Email</span>
          <Input 
          id="member" 
          type="email" 
          value={newMember} 
          onChange={onChangeNewMember} 
          />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;