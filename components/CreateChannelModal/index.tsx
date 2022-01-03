import React, { useCallback, VFC } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';

interface Props {
  show: boolean;
  setShow: (flag: boolean) => void;
  onCloseModal: () => void;
}

const CreateChannelModal: VFC<Props> = ({ show, setShow, onCloseModal }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(userData ? 
    `http://localhost:3095/api/workspaces/${workspace}/channels` : null, fetcher);

  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');

  const onCreateChannel = useCallback((e) => {
    e.preventDefault();
    if(!newChannel || !newChannel.trim()){
      return;
    }
    toast.configure();
    axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels`, {
      name: newChannel,
    }, {
      withCredentials: true,
    })
    .then((response) => {
      mutateChannel();
      setShow(false);
      setNewChannel('');
    })
    .catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center' });
    })
  },[newChannel, mutateChannel, setNewChannel, setShow, workspace]);

  return (
    <Modal onCloseModal={onCloseModal} >
      <form onSubmit={onCreateChannel}>
        <Label id="channelName">
          <span>Channel</span>
          <Input id="channelName" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;