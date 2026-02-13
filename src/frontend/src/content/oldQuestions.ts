interface OldQuestionItem {
  id: string;
  title: string;
  urls?: string[];
  comingSoon?: boolean;
}

export const oldQuestionsData = {
  firstPaper: [
    { id: 'first-2083', title: '2083', comingSoon: true },
    { id: 'first-2082', title: '2082', comingSoon: true },
    { id: 'first-2081', title: '2081', comingSoon: true },
    { id: 'first-2080', title: '2080', comingSoon: true },
    { id: 'first-2079', title: '2079', comingSoon: true },
    { id: 'first-2078', title: '2078' },
  ] as OldQuestionItem[],
  secondPaper: [
    { id: 'second-2083', title: '2083', comingSoon: true },
    {
      id: 'second-2082',
      title: '2082',
      urls: ['https://drive.google.com/drive/folders/1I4cxkDQfRQcX6qDu7fSvUUcpP10eoDmO'],
    },
    {
      id: 'second-2081',
      title: '2081',
      urls: ['https://drive.google.com/drive/folders/1C15G19rpDDp4cNq6Vd9WGOCN3GhJ5R4W'],
    },
    {
      id: 'second-2080',
      title: '2080',
      urls: ['https://drive.google.com/drive/folders/1YKN55VC7-9GFyQtX_zBNDGZABKQtMzb1'],
    },
    {
      id: 'second-2079',
      title: '2079',
      urls: ['https://drive.google.com/file/d/1e18I0XTmjhs5fBhtKOQa6-twlsou4R6y/view?usp=drivesdk'],
    },
    {
      id: 'second-2078',
      title: '2078',
      urls: ['https://drive.google.com/file/d/13cNunKT8472-u04k2q6Rbdarm2M4ORZ8/view?usp=drivesdk'],
    },
    {
      id: 'second-province',
      title: 'Pradesh',
      urls: ['https://drive.google.com/file/d/1xMZZ8mbkCT0PxXr0Z_D4-sQxFGYk1wYA/view?usp=drivesdk'],
    },
  ] as OldQuestionItem[],
  thirdPaper: [
    { id: 'third-2083', title: '2083', comingSoon: true },
    {
      id: 'third-2082',
      title: '2082',
      urls: ['https://drive.google.com/drive/folders/1bh-xa3pXc1PWg51LswAUQHOBYep60g_x'],
    },
    {
      id: 'third-2081',
      title: '2081',
      urls: ['https://drive.google.com/drive/folders/1j2poUbcOIDDpucOeXFtxjv1gZrkCMRjY'],
    },
    {
      id: 'third-2080',
      title: '2080',
      urls: ['https://drive.google.com/file/d/1bNSqDLlKBRuEiYBj9JCz12fAtOmNTEkq/view?usp=drivesdk'],
    },
    {
      id: 'third-2079',
      title: '2079',
      urls: ['https://drive.google.com/file/d/1xdb4MTv7gRAErDtk2xu31hZL-5lg5H4q/view?usp=drivesdk'],
    },
    {
      id: 'third-2078',
      title: '2078',
      urls: ['https://drive.google.com/drive/folders/1YKz61eI_FifL4Z5jKtT1unnuGp05H-WX'],
    },
    {
      id: 'third-province',
      title: 'Pradesh',
      urls: ['https://drive.google.com/file/d/1CjRCiKvTi3ufOCBFLnFNMzDK25_cudow/view?usp=drivesdk'],
    },
  ] as OldQuestionItem[],
};
