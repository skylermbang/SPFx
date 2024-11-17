/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import type { IFaqProps } from './IFaqProps';
import { SPFI } from '@pnp/sp';
import { IFAQ } from '../../../interfaces';
import { getSP } from '../../../pnpjsConfig';

const Faq = (props: IFaqProps) => {
  const LOG_SOURCE = 'FAQ Webpart';
  const LIST_NAME = 'FAQ_Skyler';
  console.log(LOG_SOURCE);
  const _sp: SPFI = getSP(props.context);

  const [faqItems, setFaqItems] = React.useState<IFAQ[]>([]);

  const getFAQItems = async () => {
    console.log('context', _sp);
    const items = await _sp.web.lists.getByTitle(LIST_NAME).items();
    console.log('FAQ Items:', items); // Log fetched items
    setFaqItems(items); // Store items in state
  };

  React.useEffect(() => {
    void getFAQItems(); // Call fetch function when component mounts
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(faqItems, null, 2)}</pre> {/* Display fetched items */}
    </div>
  );
};

export default Faq;
