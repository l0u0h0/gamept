const raceType: { [key: string]: any } = {
  'RACE-001': 'human',
  'RACE-002': 'dwarf',
  'RACE-003': 'elf',
  'RACE-004': 'furry',
};

const jobType: {
  [key: string]: any;
} = {
  'JOB-001': 'warrior',
  'JOB-002': 'archer',
  'JOB-003': 'magician',
  'JOB-004': 'thief',
};

export const getImgCode = (
  gender: number | undefined,
  raceCode: string,
  jobCode?: string
) => {
  // console.log('코드확인', gender, raceCode, jobCode);

  let imgCode = raceType[raceCode] + '_';
  // console.log('종족추가', imgCode);
  imgCode += gender === GENDER.MALE ? 'm_' : 'w_';
  if (jobCode) {
    imgCode += jobType[jobCode];
  }
  // console.log('직업추가', imgCode);
  imgCode += '.jpg';
  return imgCode;
};

export enum GENDER {
  MALE,
  FEMALE,
}
