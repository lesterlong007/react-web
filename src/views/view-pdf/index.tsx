import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PdfViewer, Button, Icon } from '@common/components';
import { useToast } from '@common/components/toast/toast';
import { useAlert } from '@common/components/alert/alert';
import { getUrlParams } from '@common/hooks/navigation';

const ViewPDF: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { showAlert } = useAlert();
  const { download, url = '' } = getUrlParams();

  // const downloadPDFbyContent = () => {
  //   if (/^https?:/.test(content) || content?.startsWith('/')) {
  //     downloadPDF(content, fileName);
  //   } else {
  //     downloadBase64PDF(content, fileName);
  //   }
  // };

  return (
    <>
      <PdfViewer
        content={url}
        onLoadSuccess={() => setLoaded(true)}
        onOpenEncryptedPDF={() => setIsEncrypted(true)}
        className={loaded ? 'mb-72px' : ''}
      />
      {loaded && download && (
        <div className="flex justify-center fixed left-0 bottom-0 w-full h-72px items-center tablet:(bg-white shadow-upwards)">
          <Button
            className="w-132px"
            labelClass="flex items-center"
            type="secondary"
            size="regular"
            onClick={() => {
              showToast?.(t('common.download_pdf'), { type: 'success' });
              if (isEncrypted) {
                // downloadPDFbyContent();
              } else {
                // setShowAlert(true);
              }
            }}
          >
            <Icon name="download" size={20} className="mr-4" />
            {t('document_detail.download')}
          </Button>
        </div>
      )}
    </>
  );
};

export default ViewPDF;
