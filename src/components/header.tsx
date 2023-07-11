import { Header as MantineHeader, Container, Flex } from '@mantine/core'

const Header = () => (
  <MantineHeader
    height="auto"
    p="xs"
  >
    <Container>
      <Flex justify="space-between">
        <div className="flex items-center cursor-pointer">
          <svg
            width="171"
            height="40"
            viewBox="0 0 171 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.0002 2.31008C18.4754 0.881016 21.525 0.881016 24.0002 2.31008L33.3207 7.69128C35.7959 9.12034 37.3207 11.7614 37.3207 14.6195V25.3819C37.3207 28.24 35.7959 30.881 33.3207 32.3101L24.0002 37.6913C21.525 39.1203 18.4754 39.1203 16.0002 37.6913L6.67969 32.3101C4.20448 30.881 2.67969 28.24 2.67969 25.3819V14.6195C2.67969 11.7614 4.20448 9.12034 6.67969 7.69128L16.0002 2.31008Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.464 11C14.9868 11 14.6 11.3868 14.6 11.864V13.736C14.6 14.2132 14.2132 14.6 13.736 14.6L11.864 14.6L11.8634 14.6C11.3865 14.6004 11 14.987 11 15.464V18.2V29H14.6V25.4H25.4V29H29V18.2V15.464C29 14.987 28.6135 14.6004 28.1366 14.6C28.1364 14.6 28.1362 14.6 28.136 14.6L26.264 14.6C25.7868 14.6 25.4 14.2132 25.4 13.736V11.864C25.4 11.3868 25.0132 11 24.536 11H15.464ZM18.2 14.6H21.8L24.536 14.6C25.0132 14.6 25.4 14.9868 25.4 15.464V18.2V21.8H14.6V18.2V15.464C14.6 14.9868 14.9868 14.6 15.464 14.6L18.2 14.6Z"
              fill="white"
            />
            <path
              d="M65.1972 29L64.1412 25.808H58.0932L57.0132 29H52.4292L58.8132 11.768H63.7812L70.0932 29H65.1972ZM61.1652 16.76L59.3172 22.232H62.9652L61.1652 16.76ZM76.4543 29H71.9183V11.768H76.4543V29ZM84.3527 29H79.8167V11.768H86.8727C91.5287 11.768 94.1927 13.856 94.1927 17.528C94.1927 19.736 92.8727 21.56 90.5447 22.544L94.7687 29H89.3687L85.8407 23.264H84.3527V29ZM84.3527 15.512V19.52H86.6807C88.6967 19.52 89.6327 18.896 89.6327 17.528C89.6327 16.16 88.6967 15.512 86.6807 15.512H84.3527ZM103.529 29H96.8089V11.768H103.529C108.977 11.768 112.409 15.272 112.409 20.288C112.409 25.304 108.857 29 103.529 29ZM101.345 15.68V25.088H103.265C106.265 25.088 107.753 23.528 107.753 20.288C107.753 17.24 106.217 15.68 103.265 15.68H101.345ZM125.033 29L123.977 25.808H117.929L116.849 29H112.265L118.649 11.768H123.617L129.929 29H125.033ZM121.001 16.76L119.153 22.232H122.801L121.001 16.76ZM142.982 29L140.174 18.272L137.366 29H132.782L128.414 11.768H132.854L135.182 22.04L137.918 11.768H142.502L145.142 22.088L147.494 11.768H151.934L147.542 29H142.982ZM161.237 29.36C156.221 29.36 152.285 25.664 152.285 20.288C152.285 15.2 156.029 11.408 161.093 11.408C165.413 11.408 168.605 13.904 169.805 17.768H164.429C163.997 16.448 162.725 15.464 160.973 15.464C158.741 15.464 156.941 17.024 156.941 20.408C156.941 23.288 158.357 25.52 161.477 25.52C163.445 25.52 164.669 24.416 165.173 22.976H161.021V19.4H170.021C170.381 25.088 166.949 29.36 161.237 29.36Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1>2</h1>
      </Flex>
    </Container>
  </MantineHeader>
)

export default Header
