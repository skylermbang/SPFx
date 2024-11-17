/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import type { IFaqProps } from './IFaqProps';
import { SPFI } from '@pnp/sp';
import { IFAQ } from '../../../interfaces';
import { getSP } from '../../../pnpjsConfig';
import { Accordion } from "@pnp/spfx-controls-react/lib/Accordion";

const Faq = (props: IFaqProps) => {
  const LOG_SOURCE = 'FAQ Webpart';
  const LIST_NAME = 'FAQ_Skyler';
  console.log(LIST_NAME)
  console.log(LOG_SOURCE);
  const _sp: SPFI = getSP(props.context);

  const [faqItems, setFaqItems] = React.useState<IFAQ[]>([]);

  const getFAQItems = async () => {
    console.log('context', _sp);
    const items = await _sp.web.lists.getById(props.listGuid).items.select().orderBy('Letter',true).orderBy('Title',true)();
    console.log('FAQ Items:', items); // Log fetched items
    setFaqItems((await items).map((item:any)=>{
      return{
        Id:item.Id,
        Title:item.Title,
        Body:item.Body,
        Letter:item.Letter
      }
    })); // Store items in state
  };

  React.useEffect(() => {
    if (props.listGuid && props.listGuid !==''){
      void getFAQItems()
    }
  }, [props]);

  return (
    <>
      {faqItems.map((o: IFAQ, index: number) => (
        <Accordion key={index} title={o.Title} defaultCollapsed={true}>
          <div>{o.Body}</div> 
        </Accordion>
      ))}
    </>
  );
 };

export default Faq;
