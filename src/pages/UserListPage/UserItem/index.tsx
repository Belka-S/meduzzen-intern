import { FC, MouseEvent } from 'react';
import classNames from 'classnames';
import ProfileBtn from 'components/ProfileBtn';
import Button from 'components/ui/Button';
import SvgIcon from 'components/ui/SvgIcon';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TUserOfList, useAppDispatch } from 'store';
import { useAppExtraDispatch } from 'store';
import { logout } from 'store/auth';
import { checkUser, cleanOwner, deleteUserThunk } from 'store/user';
import { editUser, uncheckUser } from 'store/user';
import { trimName } from 'utils/helpers';
import { useCompany, useUser } from 'utils/hooks';

import s from './index.module.scss';

type TUserProps = {
  props: TUserOfList;
};

const UserItem: FC<TUserProps> = ({ props }) => {
  const { user_id, user_email, user_avatar } = props;
  const { user_firstname, user_lastname, action } = props;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const dispatchExtra = useAppExtraDispatch();
  const { user, owner, checkedUsers } = useUser();
  const { company, select } = useCompany();

  if (!user_id) return;
  const isChecked = checkedUsers.some(el => el.user_id === user_id);
  const isMyAccount = owner?.user_id === user_id;
  const isActive = user_id === user?.user_id;
  const isOwner =
    select === 'member' && pathname.includes('/company/')
      ? user_id === company?.company_owner?.user_id
      : user_id === owner?.user_id;
  const isAdmin = action === 'admin';
  const isLastName = user_firstname !== user_lastname;
  const name = `${user_firstname} ${user_lastname}`;
  const ava = { id: user_id, url: user_avatar, name };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.blur();
    if (!owner?.is_superuser) {
      if (!isMyAccount) {
        toast.error("It's not your account");
        return;
      }
    }
    if (!confirm(`Are you sure you want to delete: ${user_email}`)) return;
    dispatch(cleanOwner());
    dispatch(logout());
    if (user_id) {
      const { payload } = await dispatchExtra(deleteUserThunk({ user_id }));
      toast.success(payload.detail);
      navigate('/cluster', { replace: true });
    }
  };

  const handleUpdateInfo = (e: MouseEvent<HTMLButtonElement>) => {
    if (!owner?.is_superuser) {
      if (!isMyAccount) {
        e.preventDefault();
        toast.error("It's not your account");
        return;
      }
    }
    e.currentTarget.blur();
    dispatch(editUser('data'));
  };

  const handleCheck = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(checkUser(props));
  };

  const handleUncheck = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(uncheckUser({ user_id }));
  };

  return (
    <NavLink
      to={`/cluster/${user_id}`}
      id={isActive ? 'active-user' : ''}
      className={classNames(
        s.item,
        s.hover,
        isActive && s.active,
        isOwner && s.owner,
      )}
    >
      <ProfileBtn className={s.avatar} ava={ava} />
      {isAdmin && <SvgIcon className={s.admin} svgId="ui-gear" size={24} />}

      <span>{user_email}</span>
      <span>{trimName(user_firstname ?? '')}</span>
      <span>{isLastName && trimName(user_lastname ?? '')}</span>

      <Button
        className={s.button}
        variant="round"
        color="transparent"
        onClick={handleUpdateInfo}
      >
        <SvgIcon className={s.icon_svg} svgId="ui-edit" />
      </Button>

      <Button
        className={s.button}
        variant="round"
        color="transparent"
        onClick={handleDelete}
      >
        <SvgIcon className={s.icon_svg} svgId="ui-trash" />
      </Button>

      {!isChecked && (
        <Button
          className={s.button}
          variant="round"
          color="transparent"
          onClick={handleCheck}
        >
          <SvgIcon className={s.icon_svg} svgId="ui-uncheck" />
        </Button>
      )}

      {isChecked && (
        <Button
          className={s.button}
          variant="round"
          color="transparent"
          onClick={handleUncheck}
        >
          <SvgIcon className={s.icon_svg__shown} svgId="ui-check" />
        </Button>
      )}

      <span>{user_id}</span>
    </NavLink>
  );
};

export default UserItem;
