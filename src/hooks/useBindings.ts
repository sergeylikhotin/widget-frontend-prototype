import { createStructuredSelector } from 'reselect';
import jsonpointer from 'jsonpointer';
import { useSelector } from 'react-redux';

export const useBindings = (bindings: any) => {
  const selector = createStructuredSelector<any, any>(
    Object.keys(bindings ?? {}).reduce(
      (selector, key) => ({
        ...selector,
        [key]: (state: any) => jsonpointer.get(state.widget.data, bindings[key])
      }),
      {}
    )
  );

  return useSelector(selector);
};
