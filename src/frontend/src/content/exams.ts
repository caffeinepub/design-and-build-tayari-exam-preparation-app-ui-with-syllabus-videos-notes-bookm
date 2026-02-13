interface ExamSet {
  id: string;
  title: string;
  urls: string[];
  duration: number;
  comingSoon?: boolean;
}

export const examSets: ExamSet[] = [
  {
    id: 'first-paper',
    title: 'पहिलो पेपर मक परीक्षा',
    urls: [],
    duration: 45,
    comingSoon: true,
  },
  {
    id: 'second-paper',
    title: 'दोस्रो पेपर मक परीक्षा',
    urls: [
      'https://drive.google.com/file/d/1SBsaBSjf0DlCBja7yiN_I1rtp6Oirm-b/view?usp=drivesdk',
      'https://drive.google.com/file/d/1vx2KMInBjqEOO17Axm54Rr7_5B2jCgyB/view?u',
    ],
    duration: 45,
  },
  {
    id: 'third-paper',
    title: 'तेस्रो पेपर मक परीक्षा',
    urls: [
      'https://drive.google.com/file/d/170sb1CXPGWbp32BdspHVDoN7B0UecOL0/view?usp=drivesdk',
      'https://drive.google.com/file/d/1F_WPrVGfYHRFf4QK-wFm9DlwHAwh5j09/view?usp=drivesdk',
    ],
    duration: 150,
  },
];
