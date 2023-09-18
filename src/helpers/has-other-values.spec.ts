import { hasOtherValues } from './has-other-values';

interface ITestInput {
  eq?: string;
  contains?: string;
}

it('should return `false` if test object is empty', async () => {
  const obj: ITestInput = {};

  const result = hasOtherValues(obj, 'contains');

  expect(result).toBeFalsy();
});

it('should return `false` if test object contain other fields but its undefined', async () => {
  const obj: ITestInput = {
    contains: 'something',
    eq: undefined,
  };

  const result = hasOtherValues(obj, 'contains');

  expect(result).toBeFalsy();
});

it('should return `true` if test object contain other fields', async () => {
  const obj: ITestInput = {
    contains: 'something',
    eq: 'test',
  };

  const result = hasOtherValues(obj, 'contains');

  expect(result).toBeTruthy();
});
