module.exports = {
  LBU_LIST: [
    {
      name: 'Thailand',
      value: {
        location: 'th',
        tags: ['thailand', 'new_project'],
        language: 'en_TH',
        toString() {
          return 'PLT';
        }
      }
    },
    {
      name: 'Malaysia(PAMB)',
      value: {
        location: 'my_pamb',
        tags: ['malaysia', 'new_project'],
        language: 'en_MY',
        toString() {
          return 'PAMB';
        }
      }
    },
    {
      name: 'Macao',
      value: {
        location: 'mo',
        tags: ['macao', 'new_project'],
        language: 'en_MO',
        toString() {
          return 'PHKLMB';
        }
      }
    },
    {
      name: 'Philippines',
      value: {
        location: 'ph',
        tags: ['philippines', 'new_project'],
        language: 'en_PH',
        toString() {
          return 'PLUK';
        }
      }
    },
    {
      name: 'Indonesia',
      value: {
        location: 'id',
        tags: ['indonesia', 'new_project'],
        language: 'en_ID',
        toString() {
          return 'PLAI';
        }
      }
    },
    {
      name: 'Malaysia(PBTB)',
      value: {
        location: 'my_pbtb',
        tags: ['malaysia', 'new_project'],
        language: 'en_MY',
        toString() {
          return 'PBTB';
        }
      }
    },
    {
      name: 'Vietnam',
      value: {
        location: 'vn',
        tags: ['vietnam', 'new_project'],
        language: 'en_VN',
        toString() {
          return 'PVA';
        }
      }
    },
    {
      name: 'Cambodia',
      value: {
        location: 'kh',
        tags: ['cambodia', 'new_project'],
        language: 'en_KH',
        toString() {
          return 'PCLA';
        }
      }
    },
    {
      name: 'Hongkong',
      value: {
        location: 'hk',
        tags: ['hongkong', 'new_project'],
        language: 'en_HK',
        toString() {
          return 'PHKL';
        }
      }
    }
  ],

  requestOptions: (location) => {
    return {
      fetchUrl: `https://api.lokalise.com/api2/projects/40690750626607e707c248.55327219:${location}_default/files/download`,
      params: {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-Api-Token': 'e7077519a71318a3fa837b0153c709c85294bf26'
        },
        body: JSON.stringify({
          include_tags: ['new_project'],
          format: 'json',
          indentation: '2sp',
          original_filenames: true,
          export_sort: 'a_z',
          export_empty_as: 'skip',
          replace_breaks: false,
          json_unescaped_slashes: true,
          directory_prefix: location.toUpperCase()
        })
      }
    };
  },

  mutationOptions: (location, option) => {
    return {
      fetchUrl: `https://api.lokalise.com/api2/projects/40690750626607e707c248.55327219:${location}_default/files/upload`,
      params: {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'X-Api-Token': 'e7077519a71318a3fa837b0153c709c85294bf26'
        },
        body: JSON.stringify({
          tags: option.tags || [],
          filename: '%LANG_ISO%.json',
          lang_iso: option.language,
          slashn_to_linebreak: true,
          cleanup_mode: option.cleanup,
          replace_modified: false,
          format: 'json',
          convert_placeholders: false,
          data: option.fileBase64,
          tag_skipped_keys: true,
          tag_updated_keys: true,
          tag_inserted_keys: true
        })
      }
    };
  }
};
