import React, { CSSProperties, FC, useCallback } from 'react';
import { CreateMenu, CloseModalButton } from '@components/Menu/styles';

interface Props {
  onCloseMenu: () => void;
  style: CSSProperties;
}

const Menu: FC<Props> = ({ children, onCloseMenu, style }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  },[]);
  
  return (
    <CreateMenu onClick={onCloseMenu}>
      <div style={style} onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseMenu}>&times;</CloseModalButton>
        { children }
      </div>
    </CreateMenu>
  );
};

export default Menu;