import { useAppSelector } from 'store';
import * as selectors from 'store/company/companySelectors';

export const useCompany = () => {
  const company = useAppSelector(selectors.selectCompany);
  const companyList = useAppSelector(selectors.selectCompanyList);
  const pagination = useAppSelector(selectors.selectPagination);
  const select = useAppSelector(selectors.selectSelect);
  const checkedCompanies = useAppSelector(selectors.selectChecked);
  const appendix = useAppSelector(selectors.selectAppendix);
  const edit = useAppSelector(selectors.selectEdit);

  const owner = useAppSelector(selectors.selectCompanyOwner);
  const title = useAppSelector(selectors.selectCompanyTitle);
  const city = useAppSelector(selectors.selectCompanyCity);
  const phone = useAppSelector(selectors.selectCompanyPhone);
  const description = useAppSelector(selectors.selectCompanyDescription);
  const profileInfo = { owner, title, city, phone, description };
  const loading = useAppSelector(selectors.selectLoading);
  const error = useAppSelector(selectors.selectError);

  return {
    company,
    profileInfo,
    companyList,
    pagination,
    select,
    checkedCompanies,
    appendix,
    edit,

    loading,
    error,
  };
};
