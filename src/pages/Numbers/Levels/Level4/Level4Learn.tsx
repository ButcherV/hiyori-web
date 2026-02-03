import { LEVEL_4_DATA } from './Level4Data';
import { SplitNumberLearn } from '../SplitNumberLearn';

export const Level4Learn = () => {
  return (
    <SplitNumberLearn
      data={LEVEL_4_DATA}
      baseUnit={1000}
      initialNum={2000}
      keypadNums={[1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000]}
    />
  );
};
