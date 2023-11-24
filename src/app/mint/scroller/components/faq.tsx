'use client'

import { Accordion, AccordionItem } from '@nextui-org/react'
import clsx from 'clsx'

import Plus from 'public/icons/plus.svg'

const FAQs = [
  {
    title: 'What is ERC 6551?',
    content: (
      <>
        It is a new Ethereum standard that allows NFTs (ERC-721) to have their own smart contract wallets. It is not a replacement but an
        extension of ERC-721. Learn more at{' '}
        <a
          className="underline"
          href="https://tokenbound.org"
          rel="noreferrer"
          target="_blank"
        >
          tokenbound.org
        </a>
      </>
    ),
  },
  {
    title: 'What are Token Bound Accounts (TBAs)?',
    content: 'TBAs are smart contract wallets that are owned by the NFT it is linked with. All NFTs can have their own TBA.',
  },
  {
    title: 'What are NFT apps?',
    content:
      'NFT Apps are custom smart contracts that allow TBAs to perform specific actions autonomously. These are also called Light Contracts.',
  },
  {
    title: 'How does Beep Bot make money?',
    content: 'Beep Bot is free to mint and use. We charge a 0.25% transaction fee on all trades done through the bot.',
  },
  {
    title: 'Who pays for gas?',
    content:
      'The gas fees are paid by the user on each transaction just like when you purchase manually. In this case, however, Beep purchases for you!',
  },
  {
    title: 'If my Beep is compromised, would my EOA wallet be affected?',
    content:
      "No, Token Bound Accounts follow a hierarchy. Beep only has access to the Beep's Wallet (Token Bound Account). On the other hand, if your EoA wallet is compromised Beep will be affected as well.",
  },
  {
    title: 'What happens if I transfer my Beep to another address?',
    content:
      'All the tokens are held in the Beeps Wallet (TBA) such that the NFT is the owner of the wallet. The wallet that holds the Beep NFT has access to all the assets in the wallet. ',
  },
]

const FAQ = () => (
  <Accordion className="p-0 border-y-2 border-y-[#d7def0] [&>hr]:h-0.5 [&>hr]:bg-[#d7def0]">
    {FAQs.map((_faq, i) => (
      <AccordionItem
        aria-label={_faq.title}
        classNames={{
          title: 'font-bold text-lg',
          content: 'text-[#3c3c43]',
        }}
        indicator={({ isOpen }) => (
          <div className={clsx('h-3 w-3 text-[#1a0f91]', isOpen && 'rotate-45')}>
            <Plus />
          </div>
        )}
        key={i}
        title={_faq.title}
      >
        {_faq.content}
      </AccordionItem>
    ))}
  </Accordion>
)

export default FAQ
