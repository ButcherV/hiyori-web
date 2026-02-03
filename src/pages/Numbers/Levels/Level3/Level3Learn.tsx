import { LEVEL_3_DATA } from './Level3Data';
// 引入通用组件
import { SplitNumberLearn } from '../SplitNumberLearn';

export const Level3Learn = () => {
  return (
    <SplitNumberLearn
      data={LEVEL_3_DATA}
      baseUnit={100}
      initialNum={200}
      keypadNums={[100, 200, 300, 400, 500, 600, 700, 800, 900]}
    />
  );
};
