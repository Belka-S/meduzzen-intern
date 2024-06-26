import { MouseEvent, useState } from 'react';
import classNames from 'classnames';
import Button from 'components/ui/Button';
import Section from 'components/ui/Section';
import H1 from 'components/ui/Typography/H1';
import H4 from 'components/ui/Typography/H4';
import { useAppExtraDispatch } from 'store';
import { getMeThunk } from 'store/user';

import s from './index.module.scss';

const AboutPage = () => {
  const dispatch = useAppExtraDispatch();
  const [email, setEmail] = useState('?');

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    dispatch(getMeThunk())
      .unwrap()
      .then(res => setEmail(res.result.user_email))
      .catch(err => console.log(err));

    e.currentTarget.blur();
  };

  return (
    <Section className={classNames('container', s.screen)}>
      <H1>About Page</H1>
      <H4 className={s.info}>{`Email: ${email}`}</H4>

      <Button
        variant="smooth"
        color="outlined"
        label="Get me"
        onClick={handleClick}
      />
    </Section>
  );
};

export default AboutPage;
