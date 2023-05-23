import { Avatar, Button, GradientText } from '@/components'
import { EventProject } from '@/types/project'

export const Event = ({ link, description, date, name, eligibilities, logos }: EventProject) => {
  const openLinkInNewTab = () => {
    window.open(link, '_blank')
  }

  return (
    <div>
      <div className="pt-10 px-16 pb-7">
        <div className="mb-2 flex items-center">
          <Avatar
            src={logos[0]}
            alt={name}
            size={'medium'}
            className="mr-4"
          />
          <p className="text-4xl">{name}</p>
        </div>
        <GradientText>{date}</GradientText>
        <p className="my-8 text-lg font-medium">{description}</p>
        <p className="text-2xl mb-3 font-bold">Eligibility</p>
        <div className="grid gap-5 mb-16">
          {eligibilities.map((eligibility, index) => (
            <p
              className="flex items-center"
              key={index}
            >
              <svg
                width="24"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 7.22222L8.85714 15L23 1"
                  stroke="#82FFAC"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-lg ml-6 font-medium">{eligibility}</span>
            </p>
          ))}
        </div>
        <Button
          className="text-xl w-[20rem] block mx-auto"
          onClick={openLinkInNewTab}
        >
          RSVP on Tokenproof
        </Button>
      </div>
    </div>
  )
}
