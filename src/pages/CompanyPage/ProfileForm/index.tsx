import { useEffect } from 'react';
import InputRhf from 'components/InputRhf';
import Button from 'components/ui/Button';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppExtraDispatch } from 'store';
import { editCompany, getCompanyThunk, updateInfoThunk } from 'store/company';
import { useCompany } from 'utils/hooks';
import { companyProfileSchema } from 'utils/validation';
import { InferType } from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';

import s from './index.module.scss';

type TInput = InferType<typeof companyProfileSchema>;

const inputFields = Object.keys(companyProfileSchema.fields) as Array<
  keyof TInput
>;

const ProfileForm = () => {
  const dispatch = useAppDispatch();
  const dispatchExtra = useAppExtraDispatch();
  const { id } = useParams();
  const { company } = useCompany();

  // all link inputs
  const allLinks = inputFields.filter(el => el.includes('link'));

  // hidden link inputs
  let hiddenLinks = allLinks
    .map((el, i) => {
      if (company?.company_links && !company.company_links[i]) return el;
    })
    .filter(el => el && el)
    .slice(1);

  hiddenLinks =
    hiddenLinks.length > 0
      ? hiddenLinks
      : inputFields.filter(el => el.includes('_link'));

  // initial link inputs
  const initialLinks = allLinks.reduce((acc, el, i) => {
    if (company?.company_links && company?.company_links[i]) {
      return { ...acc, [el]: company?.company_links[i] };
    } else return acc;
  }, {});

  const resolver: Resolver<TInput> = yupResolver(companyProfileSchema);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<TInput>({
    resolver,
    mode: 'onChange',
    defaultValues: { ...company, ...initialLinks },
  });

  // automaticly open new link input
  inputFields.map(el => watch(el));

  // show / hide inputs
  useEffect(() => {
    const linkElObj = inputFields
      .filter(el => el.includes('link'))
      .map(el => {
        const inputEl = document.querySelector(`input[name="${el}"]`);
        const labelEl = inputEl?.closest('label');
        return {
          input: inputEl as HTMLInputElement,
          label: labelEl as HTMLLabelElement,
        };
      });

    if (linkElObj && linkElObj[0].input) {
      for (let i = 0; i < linkElObj.length - 1; i += 1) {
        if (linkElObj[i].input.value) {
          linkElObj[i + 1].label.style.display = 'block';
        } else {
          linkElObj[i + 1].label.style.display = 'none';
        }
      }
    }
  }, [initialLinks]);

  const onSubmit: SubmitHandler<TInput> = data => {
    const company_id = Number(id);
    const company_links = allLinks.map(el => data[el]).filter(el => el && el);

    dispatchExtra(updateInfoThunk({ company_id, ...data, company_links }))
      .then(res => toast.success(res.payload.detail))
      .then(() => dispatchExtra(getCompanyThunk(Number(id))))
      .finally(() => dispatch(editCompany(false)));
  };

  const isDisabled = !isValid || Object.keys(touchedFields).length === 0;

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      {inputFields.map(el => (
        <InputRhf
          key={el}
          style={{ display: hiddenLinks.includes(el) ? 'none' : 'block' }}
          inputName={el}
          errors={errors}
          watch={watch}
          register={register}
        />
      ))}

      <Button
        type="submit"
        color={isDisabled ? 'disabled' : 'outlined'}
        variant="smooth"
        label="Submit"
        onClick={e => e.currentTarget.blur()}
        onMouseOver={e => e.currentTarget.focus()}
      />
    </form>
  );
};

export default ProfileForm;
