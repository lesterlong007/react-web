export default {
    hasResourceBundle: () => true,
};

export const useTranslation = () => ({
  t: key => key,
  i18n: { exists: () => true },
});

export const Trans = ({ i18nKey, children }) => (
  <div>
    <span>{i18nKey}</span>
    <span>{children}</span>
  </div>
);

export const exists = () => true;
