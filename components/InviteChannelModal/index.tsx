import React, { useCallback, VFC } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

interface Props {
  setShow: (flag: boolean) => void;
  onCloseModal: () => void;
}

const InviteChannelModal: VFC<Props> = ({ setShow, onCloseModal }) => {
  const { workspace, channel } = useParams<{ workspace: string, channel: string }>();
  const { data: userData } = useSWR<IUser>('http://localhost:3095/api/users', fetcher);
  const { mutate } = useSWR<IUser[]>(userData ? 
    `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members` : null, fetcher);

  const [newMember, onChangeNewMember, setNewMember] = useInput('')

  const onInviteMember = useCallback((e) => {
    e.preventDefault();
    if(!newMember || !newMember.trim()){
      return;
    }
    toast.configure();
    axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/members`, {
      email: newMember,
    }, {
      withCredentials: true,
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
  },[newMember, workspace, channel, setShow, setNewMember, mutate]);

  return (
    <Modal onCloseModal={onCloseModal} >
    <form onSubmit={onInviteMember}>
      <Label id="member">
        <span>채널 멤버 초대</span>
        <Input 
        id="member" 
        value={newMember} 
        onChange={onChangeNewMember} 
        />
      </Label>
      <Button type="submit">초대하기</Button>
    </form>
  </Modal>

  );
};

export default InviteChannelModal;