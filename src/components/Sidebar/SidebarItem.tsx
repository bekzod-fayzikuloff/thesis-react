import { Link } from 'react-router-dom';
import style from './Sidebar.module.scss';

type SidebarLinkProps = {
  toLink: string;
  toRepr: string;
  className?: string;
  onClick?: () => void;
};

export function SidebarItem(props: SidebarLinkProps) {
  return (
    <div className={`${style.side__item} ${props.className}`} onClick={props.onClick}>
      <Link style={{ height: '30px' }} to={props.toLink}>
        {props.toRepr}
      </Link>
    </div>
  );
}
