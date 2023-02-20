type LoadingProps = {
  isLoading: boolean
  children: JSX.Element
}

const Loading = ({ isLoading, children }: LoadingProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-grow items-center justify-center h-full w-full">
        <i className="fa-solid fa-spin fa-circle-notch" />
      </div>
    )
  }

  return children
}

export default Loading
