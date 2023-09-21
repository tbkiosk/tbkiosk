import { Center, Group, Modal, Stack, Text } from '@mantine/core'
import classes from 'app/mint/beep/components/main/styles.module.css'
import { cx } from 'classix'
import Link from 'next/link'

const Robot = () => (
  <svg
    width="118"
    height="117"
    viewBox="0 0 118 117"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_4301_11554)">
      <path
        d="M51 4.6188C55.9504 1.76068 62.0496 1.76068 67 4.6188L101.662 24.6312C106.613 27.4893 109.662 32.7714 109.662 38.4876V78.5124C109.662 84.2286 106.613 89.5107 101.662 92.3688L67 112.381C62.0496 115.239 55.9504 115.239 51 112.381L16.3375 92.3688C11.3871 89.5107 8.33751 84.2286 8.33751 78.5124V38.4876C8.33751 32.7714 11.3871 27.4893 16.3375 24.6312L51 4.6188Z"
        fill="#E4F3FD"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38.696 42.2171H55.4522V35.7031C53.0988 34.3072 51.4985 31.7947 51.4985 28.9099C51.4985 24.5362 55.0756 21 59.5 21C63.9244 21 67.5015 24.5362 67.5015 28.9099C67.5015 32.0739 65.6188 34.7725 62.8889 36.0753V42.2171H80.304C81.9985 42.2171 83.4105 43.613 83.4105 45.288V52.5465L90 55.4313V68.6455L83.4105 72.647V81.0222C83.4105 82.6041 81.9985 84 80.304 84H38.696C37.0957 84 35.6836 82.6041 35.6836 81.0222V72.647L29 68.6455V55.4313L35.6836 52.5465V45.288C35.6836 43.613 37.0957 42.2171 38.696 42.2171ZM51.1219 48.8242C53.7577 48.8242 55.9228 50.9645 55.9228 53.6632C55.9228 56.2688 53.7577 58.4092 51.1219 58.4092C48.392 58.4092 46.321 56.2688 46.321 53.6632C46.321 50.9645 48.392 48.8242 51.1219 48.8242ZM67.0309 48.8242C69.6667 48.8242 71.8318 50.9645 71.8318 53.6632C71.8318 56.2688 69.6667 58.4092 67.0309 58.4092C64.3009 58.4092 62.2299 56.2688 62.2299 53.6632C62.2299 50.9645 64.3009 48.8242 67.0309 48.8242Z"
        fill="black"
      />
    </g>
    <defs>
      <clipPath id="clip0_4301_11554">
        <rect
          width="117"
          height="117"
          fill="white"
          transform="translate(0.5)"
        />
      </clipPath>
    </defs>
  </svg>
)

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const InstructionModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal
      withinPortal
      opened={isOpen}
      onClose={onClose}
      closeOnEscape={false}
      closeOnClickOutside={false}
      centered
      size={812}
      radius={24}
      zIndex={9999}
      styles={{
        content: {
          backgroundColor: '#FFF',
          padding: 32,
        },
        header: {
          backgroundColor: '#FFF',
          padding: 0,
        },
      }}
    >
      <Center mb={32}>
        <Robot />
      </Center>
      <Text className={cx(classes['instruction-main-text'])}>
        DCA can help an investor safely enter a market, start benefiting from long-term price appreciation, and average out the risk of
        downward price movements in the short-term.
      </Text>
      <Stack>
        <Group
          wrap={'nowrap'}
          align={'start'}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cx(classes['instruction-step'])}
          >
            <path
              d="M13 0.57735C13.6188 0.220085 14.3812 0.220085 15 0.57735L25.1244 6.42265C25.7432 6.77992 26.1244 7.44017 26.1244 8.1547V19.8453C26.1244 20.5598 25.7432 21.2201 25.1244 21.5774L15 27.4226C14.3812 27.7799 13.6188 27.7799 13 27.4226L2.87564 21.5774C2.25684 21.2201 1.87564 20.5598 1.87564 19.8453V8.1547C1.87564 7.44017 2.25684 6.77992 2.87564 6.42265L13 0.57735Z"
              fill="#78EDC1"
              fillOpacity="0.2"
            />
            <path
              d="M13.576 10.95L14.136 11.328L11.7 12.112L11.336 10.81L14.542 9.76H15.06V19H13.576V10.95Z"
              fill="#14AE5C"
            />
          </svg>
          <Text className={cx(classes['instruction-sub-text'])}>
            Deposit USDC to your token bound account, you can find it from the{' '}
            <Link
              href={'/mint/beep/settings'}
              target="_blank"
              className={cx(classes['instruction-link'])}
            >
              settings page
            </Link>
          </Text>
        </Group>
        <Group
          wrap={'nowrap'}
          align={'start'}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cx(classes['instruction-step'])}
          >
            <path
              d="M13 0.57735C13.6188 0.220085 14.3812 0.220085 15 0.57735L25.1244 6.42265C25.7432 6.77992 26.1244 7.44017 26.1244 8.1547V19.8453C26.1244 20.5598 25.7432 21.2201 25.1244 21.5774L15 27.4226C14.3812 27.7799 13.6188 27.7799 13 27.4226L2.87564 21.5774C2.25684 21.2201 1.87564 20.5598 1.87564 19.8453V8.1547C1.87564 7.44017 2.25684 6.77992 2.87564 6.42265L13 0.57735Z"
              fill="#78EDC1"
              fillOpacity="0.4"
            />
            <path
              d="M10.644 18.664L13.934 15.136C14.4473 14.5853 14.8207 14.1233 15.054 13.75C15.2873 13.3673 15.404 12.98 15.404 12.588C15.404 12.28 15.3433 12.0047 15.222 11.762C15.1007 11.5193 14.9233 11.328 14.69 11.188C14.4567 11.0387 14.1813 10.964 13.864 10.964C13.5467 10.964 13.2667 11.0387 13.024 11.188C12.7907 11.3373 12.6087 11.538 12.478 11.79C12.3567 12.042 12.296 12.3267 12.296 12.644C12.296 12.868 12.3193 13.106 12.366 13.358H10.868C10.8027 13.106 10.77 12.84 10.77 12.56C10.77 12.056 10.896 11.58 11.148 11.132C11.4 10.6747 11.764 10.306 12.24 10.026C12.716 9.746 13.262 9.606 13.878 9.606C14.4567 9.606 14.9793 9.732 15.446 9.984C15.922 10.236 16.2907 10.5813 16.552 11.02C16.8133 11.4493 16.944 11.9347 16.944 12.476C16.944 12.9147 16.8553 13.33 16.678 13.722C16.5007 14.114 16.2767 14.4827 16.006 14.828C15.7447 15.164 15.404 15.5513 14.984 15.99L12.758 18.342L12.506 17.712H17.266V19H10.644V18.664Z"
              fill="#14AE5C"
            />
          </svg>
          <Text className={cx(classes['instruction-sub-text'])}>Set up your preferred investment intervals</Text>
        </Group>
        <Group
          wrap={'nowrap'}
          align={'start'}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cx(classes['instruction-step'])}
          >
            <path
              d="M13 0.57735C13.6188 0.220085 14.3812 0.220085 15 0.57735L25.1244 6.42265C25.7432 6.77992 26.1244 7.44017 26.1244 8.1547V19.8453C26.1244 20.5598 25.7432 21.2201 25.1244 21.5774L15 27.4226C14.3812 27.7799 13.6188 27.7799 13 27.4226L2.87564 21.5774C2.25684 21.2201 1.87564 20.5598 1.87564 19.8453V8.1547C1.87564 7.44017 2.25684 6.77992 2.87564 6.42265L13 0.57735Z"
              fill="#78EDC1"
              fillOpacity="0.65"
            />
            <path
              d="M13.542 19.154C12.8047 19.154 12.156 18.972 11.596 18.608C11.036 18.2347 10.602 17.7493 10.294 17.152L11.33 16.424C11.61 16.8533 11.9227 17.1893 12.268 17.432C12.6133 17.6747 13.024 17.796 13.5 17.796C13.8547 17.796 14.1767 17.726 14.466 17.586C14.7553 17.4367 14.9793 17.2313 15.138 16.97C15.306 16.6993 15.39 16.3913 15.39 16.046C15.39 15.7007 15.306 15.4067 15.138 15.164C14.9793 14.9213 14.7413 14.7393 14.424 14.618C14.1067 14.4873 13.7193 14.422 13.262 14.422H12.24V14.016L14.872 10.488L15.054 11.118H10.952V9.76H16.706V10.166L13.934 13.89L12.87 13.428C13.038 13.3253 13.1967 13.2507 13.346 13.204C13.5047 13.1573 13.6867 13.134 13.892 13.134C14.396 13.134 14.8767 13.246 15.334 13.47C15.7913 13.6847 16.1693 14.0113 16.468 14.45C16.7667 14.8887 16.916 15.416 16.916 16.032C16.916 16.648 16.762 17.194 16.454 17.67C16.146 18.146 15.7353 18.5147 15.222 18.776C14.7087 19.028 14.1487 19.154 13.542 19.154Z"
              fill="#14AE5C"
            />
          </svg>
          <Text className={cx(classes['instruction-sub-text'])}>Enter the amount you would like to invest each time</Text>
        </Group>
        <Group
          wrap={'nowrap'}
          align={'start'}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cx(classes['instruction-step'])}
          >
            <path
              d="M13 0.57735C13.6188 0.220085 14.3812 0.220085 15 0.57735L25.1244 6.42265C25.7432 6.77992 26.1244 7.44017 26.1244 8.1547V19.8453C26.1244 20.5598 25.7432 21.2201 25.1244 21.5774L15 27.4226C14.3812 27.7799 13.6188 27.7799 13 27.4226L2.87564 21.5774C2.25684 21.2201 1.87564 20.5598 1.87564 19.8453V8.1547C1.87564 7.44017 2.25684 6.77992 2.87564 6.42265L13 0.57735Z"
              fill="#78EDC1"
            />
            <path
              d="M10.252 16.984L13.206 9.76H14.732L11.876 16.732V16.116H17.616V17.39H10.252V16.984ZM14.872 13.274H16.356V19H14.872V13.274Z"
              fill="#14AE5C"
            />
          </svg>
          <Text className={cx(classes['instruction-sub-text'])}>
            Once the above are done, turn your bot on and Beep will start investing automatically
          </Text>
        </Group>
      </Stack>
    </Modal>
  )
}