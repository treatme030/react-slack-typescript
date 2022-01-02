import React, { useCallback, VFC } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal: VFC<Props> = ({ onCloseModal }) => {
  const [newChannel, setNewChannel] = useInput('');

  const onCreateChannel = useCallback(() => {},[]);

  return (
    <Modal onCloseModal={onCloseModal} >
      <form onSubmit={onCreateChannel}>
        <Label id="channelName">
          <span>Channel</span>
          <Input id="channelName" value={newChannel} onChange={setNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;