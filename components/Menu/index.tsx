import React, { CSSProperties, FC, useCallback } from 'react';
import { CreateMenu, CloseModalButton } from '@components/Menu/styles';

interface Props {
  show: boolean;
  onCloseMenu: () => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({ children, onCloseMenu, show, style, closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  },[]);
  
  return (
    <CreateMenu onClick={onCloseMenu}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseMenu}>&times;</CloseModalButton>}
        { children }
      </div>
    </CreateMenu>
  );
};

Menu.defaultProps = {
  closeButton: true,
};

export default Menu;