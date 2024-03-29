import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import Button from 'components/ui/Button';
import SvgIcon from 'components/ui/SvgIcon';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppExtraDispatch } from 'store';
import { editCompany } from 'store/company';
import { updateAvatarPreview, updateAvatarThunk } from 'store/company';
import { getAbbreviation, getRandomColor } from 'utils/helpers';
import { getRandomNumber } from 'utils/helpers/getRandomNumber';
import { useCompany } from 'utils/hooks';
import { avatarSchema } from 'utils/validation';
import { InferType, ValidationError } from 'yup';

import s from './index.module.scss';

type TInput = InferType<typeof avatarSchema>;

const AvatarForm = () => {
  const dispatch = useAppDispatch();
  const dispatchExtra = useAppExtraDispatch();
  const { company } = useCompany();

  const [avatarError, setAvatarError] = useState('');
  const [activeIcon, setActiveIcon] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { touchedFields },
  } = useForm<TInput>({ mode: 'onChange' });

  // avatar file, preview image
  const setAvatar = async (e: Event | ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const avatar = (target.files as FileList)[0];
    const company_avatar = URL.createObjectURL(avatar);
    dispatch(updateAvatarPreview({ company_avatar }));
    try {
      await avatarSchema.validate({ file: avatar }, { abortEarly: false });
      setAvatarError('noError');
    } catch (err) {
      if (err instanceof ValidationError) {
        const msg = err.inner[0].message;
        toast.error(msg);
        setAvatarError(msg);
      }
      return err;
    }
  };

  // profile button styles
  const btnId = `profile-${getRandomNumber(12)}`;
  const color = getRandomColor(60);

  useEffect(() => {
    if (company?.company_avatar) {
      // document.styleSheets[0].deleteRule(0);
      document.styleSheets[0].insertRule(
        `#${btnId} {background-image: url(${company?.company_avatar})}`,
        0,
      );
    } else if (company?.company_name) {
      const abbr = getAbbreviation(company?.company_name);
      document.styleSheets[0].insertRule(
        `#${btnId}::after { background-color: ${color}; color: #ffffff; content: '${abbr}'}`,
      );
    }
  }, [btnId, color, company]);

  const onSubmit: SubmitHandler<TInput> = async data => {
    console.log('data: ', data);
    const formData = new FormData();
    const file = (data.file as FileList)[0];
    formData.append('file', file);

    for (const [key, value] of formData) {
      console.log(`${key}: ${value}`);
    }

    dispatchExtra(updateAvatarThunk(formData))
      .unwrap()
      .then(() => document.location.reload())
      .finally(() => dispatch(editCompany(false)));
  };

  // input validation
  const errorMessage = avatarError === 'noError' ? '' : avatarError;
  const isDisabled = errorMessage || Object.keys(touchedFields).length === 0;

  const onMouseOver = () => setActiveIcon(true);
  const onMouseOut = (e: MouseEvent<HTMLInputElement>) => {
    setActiveIcon(false);
    e.currentTarget.blur();
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <label>
        <span className={s.error}>{errorMessage}</span>

        <Controller
          control={control}
          name="file"
          render={({ field: { onChange } }) => (
            <input
              id={`${btnId}`}
              className={classNames(
                s.avatar,
                avatarError && s.border__error,
                avatarError === 'noError' && s.border__success,
              )}
              type="file"
              accept="image/*"
              {...register('file', { required: true })}
              onChange={e => {
                setAvatar(e);
                if (e.target.files) {
                  return onChange(e.target.files[0]);
                }
              }}
              onMouseOut={onMouseOut}
              onMouseOver={onMouseOver}
            />
          )}
        />

        {avatarError && avatarError !== 'noError' && (
          <SvgIcon
            className={classNames(s.validation, s.exclamation)}
            svgId="ui-exclamation"
            size={24}
          />
        )}
        {avatarError === 'noError' && (
          <SvgIcon
            className={classNames(s.validation, s.check)}
            svgId="ui-check"
            size={24}
          />
        )}
        {activeIcon && (
          <SvgIcon
            className={classNames(s.validation, s.plus)}
            svgId="ui-plus"
            size={24}
          />
        )}
      </label>

      {Object.keys(touchedFields).length > 0 && (
        <Button
          className={s.button}
          type="submit"
          color={isDisabled ? 'disabled' : 'outlined'}
          variant="smooth"
          label="Submit"
          onClick={e => e.currentTarget.blur()}
        />
      )}
    </form>
  );
};

export default AvatarForm;